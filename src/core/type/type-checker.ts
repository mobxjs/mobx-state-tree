import {
    MstError,
    EMPTY_ARRAY,
    isPrimitive,
    getStateTreeNode,
    isStateTreeNode,
    isPrimitiveType,
    isPlainObject,
    getErrorFormatting,
    ErrorFormattingOptions,
    IAnyType,
    ExtractCSTWithSTN,
    isTypeCheckingEnabled,
    devMode
} from "../../internal"

/** Validation context entry, this is, where the validation should run against which type */
export interface IValidationContextEntry {
    /** Subpath where the validation should be run, or an empty string to validate it all */
    path: string
    /** Type to validate the subpath against */
    type: IAnyType
}

/** Array of validation context entries */
export type IValidationContext = IValidationContextEntry[]

/** Type validation error */
export interface IValidationError {
    /** Validation context */
    context: IValidationContext
    /** Value that was being validated, either a snapshot or an instance */
    value: any
    /** Error message */
    message?: string
}

/** Type validation result, which is an array of type validation errors */
export type IValidationResult = IValidationError[]

function safeStringify(value: any, indent?: number) {
    try {
        return JSON.stringify(value, null, indent)
    } catch (e) {
        // istanbul ignore next
        return `<Unserializable: ${e}>`
    }
}

function shortenPrintValue(valueInString: string) {
    return valueInString.length < 280
        ? valueInString
        : `${valueInString.substring(0, 272)}......${valueInString.substring(valueInString.length - 8)}`
}

/**
 * Returns a clone of `value` in which overly long strings are clipped and large
 * arrays/objects (or values nested too deeply) are summarized, so the result is
 * safe to print in an error message without flooding the screen.
 */
function truncateForDisplay(value: any, depth: number, options: ErrorFormattingOptions): any {
    if (typeof value === "string") {
        return value.length > options.maxStringLength
            ? `${value.slice(0, options.maxStringLength)}… (${value.length - options.maxStringLength} more characters)`
            : value
    }
    if (Array.isArray(value)) {
        if (depth >= options.maxDepth) return "[…]"
        const items = value
            .slice(0, options.maxArrayLength)
            .map(item => truncateForDisplay(item, depth + 1, options))
        if (value.length > options.maxArrayLength) {
            items.push(`… ${value.length - options.maxArrayLength} more items`)
        }
        return items
    }
    if (isPlainObject(value)) {
        if (depth >= options.maxDepth) return "{…}"
        const result: { [key: string]: any } = {}
        const keys = Object.keys(value)
        keys.slice(0, options.maxPropertyCount).forEach(key => {
            result[key] = truncateForDisplay(value[key], depth + 1, options)
        })
        if (keys.length > options.maxPropertyCount) {
            result["…"] = `${keys.length - options.maxPropertyCount} more keys`
        }
        return result
    }
    return value
}

/**
 * @internal
 * @hidden
 */
export function prettyPrintValue(value: any) {
    if (typeof value === "function") {
        return `<function${value.name ? " " + value.name : ""}>`
    }
    if (isStateTreeNode(value)) {
        return `<${value}>`
    }

    const options = getErrorFormatting()
    if (!options.enabled) {
        // Default behavior: serialize the value compactly on a single line.
        // JSON.stringify returns `undefined` for values like `undefined` itself,
        // which the template literal coerces back to a string.
        return `\`${safeStringify(value)}\``
    }

    // Opt-in behavior: clip long strings, big arrays/objects and deep nesting, and
    // (when indent > 0) pretty-print the result across multiple lines.
    const truncated = truncateForDisplay(value, 0, options)
    return `\`${safeStringify(truncated, options.indent || undefined)}\``
}

/**
 * Re-indents a type description (as produced by `IType.describe()`) across
 * multiple lines, by breaking after the `{`, `}` and `;` separators used in
 * model shapes (while leaving union `|` and array `[]` parts inline).
 * Characters inside string literals (e.g. literal types like `"a;b"`) are left
 * untouched.
 *
 * `indentSize` is the number of spaces per nesting level; when it is `0` (or
 * negative) the description is returned unchanged on a single line. As this runs
 * while formatting an error that is already being thrown, it must never throw
 * itself: any unexpected input falls back to the original, unformatted
 * description.
 *
 * @internal
 * @hidden
 */
