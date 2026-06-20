/**
 * Options that control how snapshots/values and type shapes are rendered inside
 * type-checking error messages (see {@link setErrorFormatting}).
 */
export interface ErrorFormattingOptions {
    /**
     * When `false` (the default), error messages are rendered exactly as they
     * always have been: the offending value is serialized to a single
     * `JSON.stringify` line and the message is capped in length. When `true`,
     * the value is truncated (using the limits below) and, when `indent > 0`,
     * pretty-printed across multiple lines.
     */
    enabled: boolean
    /**
     * Number of spaces to indent each nesting level by when pretty-printing.
     * Use `0` to keep everything on a single line while still truncating
     * (handy when you only want to bound the message size, not reflow it).
     */
    indent: number
    /** Strings longer than this are clipped, with a note of how many characters were omitted. */
    maxStringLength: number
    /** Arrays with more than this many items are clipped, with a note of how many items were omitted. */
    maxArrayLength: number
    /** Objects with more than this many keys are clipped, with a note of how many keys were omitted. */
    maxPropertyCount: number
    /** Values nested deeper than this are summarized as `{…}` / `[…]`. */
    maxDepth: number
}

const defaultOptions: ErrorFormattingOptions = {
    enabled: false,
    indent: 2,
    maxStringLength: 100,
    maxArrayLength: 10,
    maxPropertyCount: 30,
    maxDepth: 5
}

let currentOptions: ErrorFormattingOptions = { ...defaultOptions }

/**
 * Configures how snapshots/values and type shapes are formatted inside
 * type-checking error messages. This is **opt-in**: by default MST keeps its
 * original single-line error formatting, so enabling this does not change
 * behavior for anyone who doesn't call it.
 *
 * The given options are merged over the current ones, so you can set only the
 * fields you care about.
 *
 * @example
 * // pretty-print large snapshots across multiple lines and truncate them
 * setErrorFormatting({ enabled: true })
 *
 * @example
 * // only bound the message size, without reflowing it onto multiple lines
 * setErrorFormatting({ enabled: true, indent: 0 })
 *
 * @example
 * // tweak the truncation limits
 * setErrorFormatting({ enabled: true, maxArrayLength: 3, maxStringLength: 40 })
 *
 * @param options A partial set of {@link ErrorFormattingOptions} to apply.
 */
export function setErrorFormatting(options: Partial<ErrorFormattingOptions>): void {
    currentOptions = { ...currentOptions, ...options }
}

/**
 * Returns a copy of the current error formatting options (see
 * {@link setErrorFormatting}). Useful for temporarily overriding and then
 * restoring the configuration.
 *
 * @returns The current {@link ErrorFormattingOptions}.
 */
export function getErrorFormatting(): ErrorFormattingOptions {
    return { ...currentOptions }
}
