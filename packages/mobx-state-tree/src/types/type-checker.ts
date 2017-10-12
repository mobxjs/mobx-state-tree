export interface IContextEntry {
    path: string
    type?: IType<any, any>
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

export function prettyPrintValue(value: any) {
    return typeof value === "function"
        ? `<function${value.name ? " " + value.name : ""}>`
        : isStateTreeNode(value) ? `<${value}>` : `\`${safeStringify(value)}\``
}

function toErrorString(error: IValidationError): string {
    const { value } = error
    const type: IType<any, any> = error.context[error.context.length - 1].type as any
    const fullPath = error.context
        .map(({ path }) => path)
        .filter(path => path.length > 0)
        .join("/")

    const pathPrefix = fullPath.length > 0 ? `at path "/${fullPath}" ` : ``

    const currentTypename = isStateTreeNode(value)
        ? `value of type ${getStateTreeNode(value).type.name}:`
        : isPrimitive(value) ? "value" : "snapshot"
    const isSnapshotCompatible =
        type && isStateTreeNode(value) && type.is(getStateTreeNode(value).snapshot)

    return (
        `${pathPrefix}${currentTypename} ${prettyPrintValue(value)} is not assignable ${type
            ? `to type: \`${type.name}\``
            : ``}` +
        (error.message ? ` (${error.message})` : "") +
        (type
            ? isPrimitiveType(type)
              ? `.`
              : `, expected an instance of \`${type.name}\` or a snapshot like \`${type.describe()}\` instead.` +
                (isSnapshotCompatible
                    ? " (Note that a snapshot of the provided value is compatible with the targeted type)"
                    : "")
            : `.`)
    )
}

export function getDefaultContext(type: IType<any, any>): IContext {
    return [{ type, path: "" }]
}

export function getContextForPath(
    context: IContext,
    path: string,
    type?: IType<any, any>
): IContext {
    return context.concat([{ path, type }])
}

export function typeCheckSuccess(): IValidationResult {
    return EMPTY_ARRAY as any
}

export function typeCheckFailure(
    context: IContext,
    value: any,
    message?: string
): IValidationResult {
    return [{ context, value, message }]
}

export function flattenTypeErrors(errors: IValidationResult[]): IValidationResult {
    return errors.reduce((a, i) => a.concat(i), [])
}

// TODO; doublecheck: typecheck should only needed to be invoked from: type.create and array / map / value.property will change
export function typecheck(type: IType<any, any>, value: any): void {
    // if not in dev-mode, do not even try to run typecheck. Everything is developer fault!
    if (process.env.NODE_ENV === "production") return
    typecheckPublic(type, value)
}

/**
 * Run's the typechecker on the given type.
 * Throws if the given value is not according the provided type specification.
 * Use this if you need typechecks even in a production build (by default all automatic runtime type checks will be skipped in production builds)
 *
 * @alias typecheck
 * @export
 * @param {IType<any, any>} type
 * @param {*} value
 */
export function typecheckPublic(type: IType<any, any>, value: any): void {
    const errors = type.validate(value, [{ path: "", type }])

    if (errors.length > 0) {
        fail(
            `Error while converting ${prettyPrintValue(value)} to \`${type.name}\`:\n` +
                errors.map(toErrorString).join("\n")
        )
    }
}

import { IType } from "./type"
import { fail, EMPTY_ARRAY, isPrimitive } from "../utils"
import { getStateTreeNode, isStateTreeNode } from "../core"
import { isPrimitiveType } from "./type-flags"
