import {
    fail,
    EMPTY_ARRAY,
    isPrimitive,
    getStateTreeNode,
    isStateTreeNode,
    isPrimitiveType,
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

function safeStringify(value: any) {
    try {
        return JSON.stringify(value)
    } catch (e) {
        // istanbul ignore next
        return `<Unserializable: ${e}>`
    }
}

/**
 * @internal
 * @hidden
 */
export function prettyPrintValue(value: any) {
    return typeof value === "function"
        ? `<function${value.name ? " " + value.name : ""}>`
        : isStateTreeNode(value)
        ? `<${value}>`
        : `${safeStringify(value)}`
}

function shortenPrintValue(valueInString: string) {
    return valueInString.length < 280
        ? valueInString
        : `${valueInString.substring(0, 272)}......${valueInString.substring(
              valueInString.length - 8
          )}`
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
        throw fail(validationErrorsToString(type, value, errors))
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

    const messageArray = [`Error converting data to '${type.name}':\n`]
    messageArray.push("- Expected")
    messageArray.push("+ Received\n")

    errors.forEach(error => {
        const fullPath =
            `<${type.name}>.` +
            error.context
                .map(({ path }) => path)
                .filter(path => path.length > 0)
                .join(".")
        if (!messageArray.includes(fullPath)) {
            const expected = error.context[error.context.length - 1].type
            const received = prettyPrintValue(error.value)
            messageArray.push(fullPath)
            messageArray.push(`- ${expected.name} (${expected.constructor.name})`)
            messageArray.push(`+ ${received}`)
        }
    })

    return messageArray.join("\n")
}
