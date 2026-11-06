import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'
import type ModuleInstance from './main.js'
import type { ModuleSchema } from './main.js'

const MODULE_ID = 'datavideo-nvs-33'

export function UpdatePresets(self: ModuleInstance): void {
	const presets: CompanionPresetDefinitions<ModuleSchema> = {}

	presets['stream_toggle_rtmp'] = {
		type: 'simple',
		name: 'Main stream: RTMP on/off',
		style: {
			text: `RTMP\\n$(${MODULE_ID}:streaming_main_status)`,
			size: '14',
			color: 0xffffff,
			bgcolor: 0x000000,
		},
		steps: [{ down: [{ actionId: 'streaming_toggle', options: { stream: 1, streamType: 1 } }], up: [] }],
		feedbacks: [
			{
				feedbackId: 'streaming_active',
				options: { stream: 1, streamType: 1 },
				style: { bgcolor: 0x00ff00, color: 0x000000 },
			},
		],
	}

	presets['stream_toggle_rtsp'] = {
		type: 'simple',
		name: 'Main stream: RTSP on/off',
		style: {
			text: `RTSP\\n$(${MODULE_ID}:streaming_main_status)`,
			size: '14',
			color: 0xffffff,
			bgcolor: 0x000000,
		},
		steps: [{ down: [{ actionId: 'streaming_toggle', options: { stream: 1, streamType: 0 } }], up: [] }],
		feedbacks: [
			{
				feedbackId: 'streaming_active',
				options: { stream: 1, streamType: 0 },
				style: { bgcolor: 0x00ff00, color: 0x000000 },
			},
		],
	}

	presets['stream_toggle_hls'] = {
		type: 'simple',
		name: 'Main stream: HLS on/off',
		style: {
			text: `HLS\\n$(${MODULE_ID}:streaming_main_status)`,
			size: '14',
			color: 0xffffff,
			bgcolor: 0x000000,
		},
		steps: [{ down: [{ actionId: 'streaming_toggle', options: { stream: 1, streamType: 3 } }], up: [] }],
		feedbacks: [
			{
				feedbackId: 'streaming_active',
				options: { stream: 1, streamType: 3 },
				style: { bgcolor: 0x00ff00, color: 0x000000 },
			},
		],
	}

	presets['stream_toggle_srt'] = {
		type: 'simple',
		name: 'Main stream: SRT on/off',
		style: {
			text: `SRT\\n$(${MODULE_ID}:streaming_main_status)`,
			size: '14',
			color: 0xffffff,
			bgcolor: 0x000000,
		},
		steps: [{ down: [{ actionId: 'streaming_toggle', options: { stream: 1, streamType: 4 } }], up: [] }],
		feedbacks: [
			{
				feedbackId: 'streaming_active',
				options: { stream: 1, streamType: 4 },
				style: { bgcolor: 0x00ff00, color: 0x000000 },
			},
		],
	}

	presets['stream_stop_all'] = {
		type: 'simple',
		name: 'Streaming: Stop main and sub',
		style: { text: '⏹\\nAll streams', size: '14', color: 0x000000, bgcolor: 0xff0000 },
		steps: [
			{
				down: [
					{ actionId: 'streaming_stop', options: { stream: 1 } },
					{ actionId: 'streaming_stop', options: { stream: 2 } },
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'streaming_any',
				options: {},
				style: { bgcolor: 0x00ff00, color: 0x000000 },
			},
		],
	}

	presets['record_toggle'] = {
		type: 'simple',
		name: 'Main recording: on/off',
		style: {
			text: `⏺\\n$(${MODULE_ID}:recording_main_status)`,
			size: '14',
			color: 0xffffff,
			bgcolor: 0x000000,
		},
		steps: [{ down: [{ actionId: 'record_toggle', options: { record: 1 } }], up: [] }],
		feedbacks: [
			{
				feedbackId: 'recording_active',
				options: { record: 1 },
				style: { bgcolor: 0xff0000, color: 0xffffff },
			},
		],
	}

	presets['record_start'] = {
		type: 'simple',
		name: 'Recording: Start',
		style: { text: '⏺\\nRecord', size: '14', color: 0x000000, bgcolor: 0xff0000 },
		steps: [{ down: [{ actionId: 'record_start', options: { record: 1 } }], up: [] }],
		feedbacks: [],
	}

	presets['record_stop'] = {
		type: 'simple',
		name: 'Recording: Stop',
		style: { text: '⏹\\nStop rec', size: '14', color: 0xffffff, bgcolor: 0x000000 },
		steps: [{ down: [{ actionId: 'record_stop', options: { record: 1 } }], up: [] }],
		feedbacks: [],
	}

	presets['input_sdi'] = {
		type: 'simple',
		name: 'Input: SDI',
		style: { text: 'SDI', size: '18', color: 0xffffff, bgcolor: 0x000000 },
		steps: [{ down: [{ actionId: 'video_source_set', options: { source: 6 } }], up: [] }],
		feedbacks: [
			{
				feedbackId: 'video_source_is',
				options: { source: 6 },
				style: { bgcolor: 0x0000ff, color: 0xffffff },
			},
		],
	}

	presets['input_hdmi'] = {
		type: 'simple',
		name: 'Input: HDMI',
		style: { text: 'HDMI', size: '18', color: 0xffffff, bgcolor: 0x000000 },
		steps: [{ down: [{ actionId: 'video_source_set', options: { source: 2 } }], up: [] }],
		feedbacks: [
			{
				feedbackId: 'video_source_is',
				options: { source: 2 },
				style: { bgcolor: 0x0000ff, color: 0xffffff },
			},
		],
	}

	presets['audio_embedded'] = {
		type: 'simple',
		name: 'Audio: Embedded',
		style: { text: 'Audio\\nEmbedded', size: '14', color: 0xffffff, bgcolor: 0x000000 },
		steps: [{ down: [{ actionId: 'audio_source_set', options: { source: 0 } }], up: [] }],
		feedbacks: [
			{
				feedbackId: 'audio_source_is',
				options: { source: 0 },
				style: { bgcolor: 0x0000ff, color: 0xffffff },
			},
		],
	}

	presets['audio_rca'] = {
		type: 'simple',
		name: 'Audio: RCA / line-in',
		style: { text: 'Audio\\nRCA', size: '14', color: 0xffffff, bgcolor: 0x000000 },
		steps: [{ down: [{ actionId: 'audio_source_set', options: { source: 1 } }], up: [] }],
		feedbacks: [
			{
				feedbackId: 'audio_source_is',
				options: { source: 1 },
				style: { bgcolor: 0x0000ff, color: 0xffffff },
			},
		],
	}

	presets['audio_volume_up'] = {
		type: 'simple',
		name: 'Audio: Volume up',
		style: { text: '🔈\\n+10', size: '18', color: 0xffffff, bgcolor: 0x000000 },
		steps: [{ down: [{ actionId: 'audio_volume_adjust', options: { amount: 10 } }], up: [] }],
		feedbacks: [],
	}

	presets['audio_volume_down'] = {
		type: 'simple',
		name: 'Audio: Volume down',
		style: { text: '🔉\\n-10', size: '18', color: 0xffffff, bgcolor: 0x000000 },
		steps: [{ down: [{ actionId: 'audio_volume_adjust', options: { amount: -10 } }], up: [] }],
		feedbacks: [],
	}

	presets['encoder_bitrate_high'] = {
		type: 'simple',
		name: 'Encoder: Bitrate 8000 kbps',
		style: { text: 'Bitrate\\n8 Mbps', size: '14', color: 0xffffff, bgcolor: 0x000000 },
		steps: [{ down: [{ actionId: 'encoder_set_bitrate', options: { encoder: 0, bitrate: 8000 } }], up: [] }],
		feedbacks: [],
	}

	presets['encoder_bitrate_medium'] = {
		type: 'simple',
		name: 'Encoder: Bitrate 4000 kbps',
		style: { text: 'Bitrate\\n4 Mbps', size: '14', color: 0xffffff, bgcolor: 0x000000 },
		steps: [{ down: [{ actionId: 'encoder_set_bitrate', options: { encoder: 0, bitrate: 4000 } }], up: [] }],
		feedbacks: [],
	}

	presets['encoder_bitrate_low'] = {
		type: 'simple',
		name: 'Encoder: Bitrate 1500 kbps',
		style: { text: 'Bitrate\\n1.5 Mbps', size: '14', color: 0xffffff, bgcolor: 0x000000 },
		steps: [{ down: [{ actionId: 'encoder_set_bitrate', options: { encoder: 0, bitrate: 1500 } }], up: [] }],
		feedbacks: [],
	}

	presets['pgm_full'] = {
		type: 'simple',
		name: 'PGM: Full screen',
		style: { text: 'PGM\\nFull', size: '14', color: 0xffffff, bgcolor: 0x000000 },
		steps: [
			{
				down: [
					{
						actionId: 'pgm_set_layout',
						options: { pgmType: 3, arg1: 1, arg2: 2, bgColor: 0x000000, scale: 1 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'pgm_type_is',
				options: { pgmType: 3 },
				style: { bgcolor: 0xffff00, color: 0x000000 },
			},
		],
	}

	presets['pgm_pip'] = {
		type: 'simple',
		name: 'PGM: PIP',
		style: { text: 'PGM\\nPIP', size: '14', color: 0xffffff, bgcolor: 0x000000 },
		steps: [
			{
				down: [
					{
						actionId: 'pgm_set_layout',
						options: { pgmType: 2, arg1: 1, arg2: 2, bgColor: 0x000000, scale: 1 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'pgm_type_is',
				options: { pgmType: 2 },
				style: { bgcolor: 0xffff00, color: 0x000000 },
			},
		],
	}

	presets['pgm_pbp'] = {
		type: 'simple',
		name: 'PGM: PBP',
		style: { text: 'PGM\\nPBP', size: '14', color: 0xffffff, bgcolor: 0x000000 },
		steps: [
			{
				down: [
					{
						actionId: 'pgm_set_layout',
						options: { pgmType: 0, arg1: 1, arg2: 2, bgColor: 0x000000, scale: 1 },
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'pgm_type_is',
				options: { pgmType: 0 },
				style: { bgcolor: 0xffff00, color: 0x000000 },
			},
		],
	}

	presets['multiview_multi'] = {
		type: 'simple',
		name: 'Monitor: Multiview',
		style: { text: 'Mon\\nMulti', size: '14', color: 0xffffff, bgcolor: 0x000000 },
		steps: [{ down: [{ actionId: 'multiview_set_type', options: { multiviewType: 0 } }], up: [] }],
		feedbacks: [
			{
				feedbackId: 'multiview_type_is',
				options: { multiviewType: 0 },
				style: { bgcolor: 0x0000ff, color: 0xffffff },
			},
		],
	}

	presets['multiview_pgm'] = {
		type: 'simple',
		name: 'Monitor: PGM',
		style: { text: 'Mon\\nPGM', size: '14', color: 0xffffff, bgcolor: 0x000000 },
		steps: [{ down: [{ actionId: 'multiview_set_type', options: { multiviewType: 1 } }], up: [] }],
		feedbacks: [
			{
				feedbackId: 'multiview_type_is',
				options: { multiviewType: 1 },
				style: { bgcolor: 0x0000ff, color: 0xffffff },
			},
		],
	}

	presets['device_refresh'] = {
		type: 'simple',
		name: 'Device: Refresh state',
		style: { text: '⟳\\nRefresh', size: '18', color: 0xffffff, bgcolor: 0x222222 },
		steps: [{ down: [{ actionId: 'refresh', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets['device_reboot'] = {
		type: 'simple',
		name: 'Device: Reboot',
		style: { text: '⏻\\nReboot', size: '14', color: 0xffffff, bgcolor: 0xff0000 },
		steps: [{ down: [{ actionId: 'device_reboot', options: {} }], up: [] }],
		feedbacks: [],
	}

	const structure: CompanionPresetSection<ModuleSchema>[] = [
		{
			id: 'streaming',
			name: 'Streaming',
			definitions: [
				{
					id: 'streaming-group',
					type: 'simple',
					name: 'Main stream',
					presets: [
						'stream_toggle_rtmp',
						'stream_toggle_rtsp',
						'stream_toggle_hls',
						'stream_toggle_srt',
						'stream_stop_all',
					],
				},
			],
		},
		{
			id: 'recording',
			name: 'Recording',
			definitions: [
				{
					id: 'recording-group',
					type: 'simple',
					name: 'Record to card',
					presets: ['record_toggle', 'record_start', 'record_stop'],
				},
			],
		},
		{
			id: 'input',
			name: 'Input and audio',
			definitions: [
				{ id: 'video-group', type: 'simple', name: 'Video input', presets: ['input_sdi', 'input_hdmi'] },
				{ id: 'audio-group', type: 'simple', name: 'Audio', presets: ['audio_embedded', 'audio_rca'] },
				{ id: 'volume-group', type: 'simple', name: 'Volume', presets: ['audio_volume_up', 'audio_volume_down'] },
			],
		},
		{
			id: 'encoder',
			name: 'Encoder',
			definitions: [
				{
					id: 'bitrate-group',
					type: 'simple',
					name: 'Main encoder bitrate',
					presets: ['encoder_bitrate_high', 'encoder_bitrate_medium', 'encoder_bitrate_low'],
				},
			],
		},
		{
			id: 'production',
			name: 'Production (multi-channel models)',
			description: 'These presets use functions that are only available on the multi-channel Datavideo models.',
			definitions: [
				{ id: 'pgm-group', type: 'simple', name: 'PGM layout', presets: ['pgm_full', 'pgm_pip', 'pgm_pbp'] },
				{ id: 'monitor-group', type: 'simple', name: 'Monitor output', presets: ['multiview_multi', 'multiview_pgm'] },
			],
		},
		{
			id: 'device',
			name: 'Device',
			definitions: [
				{ id: 'device-group', type: 'simple', name: 'Device control', presets: ['device_refresh', 'device_reboot'] },
			],
		},
	]

	self.setPresetDefinitions(structure, presets)
}
