import type ModuleInstance from './main.js'
import { AUDIO_SOURCES, MULTIVIEW_TYPES, PGM_TYPES, STREAM_TYPES, VIDEO_SOURCES } from './labels.js'

export type FeedbacksSchema = {
	streaming_active: { type: 'boolean'; options: { stream: number; streamType: number } }
	streaming_any: { type: 'boolean'; options: Record<string, never> }
	recording_active: { type: 'boolean'; options: { record: number } }
	recording_any: { type: 'boolean'; options: Record<string, never> }
	video_source_is: { type: 'boolean'; options: { source: number } }
	audio_source_is: { type: 'boolean'; options: { source: number } }
	signal_present: { type: 'boolean'; options: Record<string, never> }
	pgm_type_is: { type: 'boolean'; options: { pgmType: number } }
	multiview_type_is: { type: 'boolean'; options: { multiviewType: number } }
	hls_preview_active: { type: 'boolean'; options: Record<string, never> }
}

const streamChoices = [
	{ id: 1, label: 'Main stream' },
	{ id: 2, label: 'Sub stream' },
]

const streamTypeChoices = Object.entries(STREAM_TYPES).map(([id, label]) => ({ id: Number(id), label }))

const recordChoices = [
	{ id: 1, label: 'Main recording' },
	{ id: 2, label: 'Sub recording' },
]

const videoSourceChoices = Object.entries(VIDEO_SOURCES).map(([id, label]) => ({ id: Number(id), label }))

const audioSourceChoices = Object.entries(AUDIO_SOURCES).map(([id, label]) => ({ id: Number(id), label }))

const pgmTypeChoices = Object.entries(PGM_TYPES).map(([id, label]) => ({ id: Number(id), label }))

const multiviewChoices = Object.entries(MULTIVIEW_TYPES).map(([id, label]) => ({ id: Number(id), label }))

export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		streaming_active: {
			name: 'Streaming is active',
			type: 'boolean',
			defaultStyle: { bgcolor: 0x00ff00, color: 0x000000 },
			options: [
				{ id: 'stream', type: 'dropdown', label: 'Stream', choices: streamChoices, default: 1 },
				{ id: 'streamType', type: 'dropdown', label: 'Protocol', choices: streamTypeChoices, default: 1 },
			],
			callback: (feedback) => {
				const stream = self.state.streaming[feedback.options.stream]
				return !!stream && stream.status === 1 && stream.streamType === feedback.options.streamType
			},
		},
		streaming_any: {
			name: 'Any streaming is active',
			type: 'boolean',
			defaultStyle: { bgcolor: 0x00ff00, color: 0x000000 },
			options: [],
			callback: () => self.state.streaming[1].status === 1 || self.state.streaming[2].status === 1,
		},
		recording_active: {
			name: 'Recording is active',
			type: 'boolean',
			defaultStyle: { bgcolor: 0xff0000, color: 0xffffff },
			options: [{ id: 'record', type: 'dropdown', label: 'Recording', choices: recordChoices, default: 1 }],
			callback: (feedback) => self.state.recording[feedback.options.record]?.status === 1,
		},
		recording_any: {
			name: 'Any recording is active',
			type: 'boolean',
			defaultStyle: { bgcolor: 0xff0000, color: 0xffffff },
			options: [],
			callback: () => self.state.recording[1].status === 1 || self.state.recording[2].status === 1,
		},
		video_source_is: {
			name: 'Video input is selected',
			type: 'boolean',
			defaultStyle: { bgcolor: 0x0000ff, color: 0xffffff },
			options: [{ id: 'source', type: 'dropdown', label: 'Video input', choices: videoSourceChoices, default: 6 }],
			callback: (feedback) => self.state.videoSource === feedback.options.source,
		},
		audio_source_is: {
			name: 'Audio input is selected',
			type: 'boolean',
			defaultStyle: { bgcolor: 0x0000ff, color: 0xffffff },
			options: [{ id: 'source', type: 'dropdown', label: 'Audio input', choices: audioSourceChoices, default: 0 }],
			callback: (feedback) => self.state.audioSource === feedback.options.source,
		},
		signal_present: {
			name: 'Input signal is detected',
			type: 'boolean',
			defaultStyle: { bgcolor: 0x00ff00, color: 0x000000 },
			options: [],
			callback: () => self.state.input.signal,
		},
		pgm_type_is: {
			name: 'PGM layout is active',
			type: 'boolean',
			defaultStyle: { bgcolor: 0xffff00, color: 0x000000 },
			options: [{ id: 'pgmType', type: 'dropdown', label: 'PGM layout', choices: pgmTypeChoices, default: 3 }],
			callback: (feedback) => self.state.pgm.type === feedback.options.pgmType,
		},
		multiview_type_is: {
			name: 'Monitor output is active',
			type: 'boolean',
			defaultStyle: { bgcolor: 0x0000ff, color: 0xffffff },
			options: [
				{ id: 'multiviewType', type: 'dropdown', label: 'Monitor output', choices: multiviewChoices, default: 0 },
			],
			callback: (feedback) => self.state.multiview.type === feedback.options.multiviewType,
		},
		hls_preview_active: {
			name: 'HLS preview is enabled',
			type: 'boolean',
			defaultStyle: { bgcolor: 0x00ff00, color: 0x000000 },
			options: [],
			callback: () => self.state.hlsPreview,
		},
	})
}
