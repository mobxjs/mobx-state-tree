import {
    fail,
    EMPTY_ARRAY,
    isPrimitive,
    getStateTreeNode,
    isStateTreeNode,
    isPrimitiveType,
    IAnyType,
    CoreType,
    IType
} from "../../internal"

export interface IContextEntry {
    path: string
    type?: IAnyType
}

export type IContext = IContextEntry[]

export interface IValidationError {
    context: IContext
    value: any
    message?: string
}

export type IValidationResult = IValidationError[]

function safeStringify(value: any) {
    try {
        return JSON.stringify(value)
    } catch (e) {
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
        : `\`${safeStringify(value)}\``
}

function shortenPrintValue(valueInString: string) {
    return valueInString.length < 280
        ? valueInString
        : `${valueInString.substring(0, 272)}......${valueInString.substring(
              valueInString.length - 8
          )}`
}

function toErrorString(error: IValidationError): string {
    const { value } = error
    const type: IAnyType = error.context[error.context.length - 1].type as any
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
                : `, expected an instance of \`${
                      (type as CoreType<any, any, any>).name
                  }\` or a snapshot like \`${(type as CoreType<
                      any,
                      any,
                      any
                  >).describe()}\` instead.` +
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
export function getDefaultContext(type: IAnyType): IContext {
    return [{ type, path: "" }]
}

/**
 * @internal
 * @hidden
 */
export function getContextForPath(context: IContext, path: string, type?: IAnyType): IContext {
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
    context: IContext,
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
export function typecheckInternal<C, S, T>(type: IType<C, S, T>, value: C | S | T): void {
    // if not in dev-mode, do not even try to run typecheck. Everything is developer fault!
    if (process.env.NODE_ENV === "production") return
    typecheck(type, value)
}

/**
 * Run's the typechecker on the given type.
 * Throws if the given value is not according the provided type specification.
 * Use this if you need typechecks even in a production build (by default all automatic runtime type checks will be skipped in production builds)
 *
 * @param type Type to check against.
 * @param value Value to be checked.
 */
export function typecheck<C, S, T>(type: IType<C, S, T>, value: C | S | T): void {
    const errors = type.validate(value, [{ path: "", type }])

    if (errors.length > 0) {
        throw fail(
            `Error while converting ${shortenPrintValue(prettyPrintValue(value))} to \`${
                type.name
            }\`:\n\n    ` + errors.map(toErrorString).join("\n    ")
        )
    }
}
