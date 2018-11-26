export type LivelinessMode = "warn" | "error" | "ignore"

let livelinessChecking: LivelinessMode = "warn"

/**
 * Defines what MST should do when running into reads / writes to objects that have died.
 * By default it will print a warning.
 * Use te `"error"` option to easy debugging to see where the error was thrown and when the offending read / write took place
 *
 * Possible values: `"warn"`, `"error"` and `"ignore"`
 *
 * @export
 * @param {LivelinessMode} mode
 */
export function setLivelinessChecking(mode: LivelinessMode) {
    livelinessChecking = mode
}

/**
 * Returns the current liveliness checking mode.
 *
 * Possible values: `"warn"`, `"error"` and `"ignore"`
 *
 * @export
 * @returns {LivelinessMode}
 */
export function getLivelinessChecking(): LivelinessMode {
    return livelinessChecking
}

// deprecated versions, just for compatibility
export type LivelynessMode = LivelinessMode

/**
 * @deprecated use setLivelinessChecking instead
 *
 * Defines what MST should do when running into reads / writes to objects that have died.
 * By default it will print a warning.
 * Use te `"error"` option to easy debugging to see where the error was thrown and when the offending read / write took place
 *
 * Possible values: `"warn"`, `"error"` and `"ignore"`
 *
 * @export
 * @param {LivelinessMode} mode
 */
export function setLivelynessChecking(mode: LivelinessMode) {
    setLivelinessChecking(mode)
}
