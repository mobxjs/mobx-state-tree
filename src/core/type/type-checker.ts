import {
    MstError,
    EMPTY_ARRAY,
    isPrimitive,
    getStateTreeNode,
    isStateTreeNode,
    isPrimitiveType,
    isPlainObject,
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

// Limits used when rendering snapshots/values in error messages, so that long
// strings or large arrays/objects don't take up the whole screen.
const MAX_STRING_LENGTH = 100
const MAX_ARRAY_LENGTH = 3
const MAX_OBJECT_KEYS = 30
const MAX_DEPTH = 5
// Values (and type shapes) whose single-line representation is longer than this
// are pretty-printed across multiple lines instead.
const MAX_INLINE_LENGTH = 80

function safeStringify(value: any, indent?: number) {
    try {
        return JSON.stringify(value, null, indent)
    } catch (e) {
        // istanbul ignore next
        return `<Unserializable: ${e}>`
    }
}

/**
 * Returns a clone of `value` in which overly long strings are clipped and large
 * arrays/objects (or values nested too deeply) are summarized, so the result is
 * safe to print in an error message without flooding the screen.
 */
function truncateForDisplay(value: any, depth: number): any {
    if (typeof value === "string") {
        return value.length > MAX_STRING_LENGTH
            ? `${value.slice(0, MAX_STRING_LENGTH)}… (${value.length - MAX_STRING_LENGTH} more characters)`
            : value
    }
    if (Array.isArray(value)) {
        if (depth >= MAX_DEPTH) return "[…]"
        const items = value
            .slice(0, MAX_ARRAY_LENGTH)
            .map(item => truncateForDisplay(item, depth + 1))
        if (value.length > MAX_ARRAY_LENGTH) {
            items.push(`… ${value.length - MAX_ARRAY_LENGTH} more items`)
        }
        return items
    }
    if (isPlainObject(value)) {
        if (depth >= MAX_DEPTH) return "{…}"
        const result: { [key: string]: any } = {}
        const keys = Object.keys(value)
        keys.slice(0, MAX_OBJECT_KEYS).forEach(key => {
            result[key] = truncateForDisplay(value[key], depth + 1)
        })
        if (keys.length > MAX_OBJECT_KEYS) {
            result["…"] = `${keys.length - MAX_OBJECT_KEYS} more keys`
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

    // Small values are printed compactly on a single line, exactly as before, so
    // they stay easy to read. JSON.stringify returns `undefined` for values like
    // `undefined` itself, which the template literal coerces back to a string.
    const full = safeStringify(value)
    if (full === undefined || full.length <= MAX_INLINE_LENGTH) {
        return `\`${full}\``
    }

    // Large values are clipped (long strings, big arrays/objects, deep nesting)
    // and pretty-printed across multiple lines so they don't flood the screen.
    const truncated = truncateForDisplay(value, 0)
    const compact = safeStringify(truncated)
    if (compact !== undefined && compact.length <= MAX_INLINE_LENGTH) {
        return `\`${compact}\``
    }
    return `\`${safeStringify(truncated, 2)}\``
}

/**
 * Re-indents a type description (as produced by `IType.describe()`) across
 * multiple lines when it is too long to comfortably read on a single line, by
 * breaking after the `{`, `}` and `;` separators used in model shapes (while
 * leaving union `|` and array `[]` parts inline). Characters inside string
 * literals (e.g. literal types like `"a;b"`) are left untouched.
 *
 * Short descriptions are returned unchanged. As this runs while formatting an
 * error that is already being thrown, it must never throw itself: any unexpected
 * input falls back to the original, unformatted description.
 *
 * @internal
 * @hidden
 */
export function prettyPrintDescription(description: string): string {
    if (description.length <= MAX_INLINE_LENGTH) {
        return description
    }

    try {
        let result = ""
        let indent = 0
        let stringDelimiter: string | null = null
        let escaped = false
        const newline = () => {
            // drop any trailing spaces (e.g. the "{ " / "; " separators) before breaking,
            // and never let a malformed (over-closed) shape produce a negative indent
            result = result.replace(/[ \t]+$/, "")
            result += "\n" + "  ".repeat(Math.max(0, indent))
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
                    indent++
                    result += "{"
                    newline()
                    while (description[i + 1] === " ") i++
                    break
                case "}":
                    indent--
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

    return (
        `${pathPrefix}${currentTypename} ${prettyPrintValue(value)} is not assignable ${
            type ? `to type: \`${type.name}\`` : ``
        }` +
        (error.message ? ` (${error.message})` : "") +
        (type
            ? isPrimitiveType(type) || isPrimitive(value)
                ? `.`
                : `, expected an instance of \`${(type as IAnyType).name}\` or a snapshot like \`${prettyPrintDescription(
                      (type as IAnyType).describe()
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

    return (
        `Error while converting ${prettyPrintValue(value)} to \`${type.name}\`:\n\n    ` +
        errors.map(toErrorString).join("\n    ")
    )
}
