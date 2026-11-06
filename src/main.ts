import { InstanceBase, InstanceStatus, type SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig, type ModuleSecrets } from './config.js'
import { UpdateVariableDefinitions, UpdateVariableValues, type VariablesSchema } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions, type ActionsSchema } from './actions.js'
import { UpdateFeedbacks, type FeedbacksSchema } from './feedbacks.js'
import { UpdatePresets } from './presets.js'
import { NvsApi, asBoolean, asNumber, asString, type NvsParams, type NvsResponse } from './nvs.js'

export type ModuleSchema = {
	config: ModuleConfig
	secrets: ModuleSecrets
	actions: ActionsSchema
	feedbacks: FeedbacksSchema
	variables: VariablesSchema
}

export type StreamState = {
	status: number
	streamType: number
	encoderNum: number
}

export type RecordState = {
	status: number
	encoderNum: number
	fileName: string
}

export type EncoderState = {
	bitrate: number
	width: number
	height: number
	framerate: number
	gop: number
	profile: number
}

export type InputState = {
	signal: boolean
	width: number
	height: number
	framerate: string
	interlaced: boolean
	channels: number
	sampleRate: number
	bitsPerSample: number
}

export type ModuleState = {
	streaming: Record<number, StreamState>
	recording: Record<number, RecordState>
	encoder: Record<number, EncoderState>
	videoSource: number
	audioSource: number
	input: InputState
	pgm: { type: number; arg1: number; arg2: number; scale: number; bgColor: string }
	multiview: { type: number; multiviewFps: number; pgmFps: number; multiviewVolume: number; pgmVolume: number }
	hlsPreview: boolean
	storage: { capacity: string; remain: string }
	version: { software: string; firmware: string; hardware: string }
	deviceName: string
}

const emptyStream = (): StreamState => ({ status: 0, streamType: 0, encoderNum: -1 })
const emptyRecord = (): RecordState => ({ status: 0, encoderNum: -1, fileName: '' })
const emptyEncoder = (): EncoderState => ({ bitrate: 0, width: 0, height: 0, framerate: 0, gop: 0, profile: 0 })

function createDefaultState(): ModuleState {
	return {
		streaming: { 1: emptyStream(), 2: emptyStream() },
		recording: { 1: emptyRecord(), 2: emptyRecord() },
		encoder: { 0: emptyEncoder(), 1: emptyEncoder() },
		videoSource: -1,
		audioSource: -1,
		input: {
			signal: false,
			width: 0,
			height: 0,
			framerate: '',
			interlaced: false,
			channels: 0,
			sampleRate: 0,
			bitsPerSample: 0,
		},
		pgm: { type: -1, arg1: -1, arg2: -1, scale: -1, bgColor: '' },
		multiview: { type: -1, multiviewFps: 0, pgmFps: 0, multiviewVolume: 0, pgmVolume: 0 },
		hlsPreview: false,
		storage: { capacity: '', remain: '' },
		version: { software: '', firmware: '', hardware: '' },
		deviceName: '',
	}
}

function partitionValue(data: NvsResponse, field: 'capacity' | 'remain'): string {
	for (const [key, value] of Object.entries(data)) {
		const lower = key.toLowerCase()
		if (lower.startsWith('partition_') && lower.includes('_0_') && lower.endsWith(field)) {
			return asString(value)
		}
	}
	return ''
}

export { UpgradeScripts }

export default class ModuleInstance extends InstanceBase<ModuleSchema> {
	config!: ModuleConfig
	secrets: ModuleSecrets = {}
	readonly state: ModuleState = createDefaultState()

	api: NvsApi

	private pollTimer: NodeJS.Timeout | undefined
	private refreshTimer: NodeJS.Timeout | undefined
	private polling = false
	private pollCount = 0

	constructor(internal: unknown) {
		super(internal)
		this.api = this.createApi()
	}

	private createApi(): NvsApi {
		const config = this.config
		return new NvsApi(
			{
				host: config?.host?.trim() || '127.0.0.1',
				port: Number(config?.port) || 80,
				username: config?.username?.trim() || 'admin',
				password: this.secrets?.password?.trim() || '0000',
				channel: Number(config?.channel) || 0,
			},
			(level, message) => this.log(level, message),
		)
	}