export function prettyPrintDescription(description: string, indentSize: number): string {
    if (indentSize <= 0) {
        return description
    }

    try {
        const step = " ".repeat(indentSize)
        let result = ""
        let depth = 0
        let stringDelimiter: string | null = null
        let escaped = false
        const newline = () => {
            // drop any trailing spaces (e.g. the "{ " / "; " separators) before breaking,
            // and never let a malformed (over-closed) shape produce a negative indent
            result = result.replace(/[ \t]+$/, "")
            result += "\n" + step.repeat(Math.max(0, depth))
        }

        for (let i = 0; i < description.length; i++) {
            const char = description[i]

            if (stringDelimiter) {
                result += char
                if (escaped) {
                    escaped = false
                } else if (char === "\\") {
                    escaped = true
                } else if (char === stringDelimiter) {
                    stringDelimiter = null
                }
                continue
            }

            switch (char) {
                case '"':
                case "'":
                    stringDelimiter = char
                    result += char
                    break
                case "{":
                    depth++
                    result += "{"
                    newline()
                    while (description[i + 1] === " ") i++
                    break
                case "}":
                    depth--
                    newline()
                    result += "}"
                    break
                case ";":
                    result += ";"
                    newline()
                    while (description[i + 1] === " ") i++
                    break
                default:
                    result += char
            }
        }

        return result
    } catch (e) {
        // istanbul ignore next - defensive: never let formatting hide the real error
        return description
    }
}

function toErrorString(error: IValidationError): string {
    const { value } = error
    const type = error.context[error.context.length - 1].type!
    const fullPath = error.context
        .map(({ path }) => path)
        .filter(path => path.length > 0)
        .join("/")

    const pathPrefix = fullPath.length > 0 ? `at path "/${fullPath}" ` : ``

    const currentTypename = isStateTreeNode(value)
        ? `value of type ${getStateTreeNode(value).type.name}:`
        : isPrimitive(value)
          ? "value"
          : "snapshot"
    const isSnapshotCompatible =
        type && isStateTreeNode(value) && type.is(getStateTreeNode(value).snapshot)

    // When error formatting is enabled, the type shape is re-indented using the
    // same indent setting as values; otherwise it's left on a single line.
    const formatting = getErrorFormatting()
    const describeType = (t: IAnyType) =>
        formatting.enabled ? prettyPrintDescription(t.describe(), formatting.indent) : t.describe()

    return (
        `${pathPrefix}${currentTypename} ${prettyPrintValue(value)} is not assignable ${
            type ? `to type: \`${type.name}\`` : ``
        }` +
        (error.message ? ` (${error.message})` : "") +
        (type
            ? isPrimitiveType(type) || isPrimitive(value)
                ? `.`
                : `, expected an instance of \`${(type as IAnyType).name}\` or a snapshot like \`${describeType(
                      type as IAnyType
                  )}\` instead.` +
                  (isSnapshotCompatible
                      ? " (Note that a snapshot of the provided value is compatible with the targeted type)"
                      : "")
            : `.`)
    )
}

/**
 * @internal
 * @hidden
 */
export function getContextForPath(
    context: IValidationContext,
    path: string,
    type: IAnyType
): IValidationContext {
    return context.concat([{ path, type }])
}

/**
 * @internal
 * @hidden
 */
export function typeCheckSuccess(): IValidationResult {
    return EMPTY_ARRAY as any
}

/**
 * @internal
 * @hidden
 */
export function typeCheckFailure(
    context: IValidationContext,
    value: any,
    message?: string
): IValidationResult {
    return [{ context, value, message }]
}

/**
 * @internal
 * @hidden
 */
export function flattenTypeErrors(errors: IValidationResult[]): IValidationResult {
    return errors.reduce((a, i) => a.concat(i), [])
}

// TODO; doublecheck: typecheck should only needed to be invoked from: type.create and array / map / value.property will change
/**
 * @internal
 * @hidden
 */
export function typecheckInternal<IT extends IAnyType>(
    type: IAnyType,
    value: ExtractCSTWithSTN<IT>
): void {
    // runs typeChecking if it is in dev-mode or through a process.env.ENABLE_TYPE_CHECK flag
    if (isTypeCheckingEnabled()) {
        typecheck(type, value)
    }
}

/**
 * Run's the typechecker for the given type on the given value, which can be a snapshot or an instance.
 * Throws if the given value is not according the provided type specification.
 * Use this if you need typechecks even in a production build (by default all automatic runtime type checks will be skipped in production builds)
 *
 * @param type Type to check against.
 * @param value Value to be checked, either a snapshot or an instance.
 */
export function typecheck<IT extends IAnyType>(type: IT, value: ExtractCSTWithSTN<IT>): void {
    const errors = type.validate(value, [{ path: "", type }])

    if (errors.length > 0) {
        throw new MstError(validationErrorsToString(type, value, errors))
    }
}

function validationErrorsToString<IT extends IAnyType>(
    type: IT,
    value: ExtractCSTWithSTN<IT>,
    errors: IValidationError[]
): string | undefined {
    if (errors.length === 0) {
        return undefined
    }

    // When formatting is disabled, keep the original behavior of capping the
    // header value's length; when enabled, truncation already bounds its size.
    const printedValue = prettyPrintValue(value)
    const headerValue = getErrorFormatting().enabled
        ? printedValue
        : shortenPrintValue(printedValue)

    return (
        `Error while converting ${headerValue} to \`${type.name}\`:\n\n    ` +
        errors.map(toErrorString).join("\n    ")
    )
}
