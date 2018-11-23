export type LivelynessMode = "warn" | "error" | "ignore"

let livelynessChecking: LivelynessMode = "warn"

/**
 *  Defines what MST should do when running into reads / writes to objects that have died.
 * By default it will print a warning.
 * Use te `"error"` option to easy debugging to see where the error was thrown and when the offending read / write took place
 *
 * Possible values: `"warn"`, `"error"` and `"ignore"`
 *
 * @export
 * @param {LivelynessMode} mode
 */
export function setLivelynessChecking(mode: LivelynessMode) {
    livelynessChecking = mode
}

export function getLivelynessChecking(): LivelynessMode {
    return livelynessChecking
}
