export const STREAM_TYPES: Record<number, string> = {
	0: 'RTSP',
	1: 'RTMP',
	2: 'TS (UDP)',
	3: 'HLS',
	4: 'SRT',
	5: 'YouTube',
	6: 'Facebook',
	7: 'RTMP engine 2',
	11: 'YouTube',
	12: 'Facebook',
}

export const VIDEO_SOURCES: Record<number, string> = {
	0: 'Composite',
	1: 'S-Video',
	2: 'HDMI',
	3: 'DVI',
	4: 'YPbPr',
	5: 'VGA',
	6: 'SDI',
	7: 'Photo',
	8: 'IP stream',
	9: 'File playback',
}

export const AUDIO_SOURCES: Record<number, string> = {
	0: 'Embedded',
	1: 'RCA / Line-in',
	2: 'XLR',
	3: 'Microphone',
}

export const PGM_TYPES: Record<number, string> = {
	0: 'PBP',
	1: 'POP',
	2: 'PIP',
	3: 'Full',
}

export const PGM_SCALES: Record<number, string> = {
	0: 'Stretch',
	1: 'Fit',
	2: 'Full',
}

export const MULTIVIEW_TYPES: Record<number, string> = {
	0: 'Multiview',
	1: 'PGM',
}

export const RECORD_FILE_TYPES: Record<number, string> = {
	0: 'AVI',
	1: 'MP4',
	2: 'TS',
	3: 'MOV',
}

export const ENCODER_PROFILES: Record<number, string> = {
	0: 'Baseline',
	1: 'Main',
	2: 'High',
}

export function labelOf(labels: Record<number, string>, id: number, prefix = 'Unknown'): string {
	return labels[id] ?? `${prefix} ${id}`
}
