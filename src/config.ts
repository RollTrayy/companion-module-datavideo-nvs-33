import type { SomeCompanionConfigField } from '@companion-module/base'

export type ModuleConfig = {
	host: string
	port: number
	username: string
	channel: number
	pollInterval: number
}

export type ModuleSecrets = {
	password?: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			label: 'Information',
			width: 12,
			value:
				'Controls a Datavideo NVS-33 over its HTTP JSON API. The factory default address is 192.168.1.60, ' +
				'username "admin" and password "0000". Leave the password empty to use the factory default.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Device address (IP or hostname)',
			width: 8,
			default: '192.168.1.60',
			minLength: 1,
		},
		{
			type: 'number',
			id: 'port',
			label: 'HTTP port',
			width: 4,
			min: 1,
			max: 65535,
			default: 80,
		},
		{
			type: 'textinput',
			id: 'username',
			label: 'Username',
			width: 6,
			default: 'admin',
		},
		{
			type: 'secret-text',
			id: 'password',
			label: 'Password (empty = factory default "0000")',
			width: 6,
		},
		{
			type: 'number',
			id: 'channel',
			label: 'Device channel (/ _devN endpoint)',
			width: 6,
			min: 0,
			max: 3,
			default: 0,
		},
		{
			type: 'number',
			id: 'pollInterval',
			label: 'Poll interval (ms, 0 = on demand only)',
			width: 6,
			min: 0,
			max: 60000,
			default: 3000,
		},
	]
}
