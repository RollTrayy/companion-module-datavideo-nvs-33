import type ModuleInstance from './main.js'
import {
	AUDIO_SOURCES,
	MULTIVIEW_TYPES,
	PGM_SCALES,
	PGM_TYPES,
	STREAM_TYPES,
	VIDEO_SOURCES,
	labelOf,
} from './labels.js'

export type VariablesSchema = {
	streaming_main_status: string
	streaming_main_type: string
	streaming_sub_status: string
	streaming_sub_type: string
	recording_main_status: string
	recording_sub_status: string
	recording_main_file: string
	recording_sub_file: string
	video_source: string
	audio_source: string
	input_signal: string
	input_resolution: string
	input_framerate: string
	input_scan: string
	input_audio: string
	pgm_type: string
	pgm_scale: string
	multiview_type: string
	hls_preview: string
	monitor_volume_multiview: string
	monitor_volume_pgm: string
	encoder_main_bitrate: string
	encoder_main_resolution: string
	encoder_main_framerate: string
	encoder_sub_bitrate: string
	storage_capacity: string
	storage_remaining: string
	device_name: string
	firmware_version: string
	software_version: string
}

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions({
		streaming_main_status: { name: 'Main stream: on/off' },
		streaming_main_type: { name: 'Main stream: protocol' },
		streaming_sub_status: { name: 'Sub stream: on/off' },
		streaming_sub_type: { name: 'Sub stream: protocol' },
		recording_main_status: { name: 'Main recording: on/off' },
		recording_sub_status: { name: 'Sub recording: on/off' },
		recording_main_file: { name: 'Main recording: current file name' },
		recording_sub_file: { name: 'Sub recording: current file name' },
		video_source: { name: 'Selected video input' },
		audio_source: { name: 'Selected audio input' },
		input_signal: { name: 'Input signal detected' },
		input_resolution: { name: 'Input resolution' },
		input_framerate: { name: 'Input frame rate' },
		input_scan: { name: 'Input scan mode' },
		input_audio: { name: 'Input audio format' },
		pgm_type: { name: 'PGM layout' },
		pgm_scale: { name: 'PGM scale' },
		multiview_type: { name: 'Monitor output' },
		hls_preview: { name: 'HLS preview on/off' },
		monitor_volume_multiview: { name: 'Multiview volume (0-255)' },
		monitor_volume_pgm: { name: 'PGM volume (0-255)' },
		encoder_main_bitrate: { name: 'Main encoder bitrate (kbps)' },
		encoder_main_resolution: { name: 'Main encoder resolution' },
		encoder_main_framerate: { name: 'Main encoder frame rate' },
		encoder_sub_bitrate: { name: 'Sub encoder bitrate (kbps)' },
		storage_capacity: { name: 'Storage capacity (as reported by the device)' },
		storage_remaining: { name: 'Storage free space (as reported by the device)' },
		device_name: { name: 'Device name' },
		firmware_version: { name: 'Firmware version' },
		software_version: { name: 'Software version' },
	})
}

function onOff(status: number): string {
	return status === 1 ? 'On' : 'Off'
}

export function UpdateVariableValues(self: ModuleInstance): void {
	const state = self.state
	const resolution = state.input.width > 0 && state.input.height > 0 ? `${state.input.width}x${state.input.height}` : ''

	self.setVariableValues({
		streaming_main_status: onOff(state.streaming[1].status),
		streaming_main_type: labelOf(STREAM_TYPES, state.streaming[1].streamType, 'Type'),
		streaming_sub_status: onOff(state.streaming[2].status),
		streaming_sub_type: labelOf(STREAM_TYPES, state.streaming[2].streamType, 'Type'),
		recording_main_status: onOff(state.recording[1].status),
		recording_sub_status: onOff(state.recording[2].status),
		recording_main_file: state.recording[1].fileName,
		recording_sub_file: state.recording[2].fileName,
		video_source: labelOf(VIDEO_SOURCES, state.videoSource, 'Source'),
		audio_source: labelOf(AUDIO_SOURCES, state.audioSource, 'Source'),
		input_signal: state.input.signal ? 'Yes' : 'No',
		input_resolution: resolution,
		input_framerate: state.input.framerate,
		input_scan: state.input.interlaced ? 'Interlaced' : 'Progressive',
		input_audio:
			state.input.channels > 0
				? `${state.input.channels} ch / ${state.input.sampleRate} Hz / ${state.input.bitsPerSample} bit`
				: '',
		pgm_type: labelOf(PGM_TYPES, state.pgm.type, 'Type'),
		pgm_scale: labelOf(PGM_SCALES, state.pgm.scale, 'Scale'),
		multiview_type: labelOf(MULTIVIEW_TYPES, state.multiview.type, 'Type'),
		hls_preview: state.hlsPreview ? 'On' : 'Off',
		monitor_volume_multiview: String(state.multiview.multiviewVolume),
		monitor_volume_pgm: String(state.multiview.pgmVolume),
		encoder_main_bitrate: String(state.encoder[0].bitrate),
		encoder_main_resolution: state.encoder[0].width > 0 ? `${state.encoder[0].width}x${state.encoder[0].height}` : '',
		encoder_main_framerate: String(state.encoder[0].framerate),
		encoder_sub_bitrate: String(state.encoder[1].bitrate),
		storage_capacity: state.storage.capacity,
		storage_remaining: state.storage.remain,
		device_name: state.deviceName,
		firmware_version: state.version.firmware,
		software_version: state.version.software,
	})
}
