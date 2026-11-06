import { InstanceStatus } from '@companion-module/base'
import type ModuleInstance from './main.js'
import { asNumber } from './nvs.js'
import {
	AUDIO_SOURCES,
	ENCODER_PROFILES,
	MULTIVIEW_TYPES,
	PGM_SCALES,
	PGM_TYPES,
	RECORD_FILE_TYPES,
	STREAM_TYPES,
	VIDEO_SOURCES,
} from './labels.js'

export type ActionsSchema = {
	streaming_start: { options: { stream: number; streamType: number } }
	streaming_stop: { options: { stream: number } }
	streaming_toggle: { options: { stream: number; streamType: number } }
	encoder_set_bitrate: { options: { encoder: number; bitrate: number } }
	encoder_set_resolution: { options: { encoder: number; width: number; height: number } }
	encoder_set_framerate: { options: { encoder: number; framerate: number } }
	encoder_set_gop: { options: { encoder: number; gop: number } }
	encoder_set_profile: { options: { encoder: number; profile: number } }
	encoder_set_audio_bitrate: { options: { encoder: number; bitrate: number } }
	rtsp_set_property: {
		options: {
			stream: number
			port: number
			httpPort: number
			account: string
			password: string
			streamName: string
			multicast: boolean
		}
	}
	rtmp_set_publish: { options: { stream: number; url: string; streamName: string; account: string; password: string } }
	ts_set_url: { options: { stream: number; url: string } }
	hls_set_video_only: { options: { stream: number; videoOnly: boolean } }
	hls_preview_set: { options: { enabled: boolean } }
	srt_set_port: { options: { port: number } }
	streaming_logout: { options: { platform: number } }
	youtube_connect: { options: Record<string, never> }
	facebook_connect: { options: Record<string, never> }
	record_start: { options: { record: number } }
	record_stop: { options: { record: number } }
	record_toggle: { options: { record: number } }
	record_set_property: { options: { record: number; fileName: string; fileType: number; fileLive: number } }
	video_source_set: { options: { source: number } }
	video_source_set_ip_stream: { options: { url: string; protocol: number; account: string; password: string } }
	video_source_set_picture: { options: { pictureName: string } }
	video_source_set_file: { options: { filePath: string } }
	audio_source_set: { options: { source: number } }
	audio_volume_set: { options: { volume: number; standard: number } }
	audio_volume_adjust: { options: { amount: number } }
	video_tuning_set: {
		options: { brightness: number; contrast: number; hue: number; saturation: number; sharpness: number }
	}
	video_mirror_set: { options: { vertical: boolean; horizontal: boolean } }
	pgm_set_layout: { options: { pgmType: number; arg1: number; arg2: number; bgColor: number; scale: number } }
	pgm_set_position: { options: { sprite: number; x: number; y: number; width: number; height: number; layer: number } }
	multiview_set_type: { options: { multiviewType: number } }
	monitor_set_fps: { options: { multiviewFps: number; pgmFps: number } }
	monitor_set_volume: { options: { multiviewVolume: number; pgmVolume: number } }
	osd_set_text: {
		options: {
			layer: number
			text: string
			x: number
			y: number
			width: number
			height: number
			textSize: number
			fontColor: number
		}
	}
	osd_set_enabled: { options: { layer: number; enabled: boolean } }
	snapshot_take: { options: { fileName: string; fileType: number; quality: number } }
	mixer_set_volume: { options: { mixerId: number; volume: number } }
	device_set_name: { options: { name: string } }
	device_reboot: { options: Record<string, never> }
	refresh: { options: Record<string, never> }
}

const streamChoices = [
	{ id: 1, label: 'Main stream' },
	{ id: 2, label: 'Sub stream' },
]

const streamTypeChoices = Object.entries(STREAM_TYPES).map(([id, label]) => ({ id: Number(id), label }))

const encoderChoices = [
	{ id: 0, label: 'Main encoder' },
	{ id: 1, label: 'Sub encoder' },
]

const recordChoices = [
	{ id: 1, label: 'Main recording' },
	{ id: 2, label: 'Sub recording' },
]