	async init(config: ModuleConfig, _isFirstInit: boolean, secrets: ModuleSecrets): Promise<void> {
		this.config = config
		this.secrets = secrets ?? {}
		this.api = this.createApi()

		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updatePresets()

		this.updateStatus(InstanceStatus.Connecting)
		await this.connect()
	}

	async destroy(): Promise<void> {
		this.stopPolling()
		if (this.refreshTimer) {
			clearTimeout(this.refreshTimer)
			this.refreshTimer = undefined
		}
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig, secrets: ModuleSecrets): Promise<void> {
		this.config = config
		this.secrets = secrets ?? {}
		this.api = this.createApi()
		this.pollCount = 0
		await this.connect()
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	/** Queues a refresh shortly after a command, so buttons update quickly without hammering the device. */
	refreshSoon(): void {
		if (this.refreshTimer) clearTimeout(this.refreshTimer)
		this.refreshTimer = setTimeout(() => {
			this.refreshTimer = undefined
			void this.poll()
		}, 250)
	}

	private async connect(): Promise<void> {
		this.stopPolling()
		try {
			await this.api.login()
		} catch (error) {
			this.reportFailure(error)
			this.startPolling()
			return
		}

		await this.readDeviceInfo()
		await this.poll()
		this.startPolling()
	}

	private startPolling(): void {
		this.stopPolling()

		const configured = Number(this.config?.pollInterval)
		if (!Number.isFinite(configured) || configured <= 0) return

		const interval = Math.max(configured, 500)
		this.pollTimer = setInterval(() => {
			void this.poll()
		}, interval)
	}

	private stopPolling(): void {
		if (this.pollTimer) {
			clearInterval(this.pollTimer)
			this.pollTimer = undefined
		}
	}

	private reportFailure(error: unknown): void {
		const message = error instanceof Error ? error.message : String(error)
		this.updateStatus(InstanceStatus.ConnectionFailure, message)
		this.log('debug', `Device connection failed: ${message}`)
	}

	private async readOptional(fn: string, params: NvsParams = {}): Promise<NvsResponse | null> {
		try {
			return await this.api.call(fn, params)
		} catch (error) {
			this.log('debug', `${fn} unavailable: ${error instanceof Error ? error.message : String(error)}`)
			return null
		}
	}

	private async readDeviceInfo(): Promise<void> {
		const version = await this.readOptional('SYSTEM_GET_VERSION_INFO')
		if (version) {
			this.state.version.software = asString(version['SoftwareVersion'])
			this.state.version.firmware = asString(version['FirmwareVersion'])
			this.state.version.hardware = asString(version['HardwareVersion'])
		} else {
			const firmware = await this.readOptional('SYSTEM_GET_FIRMWARE_VERSION')
			if (firmware) this.state.version.firmware = asString(firmware['strVersion'])
		}

		const board = await this.readOptional('SYSTEM_GET_BOARD_PROPERTY')
		if (board) this.state.deviceName = asString(board['BoardName'] ?? board['BoardID'])
	}

	async poll(): Promise<void> {
		if (this.polling) return
		this.polling = true

		try {
			await this.refreshState()
			this.updateStatus(InstanceStatus.Ok)
			UpdateVariableValues(this)
			this.checkFeedbacks(
				'streaming_active',
				'streaming_any',
				'recording_active',
				'recording_any',
				'video_source_is',
				'audio_source_is',
				'signal_present',
				'pgm_type_is',
				'multiview_type_is',
				'hls_preview_active',
			)
		} catch (error) {
			this.api.resetSession()
			this.reportFailure(error)
		} finally {
			this.polling = false
		}
	}

	private async refreshState(): Promise<void> {
		this.pollCount += 1

		// The first call is the connection check: any network or login problem surfaces here.
		const streamingMain = await this.api.call('APPS_GET_STREAMING_STATUS', { StreamNum: 1 })
		this.state.streaming[1] = {
			status: asNumber(streamingMain['Status']),
			streamType: asNumber(streamingMain['StreamType']),
			encoderNum: asNumber(streamingMain['EncoderNum'], -1),
		}

		const streamingSub = await this.readOptional('APPS_GET_STREAMING_STATUS', { StreamNum: 2 })
		if (streamingSub) {
			this.state.streaming[2] = {
				status: asNumber(streamingSub['Status']),
				streamType: asNumber(streamingSub['StreamType']),
				encoderNum: asNumber(streamingSub['EncoderNum'], -1),
			}
		}

		for (const record of [1, 2]) {
			const recordState = await this.readOptional('APPS_GET_RECORD_STATUS', { RecordNum: record })
			if (!recordState) continue
			this.state.recording[record] = {
				status: asNumber(recordState['Status']),
				encoderNum: asNumber(recordState['EncoderNum'], -1),
				fileName: asString(recordState['RecordingFileName']),
			}
		}

		const videoSource = await this.readOptional('APPS_GET_VIDEO_SOURCE')
		if (videoSource) this.state.videoSource = asNumber(videoSource['VideoSource'], -1)

		const audioSource = await this.readOptional('APPS_GET_AUDIO_SOURCE')
		if (audioSource) this.state.audioSource = asNumber(audioSource['AudioSource'], -1)

		const inputFormat = await this.readOptional('APPS_GET_INPUT_FORMAT')
		if (inputFormat) {
			this.state.input = {
				signal: asBoolean(inputFormat['Signal'], true),
				width: asNumber(inputFormat['Width']),
				height: asNumber(inputFormat['Height']),
				framerate: asString(inputFormat['Framerate']),
				interlaced: asNumber(inputFormat['Interleaved']) === 1,
				channels: asNumber(inputFormat['Channels']),
				sampleRate: asNumber(inputFormat['SampleFrequency']),
				bitsPerSample: asNumber(inputFormat['BitsPerSample']),
			}
		}

		const pgm = await this.readOptional('APPS_GET_PGM_STATUS')
		if (pgm) {
			this.state.pgm = {
				type: asNumber(pgm['PgmType'], -1),
				arg1: asNumber(pgm['PgmArg1'], -1),
				arg2: asNumber(pgm['PgmArg2'], -1),
				scale: asNumber(pgm['PgmScale'], -1),
				bgColor: asString(pgm['PgmBkColor']),
			}
		}

		const multiview = await this.readOptional('APPS_GET_MULTIVIEW_STATUS')
		if (multiview) this.state.multiview.type = asNumber(multiview['MultiviewType'], -1)

		const monitorVolume = await this.readOptional('APPS_GET_MONITOR_VOLUME')
		if (monitorVolume) {
			this.state.multiview.multiviewVolume = asNumber(monitorVolume['MultiviewVolume'])
			this.state.multiview.pgmVolume = asNumber(monitorVolume['PgmVolume'])
		}

		const monitorFps = await this.readOptional('APPS_GET_MONITOR_FPS')
		if (monitorFps) {
			this.state.multiview.multiviewFps = asNumber(monitorFps['MultiviewFps'])
			this.state.multiview.pgmFps = asNumber(monitorFps['PgmFps'])
		}

		const hlsPreview = await this.readOptional('SYSTEM_GET_HLS_PREVIEW')
		if (hlsPreview) this.state.hlsPreview = asBoolean(hlsPreview['HLSPreviewEnable'])

		// Encoder settings change rarely, so they are refreshed on the first poll and then periodically.
		if (this.pollCount === 1 || this.pollCount % 5 === 0) {
			for (const encoder of [0, 1]) {
				const encoderState = await this.readOptional('APPS_GET_ENCODER_PROPERTY', { EncoderNum: encoder })
				if (!encoderState) continue
				this.state.encoder[encoder] = {
					bitrate: asNumber(encoderState['BitRate']),
					width: asNumber(encoderState['Width']),
					height: asNumber(encoderState['Height']),
					framerate: asNumber(encoderState['Framerate']),
					gop: asNumber(encoderState['GOP']),
					profile: asNumber(encoderState['Profile']),
				}
			}

			const disk = await this.readOptional('SYSTEM_GET_DISK_INFO', { DiskNum: 0 })
			if (disk) {
				this.state.storage = {
					capacity: partitionValue(disk, 'capacity'),
					remain: partitionValue(disk, 'remain'),
				}
			}
		}
	}
}
