import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'

export type NvsParamValue = string | number | boolean
export type NvsParams = Record<string, NvsParamValue | undefined>
export type NvsResponse = Record<string, unknown>

export type LogLevel = 'error' | 'warn' | 'info' | 'debug'
export type LogFn = (level: LogLevel, message: string) => void

const REQUEST_TIMEOUT_MS = 5000

/** The NVS-33 HTTP JSON API always uses this realm in the login digest. */
const LOGIN_REALM = 'myrealm'

export class NvsError extends Error {}

export interface NvsConnectionDetails {
	host: string
	port: number
	username: string
	password: string
	/** The device answers on /_dev0 ... /_dev3. */
	channel: number
}

export function md5(input: string): string {
	return createHash('md5').update(input).digest('hex')
}

export function asNumber(value: unknown, fallback = 0): number {
	if (typeof value === 'number' && Number.isFinite(value)) return value
	if (typeof value === 'boolean') return value ? 1 : 0
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value)
		if (Number.isFinite(parsed)) return parsed
	}
	return fallback
}

export function asString(value: unknown, fallback = ''): string {
	if (typeof value === 'string') return value
	if (typeof value === 'number' || typeof value === 'boolean') return String(value)
	return fallback
}

export function asBoolean(value: unknown, fallback = false): boolean {
	return asNumber(value, fallback ? 1 : 0) !== 0
}

function stripUndefined(params: NvsParams): NvsParams {
	const result: NvsParams = {}
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) result[key] = value
	}
	return result
}

/**
 * Thin client for the JSON-over-HTTP control API documented in
 * HTTP.COMMAND.APPS.txt / HTTP.COMMAND.SYSTEN.txt.
 */
export class NvsApi {
	private sessid: string | null = null
	private loginPromise: Promise<void> | null = null

	constructor(
		private readonly details: NvsConnectionDetails,
		private readonly log: LogFn,
	) {}

	get baseUrl(): string {
		return `http://${this.details.host}:${this.details.port}/_dev${this.details.channel}`
	}

	resetSession(): void {
		this.sessid = null
	}

	async login(): Promise<void> {
		if (!this.loginPromise) {
			this.loginPromise = this.doLogin().finally(() => {
				this.loginPromise = null
			})
		}
		await this.loginPromise
	}

	private async doLogin(): Promise<void> {
		const username = this.details.username || 'admin'
		const password = this.details.password || '0000'
		const digest = md5(`${username}:${LOGIN_REALM}:${password}`)

		const response = await this.post({ login: `${username}:${LOGIN_REALM}:${digest}` })
		const sessid = response['sessid']
		if (typeof sessid !== 'string' || sessid.length === 0) {
			const reason = asString(response['_error_'], 'no session id returned')
			throw new NvsError(`Login rejected by the device (${reason}). Check the username and password.`)
		}

		this.sessid = sessid
		this.log('debug', 'Logged in to the device')
	}

	private async post(body: NvsParams): Promise<NvsResponse> {
		const username = this.details.username || 'admin'
		const password = this.details.password || '0000'
		const credentials = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')

		let response: Response
		try {
			response = await fetch(this.baseUrl, {
				method: 'POST',
				headers: {
					// The device expects a JSON body but the working examples use this content type.
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Basic ${credentials}`,
				},
				body: JSON.stringify(body),
				signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
			})
		} catch (error) {
			throw new NvsError(`Cannot reach ${this.baseUrl}: ${(error as Error).message}`)
		}

		const text = await response.text()
		if (!response.ok) {
			throw new NvsError(`The device answered HTTP ${response.status} ${response.statusText}`)
		}

		let parsed: unknown
		try {
			parsed = JSON.parse(text)
		} catch {
			throw new NvsError(`Unexpected response from the device: ${text.slice(0, 120)}`)
		}
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			throw new NvsError(`Unexpected response from the device: ${text.slice(0, 120)}`)
		}
		return parsed as NvsResponse
	}

	private isSessionError(message: string): boolean {
		const lower = message.toLowerCase()
		return lower.includes('session') || lower.includes('login') || lower.includes('auth')
	}

	private async postWithSession(fn: string, params: NvsParams): Promise<NvsResponse> {
		if (!this.sessid) await this.login()

		const sessid = this.sessid
		if (!sessid) throw new NvsError('Not logged in to the device')

		return this.post({ ...stripUndefined(params), Function: fn, sessid })
	}

	/** Sends a command to the device, logging in and retrying once if the session expired. */
	async call(fn: string, params: NvsParams = {}): Promise<NvsResponse> {
		let response = await this.postWithSession(fn, params)

		const error = response['_error_']
		if (typeof error === 'string' && error.trim() !== '' && error.toLowerCase() !== 'ok') {
			if (this.isSessionError(error)) {
				this.sessid = null
				response = await this.postWithSession(fn, params)
			} else {
				throw new NvsError(`${fn} failed: ${error}`)
			}
		}

		return this.checkTextReturn(fn, response)
	}

	private checkTextReturn(fn: string, response: NvsResponse): NvsResponse {
		const result = response['Return']
		if (
			typeof result === 'string' &&
			result.trim() !== '' &&
			result.toLowerCase() !== 'ok' &&
			!Number.isFinite(Number(result))
		) {
			throw new NvsError(`${fn} failed: ${result}`)
		}
		return response
	}

	/**
	 * Reads the current values of a property group, then writes them back with a few keys changed.
	 * Most of the SET functions require the whole property group, so this avoids clearing
	 * settings the user did not touch.
	 */
	async setWithMerge(
		getFn: string,
		getParams: NvsParams,
		setFn: string,
		writableKeys: string[],
		patch: NvsParams,
	): Promise<void> {
		const current = await this.call(getFn, getParams)

		const params: NvsParams = { ...getParams }
		for (const key of writableKeys) {
			const value = current[key]
			if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
				params[key] = value
			}
		}

		await this.call(setFn, { ...params, ...stripUndefined(patch) })
	}
}