const videoSourceChoices = Object.entries(VIDEO_SOURCES).map(([id, label]) => ({ id: Number(id), label }))
const audioSourceChoices = Object.entries(AUDIO_SOURCES).map(([id, label]) => ({ id: Number(id), label }))
const pgmTypeChoices = Object.entries(PGM_TYPES).map(([id, label]) => ({ id: Number(id), label }))
const pgmScaleChoices = Object.entries(PGM_SCALES).map(([id, label]) => ({ id: Number(id), label }))
const multiviewChoices = Object.entries(MULTIVIEW_TYPES).map(([id, label]) => ({ id: Number(id), label }))
const profileChoices = Object.entries(ENCODER_PROFILES).map(([id, label]) => ({ id: Number(id), label }))
const recordFileTypeChoices = Object.entries(RECORD_FILE_TYPES).map(([id, label]) => ({ id: Number(id), label }))
const mixerChoices = [
	{ id: 0, label: 'CH1 embedded' },
	{ id: 1, label: 'CH2 embedded' },
	{ id: 2, label: 'CH3 embedded' },
	{ id: 3, label: 'CH4 embedded' },
	{ id: 4, label: 'CH1 line-in' },
	{ id: 5, label: 'CH2 line-in' },
	{ id: 6, label: 'CH3 line-in' },
	{ id: 7, label: 'CH4 line-in' },
]
const audioStandardChoices = [
	{ id: 0, label: 'Manual (volume control)' },
	{ id: 1, label: 'SMPTE' },
	{ id: 2, label: 'EBU' },
]
const protocolChoices = [
	{ id: 0, label: 'UDP' },
	{ id: 1, label: 'TCP' },
]
const snapshotFileTypeChoices = [
	{ id: 0, label: 'JPEG' },
	{ id: 1, label: 'BMP' },
]
const platformChoices = [
	{ id: 5, label: 'YouTube' },
	{ id: 6, label: 'Facebook' },
]

const ENCODER_WRITABLE_KEYS = [
	'Framerate',
	'GOP',
	'BitRate',
	'Profile',
	'Level',
	'Entropy',
	'Width',
	'Height',
	'AudioBitrate',
	'CropX',
	'CropY',
	'CropWidth',
	'CropHeight',
	'CropW',
	'CropH',
	'ColorRange',
]

const RECORD_WRITABLE_KEYS = ['FileName', 'FileSize', 'FileType', 'FileLive', 'LoopRecord']

const RTSP_WRITABLE_KEYS = ['RtspPort', 'RtspPortHttp', 'RtspAccount', 'RtspPassword', 'RtspStreamName', 'Multicast']

const RTMP_WRITABLE_KEYS = ['RtmpUrl', 'RtmpStreamName', 'RtmpAccount', 'RtmpPassword']

const PGM_WRITABLE_KEYS = ['PgmType', 'PgmArg1', 'PgmArg2', 'PgmBkColor', 'PgmScale']

const OSD_WRITABLE_KEYS = [
	'OsdType',
	'PositionX',
	'PositionY',
	'Width',
	'Height',
	'TextSize',
	'FontColor',
	'PictureName',
	'OsdText',
]

const MONITOR_VOLUME_KEYS = ['MultiviewVolume', 'PgmVolume']
const MONITOR_FPS_KEYS = ['MultiviewFps', 'PgmFps']

function encoderForStream(stream: number): number {
	return stream === 2 ? 1 : 0
}

function hexColor(value: number): string {
	return (Math.max(0, Math.trunc(value)) & 0xffffff).toString(16).padStart(6, '0')
}

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		streaming_start: {
			name: 'Streaming: Start',
			description: 'Starts a stream on the device (the protocol is part of the command).',
			options: [
				{ id: 'stream', type: 'dropdown', label: 'Stream', choices: streamChoices, default: 1 },
				{ id: 'streamType', type: 'dropdown', label: 'Protocol', choices: streamTypeChoices, default: 1 },
			],
			callback: async (event) => {
				const stream = event.options.stream
				await self.api.call('APPS_SET_STREAMING_STATUS', {
					StreamNum: stream,
					EncoderNum: encoderForStream(stream),
					StreamType: event.options.streamType,
					Status: 1,
				})
				self.refreshSoon()
			},
		},
		streaming_stop: {
			name: 'Streaming: Stop',
			options: [{ id: 'stream', type: 'dropdown', label: 'Stream', choices: streamChoices, default: 1 }],
			callback: async (event) => {
				const stream = event.options.stream
				const current = await self.api.call('APPS_GET_STREAMING_STATUS', { StreamNum: stream })
				await self.api.call('APPS_SET_STREAMING_STATUS', {
					StreamNum: stream,
					EncoderNum: encoderForStream(stream),
					StreamType: asNumber(current['StreamType']),
					Status: 0,
				})
				self.refreshSoon()
			},
		},
		streaming_toggle: {
			name: 'Streaming: Toggle',
			description: 'Starts the stream when it is stopped, stops it when it is running.',
			options: [
				{ id: 'stream', type: 'dropdown', label: 'Stream', choices: streamChoices, default: 1 },
				{
					id: 'streamType',
					type: 'dropdown',
					label: 'Protocol to start with',
					choices: streamTypeChoices,
					default: 1,
				},
			],
			callback: async (event) => {
				const stream = event.options.stream
				const current = await self.api.call('APPS_GET_STREAMING_STATUS', { StreamNum: stream })
				const isStreaming = asNumber(current['Status']) === 1
				await self.api.call('APPS_SET_STREAMING_STATUS', {
					StreamNum: stream,
					EncoderNum: encoderForStream(stream),
					StreamType: isStreaming ? asNumber(current['StreamType']) : event.options.streamType,
					Status: isStreaming ? 0 : 1,
				})
				self.refreshSoon()
			},
		},
		encoder_set_bitrate: {
			name: 'Encoder: Set video bitrate',
			options: [
				{ id: 'encoder', type: 'dropdown', label: 'Encoder', choices: encoderChoices, default: 0 },
				{ id: 'bitrate', type: 'number', label: 'Bitrate (kbps)', default: 4000, min: 44, max: 65536 },
			],
			callback: async (event) => {
				await self.api.setWithMerge(
					'APPS_GET_ENCODER_PROPERTY',
					{ EncoderNum: event.options.encoder },
					'APPS_SET_ENCODER_PROPERTY',
					ENCODER_WRITABLE_KEYS,
					{ BitRate: event.options.bitrate },
				)
				self.refreshSoon()
			},
		},
		encoder_set_resolution: {
			name: 'Encoder: Set resolution',
			options: [
				{ id: 'encoder', type: 'dropdown', label: 'Encoder', choices: encoderChoices, default: 0 },
				{ id: 'width', type: 'number', label: 'Width (px)', default: 1920, min: 128, max: 1920, step: 2 },
				{ id: 'height', type: 'number', label: 'Height (px)', default: 1080, min: 64, max: 1080, step: 2 },
			],
			callback: async (event) => {
				await self.api.setWithMerge(
					'APPS_GET_ENCODER_PROPERTY',
					{ EncoderNum: event.options.encoder },
					'APPS_SET_ENCODER_PROPERTY',
					ENCODER_WRITABLE_KEYS,
					{ Width: event.options.width, Height: event.options.height },
				)
				self.refreshSoon()
			},
		},
		encoder_set_framerate: {
			name: 'Encoder: Set frame rate',
			options: [
				{ id: 'encoder', type: 'dropdown', label: 'Encoder', choices: encoderChoices, default: 0 },
				{ id: 'framerate', type: 'number', label: 'Frame rate (fps)', default: 30, min: 1, max: 60 },
			],
			callback: async (event) => {
				await self.api.setWithMerge(
					'APPS_GET_ENCODER_PROPERTY',
					{ EncoderNum: event.options.encoder },
					'APPS_SET_ENCODER_PROPERTY',
					ENCODER_WRITABLE_KEYS,
					{ Framerate: event.options.framerate },
				)
				self.refreshSoon()
			},
		},
		encoder_set_gop: {
			name: 'Encoder: Set GOP',
			options: [
				{ id: 'encoder', type: 'dropdown', label: 'Encoder', choices: encoderChoices, default: 0 },
				{ id: 'gop', type: 'number', label: 'GOP length', default: 30, min: 1, max: 255 },
			],
			callback: async (event) => {
				await self.api.setWithMerge(
					'APPS_GET_ENCODER_PROPERTY',
					{ EncoderNum: event.options.encoder },
					'APPS_SET_ENCODER_PROPERTY',
					ENCODER_WRITABLE_KEYS,
					{ GOP: event.options.gop },
				)
				self.refreshSoon()
			},
		},
		encoder_set_profile: {
			name: 'Encoder: Set H.264 profile',
			options: [
				{ id: 'encoder', type: 'dropdown', label: 'Encoder', choices: encoderChoices, default: 0 },
				{ id: 'profile', type: 'dropdown', label: 'Profile', choices: profileChoices, default: 2 },
			],
			callback: async (event) => {
				await self.api.setWithMerge(
					'APPS_GET_ENCODER_PROPERTY',
					{ EncoderNum: event.options.encoder },
					'APPS_SET_ENCODER_PROPERTY',
					ENCODER_WRITABLE_KEYS,
					{ Profile: event.options.profile },
				)
				self.refreshSoon()
			},
		},
		encoder_set_audio_bitrate: {
			name: 'Encoder: Set audio bitrate',
			options: [
				{ id: 'encoder', type: 'dropdown', label: 'Encoder', choices: encoderChoices, default: 0 },
				{ id: 'bitrate', type: 'number', label: 'Audio bitrate (kbps)', default: 128, min: 32, max: 384 },
			],
			callback: async (event) => {
				await self.api.setWithMerge(
					'APPS_GET_ENCODER_PROPERTY',
					{ EncoderNum: event.options.encoder },
					'APPS_SET_ENCODER_PROPERTY',
					ENCODER_WRITABLE_KEYS,
					{ AudioBitrate: event.options.bitrate },
				)
				self.refreshSoon()
			},
		},
		rtsp_set_property: {
			name: 'RTSP: Set server properties',
			description: 'Changes the RTSP port, credentials and stream name.',
			options: [
				{ id: 'stream', type: 'dropdown', label: 'Stream', choices: streamChoices, default: 1 },
				{ id: 'port', type: 'number', label: 'RTSP port', default: 554, min: 1, max: 65535 },
				{ id: 'httpPort', type: 'number', label: 'RTSP over HTTP port', default: 8000, min: 1, max: 65535 },
				{ id: 'account', type: 'textinput', label: 'Account', default: '' },
				{ id: 'password', type: 'textinput', label: 'Password', default: '' },
				{ id: 'streamName', type: 'textinput', label: 'Stream name', default: 'session0.mpg' },
				{ id: 'multicast', type: 'checkbox', label: 'Multicast', default: false },
			],
			callback: async (event) => {
				await self.api.setWithMerge(
					'APPS_GET_RTSP_PROPERTY',
					{ StreamNum: event.options.stream },
					'APPS_SET_RTSP_PROPERTY',
					RTSP_WRITABLE_KEYS,
					{
						RtspPort: event.options.port,
						RtspPortHttp: event.options.httpPort,
						RtspAccount: event.options.account,
						RtspPassword: event.options.password,
						RtspStreamName: event.options.streamName,
						Multicast: event.options.multicast ? 1 : 0,
					},
				)
				self.refreshSoon()
			},
		},
		rtmp_set_publish: {
			name: 'RTMP: Set publish target',
			description: 'Sets the RTMP/RTMPS server address, stream name and credentials.',
			options: [
				{ id: 'stream', type: 'dropdown', label: 'Stream', choices: streamChoices, default: 1 },
				{ id: 'url', type: 'textinput', label: 'RTMP URL', default: 'rtmp://', useVariables: true },
				{ id: 'streamName', type: 'textinput', label: 'Stream name / key', default: '', useVariables: true },
				{ id: 'account', type: 'textinput', label: 'Account (optional)', default: '', useVariables: true },
				{ id: 'password', type: 'textinput', label: 'Password (optional)', default: '', useVariables: true },
			],
			callback: async (event) => {
				await self.api.setWithMerge(
					'APPS_GET_RTMP_PROPERTY',
					{ StreamNum: event.options.stream },
					'APPS_SET_RTMP_PROPERTY',
					RTMP_WRITABLE_KEYS,
					{
						RtmpUrl: event.options.url,
						RtmpStreamName: event.options.streamName,
						RtmpAccount: event.options.account,
						RtmpPassword: event.options.password,
					},
				)
				self.refreshSoon()
			},
		},
		ts_set_url: {
			name: 'TS: Set output address',
			description: 'TS over UDP target, for example udp://239.0.0.1:1234.',
			options: [
				{ id: 'stream', type: 'dropdown', label: 'Stream', choices: streamChoices, default: 1 },
				{ id: 'url', type: 'textinput', label: 'TS URL', default: 'udp://239.0.0.1:1234', useVariables: true },
			],
			callback: async (event) => {
				await self.api.call('APPS_SET_TS_PROPERTY', {
					StreamNum: event.options.stream,
					TsUrl: event.options.url,
				})
				self.refreshSoon()
			},
		},
		hls_set_video_only: {
			name: 'HLS: Set video only',
			options: [
				{ id: 'stream', type: 'dropdown', label: 'Stream', choices: streamChoices, default: 1 },
				{ id: 'videoOnly', type: 'checkbox', label: 'Video only (no audio)', default: false },
			],
			callback: async (event) => {
				await self.api.call('APPS_SET_HLS_PROPERTY', {
					StreamNum: event.options.stream,
					HLSVideoOnly: event.options.videoOnly ? 1 : 0,
				})
				self.refreshSoon()
			},
		},
		hls_preview_set: {
			name: 'HLS: Enable or disable preview',
			options: [{ id: 'enabled', type: 'checkbox', label: 'HLS preview enabled', default: true }],
			callback: async (event) => {
				await self.api.call('SYSTEM_SET_HLS_PREVIEW', { HLSPreviewEnable: event.options.enabled ? 1 : 0 })
				self.refreshSoon()
			},
		},
		srt_set_port: {
			name: 'SRT: Set listener port',
			description: 'Sets the SRT listener port (models with SRT support).',
			options: [{ id: 'port', type: 'number', label: 'SRT port', default: 9001, min: 1, max: 65535 }],
			callback: async (event) => {
				await self.api.call('APPS_SET_SRT_PROPERTY', { SrtPort: event.options.port })
				self.refreshSoon()
			},
		},
		streaming_logout: {
			name: 'Streaming: Unlink YouTube / Facebook',
			description: 'Logs the device out of a linked streaming platform.',
			options: [{ id: 'platform', type: 'dropdown', label: 'Platform', choices: platformChoices, default: 5 }],
			callback: async (event) => {
				await self.api.call(event.options.platform === 6 ? 'APPS_SET_FACEBOOK_LOGOUT' : 'APPS_SET_YOUTUBE_LOGOUT')
				self.refreshSoon()
			},
		},
		youtube_connect: {
			name: 'Streaming: Link YouTube account',
			description: 'Asks the device to open a YouTube linking session (multi-channel models).',
			options: [],
			callback: async () => {
				await self.api.call('APPS_CHANGE_RTMP_DEVICE', { StreamNum: 1, StreamType: 11 })
				self.refreshSoon()
			},
		},
		facebook_connect: {
			name: 'Streaming: Link Facebook account',
			description: 'Asks the device to open a Facebook linking session (multi-channel models).',
			options: [],
			callback: async () => {
				await self.api.call('APPS_CHANGE_RTMP_DEVICE', { StreamNum: 1, StreamType: 12 })
				self.refreshSoon()
			},
		},
		record_start: {
			name: 'Recording: Start',
			options: [{ id: 'record', type: 'dropdown', label: 'Recording', choices: recordChoices, default: 1 }],
			callback: async (event) => {
				await self.api.call('APPS_SET_RECORD_STATUS', {
					RecordNum: event.options.record,
					EncoderNum: event.options.record === 2 ? 1 : 0,
					Status: 1,
				})
				self.refreshSoon()
			},
		},
		record_stop: {
			name: 'Recording: Stop',
			options: [{ id: 'record', type: 'dropdown', label: 'Recording', choices: recordChoices, default: 1 }],
			callback: async (event) => {
				await self.api.call('APPS_SET_RECORD_STATUS', {
					RecordNum: event.options.record,
					EncoderNum: event.options.record === 2 ? 1 : 0,
					Status: 0,
				})
				self.refreshSoon()
			},
		},
		record_toggle: {
			name: 'Recording: Toggle',
			options: [{ id: 'record', type: 'dropdown', label: 'Recording', choices: recordChoices, default: 1 }],
			callback: async (event) => {
				const record = event.options.record
				const current = await self.api.call('APPS_GET_RECORD_STATUS', { RecordNum: record })
				const isRecording = asNumber(current['Status']) === 1
				await self.api.call('APPS_SET_RECORD_STATUS', {
					RecordNum: record,
					EncoderNum: record === 2 ? 1 : 0,
					Status: isRecording ? 0 : 1,
				})
				self.refreshSoon()
			},
		},
		record_set_property: {
			name: 'Recording: Set file properties',
			description: 'Sets the recording file name, container and duration.',
			options: [
				{ id: 'record', type: 'dropdown', label: 'Recording', choices: recordChoices, default: 1 },
				{ id: 'fileName', type: 'textinput', label: 'File name', default: 'NVS33', useVariables: true },
				{ id: 'fileType', type: 'dropdown', label: 'File type', choices: recordFileTypeChoices, default: 1 },
				{ id: 'fileLive', type: 'number', label: 'Segment duration (minutes)', default: 30, min: 1, max: 240 },
			],
			callback: async (event) => {
				await self.api.setWithMerge(
					'APPS_GET_RECORD_PROPERTY',
					{ RecordNum: event.options.record },
					'APPS_SET_RECORD_PROPERTY',
					RECORD_WRITABLE_KEYS,
					{
						FileName: event.options.fileName,
						FileType: event.options.fileType,
						FileLive: event.options.fileLive,
					},
				)
				self.refreshSoon()
			},
		},
		video_source_set: {
			name: 'Input: Select video source',
			options: [{ id: 'source', type: 'dropdown', label: 'Video source', choices: videoSourceChoices, default: 6 }],
			callback: async (event) => {
				await self.api.call('APPS_SET_VIDEO_SOURCE', { VideoSource: event.options.source })
				self.refreshSoon()
			},
		},
		video_source_set_ip_stream: {
			name: 'Input: Use IP stream source',
			description: 'Switches to an IP stream input and sets its address (multi-channel models).',
			options: [
				{ id: 'url', type: 'textinput', label: 'Stream URL', default: 'rtsp://', useVariables: true },
				{ id: 'protocol', type: 'dropdown', label: 'Protocol', choices: protocolChoices, default: 1 },
				{ id: 'account', type: 'textinput', label: 'Account (optional)', default: '', useVariables: true },
				{ id: 'password', type: 'textinput', label: 'Password (optional)', default: '', useVariables: true },
			],
			callback: async (event) => {
				await self.api.call('APPS_SET_VIDEO_SOURCE', {
					VideoSource: 8,
					SourceUrl: event.options.url,
					Protocol: event.options.protocol,
					Account: event.options.account,
					Password: event.options.password,
				})
				self.refreshSoon()
			},
		},
		video_source_set_picture: {
			name: 'Input: Show picture',
			description: 'Switches to the photo input and selects a picture (multi-channel models).',
			options: [{ id: 'pictureName', type: 'textinput', label: 'Picture file name', default: '', useVariables: true }],
			callback: async (event) => {
				await self.api.call('APPS_SET_VIDEO_SOURCE', {
					VideoSource: 7,
					PictureName: event.options.pictureName,
				})
				self.refreshSoon()
			},
		},
		video_source_set_file: {
			name: 'Input: Play file',
			description: 'Switches to file playback and selects the file (multi-channel models).',
			options: [{ id: 'filePath', type: 'textinput', label: 'File path', default: '', useVariables: true }],
			callback: async (event) => {
				await self.api.call('APPS_SET_VIDEO_SOURCE', {
					VideoSource: 9,
					FilePath: event.options.filePath,
				})
				self.refreshSoon()
			},
		},
		audio_source_set: {
			name: 'Audio: Select input',
			options: [{ id: 'source', type: 'dropdown', label: 'Audio source', choices: audioSourceChoices, default: 0 }],
			callback: async (event) => {
				await self.api.call('APPS_SET_AUDIO_SOURCE', { AudioSource: event.options.source })
				self.refreshSoon()
			},
		},
		audio_volume_set: {
			name: 'Audio: Set line-in volume',
			description: 'Sets the analogue input volume. Volume control only works in Manual mode.',
			options: [
				{ id: 'volume', type: 'number', label: 'Volume (0-255)', default: 128, min: 0, max: 255 },
				{ id: 'standard', type: 'dropdown', label: 'Audio standard', choices: audioStandardChoices, default: 0 },
			],
			callback: async (event) => {
				await self.api.call('APPS_SET_AUDIO_VOLUME', {
					Volume: event.options.volume,
					Standard: event.options.standard,
				})
				self.refreshSoon()
			},
		},
		audio_volume_adjust: {
			name: 'Audio: Adjust line-in volume',
			description: 'Raises or lowers the analogue input volume by a number of steps.',
			options: [{ id: 'amount', type: 'number', label: 'Change (-255 to 255)', default: 10, min: -255, max: 255 }],
			callback: async (event) => {
				const current = await self.api.call('APPS_GET_AUDIO_VOLUME')
				const volume = Math.min(255, Math.max(0, asNumber(current['Volume']) + event.options.amount))
				await self.api.call('APPS_SET_AUDIO_VOLUME', {
					Volume: volume,
					Standard: asNumber(current['Standard']),
				})
				self.refreshSoon()
			},
		},
		video_tuning_set: {
			name: 'Video: Set picture tuning',
			options: [
				{ id: 'brightness', type: 'number', label: 'Brightness (0-255)', default: 128, min: 0, max: 255 },
				{ id: 'contrast', type: 'number', label: 'Contrast (0-255)', default: 128, min: 0, max: 255 },
				{ id: 'hue', type: 'number', label: 'Hue (0-255)', default: 128, min: 0, max: 255 },
				{ id: 'saturation', type: 'number', label: 'Saturation (0-255)', default: 128, min: 0, max: 255 },
				{ id: 'sharpness', type: 'number', label: 'Sharpness (0-255)', default: 128, min: 0, max: 255 },
			],
			callback: async (event) => {
				await self.api.call('APPS_SET_VIDEO_TUNING', {
					Brightness: event.options.brightness,
					Contrast: event.options.contrast,
					Hue: event.options.hue,
					Saturation: event.options.saturation,
					Sharpness: event.options.sharpness,
				})
				self.refreshSoon()
			},
		},
		video_mirror_set: {
			name: 'Video: Set mirroring',
			options: [
				{ id: 'vertical', type: 'checkbox', label: 'Vertical mirror', default: false },
				{ id: 'horizontal', type: 'checkbox', label: 'Horizontal mirror', default: false },
			],
			callback: async (event) => {
				await self.api.call('APPS_SET_VIDEO_MIRROR', {
					Vertical: event.options.vertical ? 1 : 0,
					Horizontal: event.options.horizontal ? 1 : 0,
				})
				self.refreshSoon()
			},
		},
		pgm_set_layout: {
			name: 'PGM: Set layout',
			description: 'Switches the program output layout (multi-channel models).',
			options: [
				{ id: 'pgmType', type: 'dropdown', label: 'Layout', choices: pgmTypeChoices, default: 3 },
				{ id: 'arg1', type: 'number', label: 'Channel 1 (1-4)', default: 1, min: 1, max: 4 },
				{ id: 'arg2', type: 'number', label: 'Channel 2 (1-4)', default: 2, min: 1, max: 4 },
				{ id: 'bgColor', type: 'colorpicker', label: 'Background colour', default: 0x000000 },
				{ id: 'scale', type: 'dropdown', label: 'Scale', choices: pgmScaleChoices, default: 1 },
			],
			callback: async (event) => {
				await self.api.setWithMerge('APPS_GET_PGM_STATUS', {}, 'APPS_SET_PGM_STATUS', PGM_WRITABLE_KEYS, {
					PgmType: event.options.pgmType,
					PgmArg1: event.options.arg1 - 1,
					PgmArg2: event.options.arg2 - 1,
					PgmBkColor: hexColor(event.options.bgColor),
					PgmScale: event.options.scale,
				})
				self.refreshSoon()
			},
		},
		pgm_set_position: {
			name: 'PGM: Set channel position',
			description: 'Moves and scales one channel of the program layout (multi-channel models).',
			options: [
				{ id: 'sprite', type: 'number', label: 'Channel (1-4)', default: 1, min: 1, max: 4 },
				{ id: 'x', type: 'number', label: 'Position X', default: 0, min: 0, max: 1920 },
				{ id: 'y', type: 'number', label: 'Position Y', default: 0, min: 0, max: 1080 },
				{ id: 'width', type: 'number', label: 'Width', default: 1920, min: 1, max: 1920 },
				{ id: 'height', type: 'number', label: 'Height', default: 1080, min: 1, max: 1080 },
				{ id: 'layer', type: 'number', label: 'Layer (0-3)', default: 0, min: 0, max: 3 },
			],
			callback: async (event) => {
				await self.api.call('APPS_SET_PGM_POSITION', {
					PgmType: asNumber((await self.api.call('APPS_GET_PGM_STATUS'))['PgmType']),
					SpriteNum: event.options.sprite - 1,
					PositionX: event.options.x,
					PositionY: event.options.y,
					Width: event.options.width,
					Height: event.options.height,
					Layer: event.options.layer,
				})
				self.refreshSoon()
			},
		},
		multiview_set_type: {
			name: 'Monitor: Select output',
			description: 'Switches the monitor output between multiview and PGM (multi-channel models).',
			options: [
				{ id: 'multiviewType', type: 'dropdown', label: 'Monitor output', choices: multiviewChoices, default: 0 },
			],
			callback: async (event) => {
				await self.api.call('APPS_SET_MULTIVIEW_STATUS', { MultiviewType: event.options.multiviewType })
				self.refreshSoon()
			},
		},
		monitor_set_fps: {
			name: 'Monitor: Set output frame rate',
			options: [
				{ id: 'multiviewFps', type: 'number', label: 'Multiview FPS', default: 30, min: 1, max: 60 },
				{ id: 'pgmFps', type: 'number', label: 'PGM FPS', default: 30, min: 1, max: 60 },
			],
			callback: async (event) => {
				await self.api.setWithMerge('APPS_GET_MONITOR_FPS', {}, 'APPS_SET_MONITOR_FPS', MONITOR_FPS_KEYS, {
					MultiviewFps: event.options.multiviewFps,
					PgmFps: event.options.pgmFps,
				})
				self.refreshSoon()
			},
		},
		monitor_set_volume: {
			name: 'Monitor: Set output volume',
			options: [
				{ id: 'multiviewVolume', type: 'number', label: 'Multiview volume (0-255)', default: 128, min: 0, max: 255 },
				{ id: 'pgmVolume', type: 'number', label: 'PGM volume (0-255)', default: 128, min: 0, max: 255 },
			],
			callback: async (event) => {
				await self.api.setWithMerge('APPS_GET_MONITOR_VOLUME', {}, 'APPS_SET_MONITOR_VOLUME', MONITOR_VOLUME_KEYS, {
					MultiviewVolume: event.options.multiviewVolume,
					PgmVolume: event.options.pgmVolume,
				})
				self.refreshSoon()
			},
		},
		osd_set_text: {
			name: 'OSD: Set text overlay',
			description: 'Updates the text of one OSD layer and where it is drawn (multi-channel models).',
			options: [
				{ id: 'layer', type: 'number', label: 'OSD layer (0-64)', default: 0, min: 0, max: 64 },
				{ id: 'text', type: 'textinput', label: 'Text', default: '', useVariables: true },
				{ id: 'x', type: 'number', label: 'Position X', default: 50, min: 0, max: 1920 },
				{ id: 'y', type: 'number', label: 'Position Y', default: 50, min: 0, max: 1080 },
				{ id: 'width', type: 'number', label: 'Width', default: 500, min: 1, max: 1920 },
				{ id: 'height', type: 'number', label: 'Height', default: 100, min: 1, max: 1080 },
				{ id: 'textSize', type: 'number', label: 'Text size', default: 32, min: 8, max: 200 },
				{ id: 'fontColor', type: 'colorpicker', label: 'Text colour', default: 0xffffff },
			],
			callback: async (event) => {
				await self.api.setWithMerge(
					'APPS_GET_OSD_PROPERTY',
					{ OsdLayer: event.options.layer },
					'APPS_SET_OSD_PROPERTY',
					OSD_WRITABLE_KEYS,
					{
						OsdLayer: event.options.layer,
						OsdText: event.options.text,
						PositionX: event.options.x,
						PositionY: event.options.y,
						Width: event.options.width,
						Height: event.options.height,
						TextSize: event.options.textSize,
						FontColor: hexColor(event.options.fontColor),
					},
				)
				self.refreshSoon()
			},
		},
		osd_set_enabled: {
			name: 'OSD: Show or hide layer',
			options: [
				{ id: 'layer', type: 'number', label: 'OSD layer (0-64)', default: 0, min: 0, max: 64 },
				{ id: 'enabled', type: 'checkbox', label: 'Layer visible', default: true },
			],
			callback: async (event) => {
				await self.api.call('APPS_SET_OSD_STATUS', {
					OsdLayer: event.options.layer,
					Status: event.options.enabled ? 1 : 0,
				})
				self.refreshSoon()
			},
		},
		snapshot_take: {
			name: 'Snapshot: Capture',
			description: 'Captures a still image to the storage card (multi-channel models).',
			options: [
				{ id: 'fileName', type: 'textinput', label: 'File name', default: 'snapshot', useVariables: true },
				{ id: 'fileType', type: 'dropdown', label: 'File type', choices: snapshotFileTypeChoices, default: 0 },
				{ id: 'quality', type: 'number', label: 'JPEG quality', default: 90, min: 1, max: 100 },
			],
			callback: async (event) => {
				await self.api.call('APPS_SET_SNAPSHOT', {
					Enabled: 1,
					FileName: event.options.fileName,
					FileType: event.options.fileType,
					Quality: event.options.quality,
				})
				self.refreshSoon()
			},
		},
		mixer_set_volume: {
			name: 'Mixer: Set channel volume',
			description: 'Sets the level of one audio mixer channel (multi-channel models).',
			options: [
				{ id: 'mixerId', type: 'dropdown', label: 'Mixer channel', choices: mixerChoices, default: 0 },
				{ id: 'volume', type: 'number', label: 'Volume (0-255)', default: 128, min: 0, max: 255 },
			],
			callback: async (event) => {
				await self.api.setWithMerge(
					'APPS_GET_MIXER_PROPERTY',
					{ MixerId: event.options.mixerId },
					'APPS_SET_MIXER_PROPERTY',
					['MixerType', 'MixerVolume'],
					{ MixerVolume: event.options.volume },
				)
				self.refreshSoon()
			},
		},
		device_set_name: {
			name: 'Device: Set device name',
			options: [{ id: 'name', type: 'textinput', label: 'Device name', default: 'NVS-33', useVariables: true }],
			callback: async (event) => {
				await self.api.call('SYSTEM_SET_DEVICE_NAME', { DEVICE_NAME: event.options.name })
				self.state.deviceName = event.options.name
				self.refreshSoon()
			},
		},
		device_reboot: {
			name: 'Device: Reboot',
			description: 'Restarts the device. It is offline for about a minute.',
			options: [],
			callback: async () => {
				await self.api.call('SYSTEM_REBOOT')
				self.api.resetSession()
				self.updateStatus(InstanceStatus.Disconnected, 'Rebooting')
			},
		},
		refresh: {
			name: 'Device: Refresh state now',
			description: 'Polls the device immediately, even when periodic polling is disabled.',
			options: [],
			callback: async () => {
				await self.poll()
			},
		},
	})
}
