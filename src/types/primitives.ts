import { ISimpleType, IType, Type } from "./type"
import { TypeFlags } from "./type-flags"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure } from "./type-checker"
import { isPrimitive, fail, identity } from "../utils"
import { Node, createNode } from "../core"

export class CoreType<S, T> extends Type<S, T> {
    readonly checker: (value: any) => boolean
    readonly flags: TypeFlags
    readonly initializer: (v: any) => any

    constructor(
        name: any,
        flags: TypeFlags,
        checker: any,
        initializer: (v: any) => any = identity
    ) {
        super(name)
        this.flags = flags
        this.checker = checker
        this.initializer = initializer
    }

    describe() {
        return this.name
    }

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: T): Node {
        return createNode(this, parent, subpath, environment, snapshot, this.initializer)
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (isPrimitive(value) && this.checker(value)) {
            return typeCheckSuccess()
        }
        const typeName = this.name === "Date" ? "Date or a unix milliseconds timestamp" : this.name
        return typeCheckFailure(context, value, `Value is not a ${typeName}`)
    }
}

/**
 * Creates a type that can only contain a string value.
 * This type is used for string values by default
 *
 * @export
 * @alias types.string
 * @example
 * const Person = types.model({
 *   firstName: types.string,
 *   lastName: "Doe"
 * })
 */
// tslint:disable-next-line:variable-name
export const string: ISimpleType<string> = new CoreType<string, string>(
    "string",
    TypeFlags.String,
    (v: any) => typeof v === "string"
)

/**
 * Creates a type that can only contain a numeric value.
 * This type is used for numeric values by default
 *
 * @export
 * @alias types.number
 * @example
 * const Vector = types.model({
 *   x: types.number,
 *   y: 0
 * })
 */
// tslint:disable-next-line:variable-name
export const number: ISimpleType<number> = new CoreType<number, number>(
    "number",
    TypeFlags.Number,
    (v: any) => typeof v === "number"
)

/**
 * Creates a type that can only contain a boolean value.
 * This type is used for boolean values by default
 *
 * @export
 * @alias types.boolean
 * @example
 * const Thing = types.model({
 *   isCool: types.boolean,
 *   isAwesome: false
 * })
 */
// tslint:disable-next-line:variable-name
export const boolean: ISimpleType<boolean> = new CoreType<boolean, boolean>(
    "boolean",
    TypeFlags.Boolean,
    (v: any) => typeof v === "boolean"
)

/**
 * The type of the value `null`
 *
 * @export
 * @alias types.null
 */
export const nullType: ISimpleType<null> = new CoreType<null, null>(
    "null",
    TypeFlags.Null,
    (v: any) => v === null
)

/**
 * The type of the value `undefined`
 *
 * @export
 * @alias types.undefined
 */
export const undefinedType: ISimpleType<undefined> = new CoreType<undefined, undefined>(
    "undefined",
    TypeFlags.Undefined,
    (v: any) => v === undefined
)

/**
 * Creates a type that can only contain a javascript Date value.
 *
 * @export
 * @alias types.Date
 * @example
 * const LogLine = types.model({
 *   timestamp: types.Date,
 * })
 *
 * LogLine.create({ timestamp: new Date() })
 */
// tslint:disable-next-line:variable-name
export const DatePrimitive: IType<number, Date> = new CoreType<number, Date>(
    "Date",
    TypeFlags.Date,
    (v: any) => typeof v === "number" || v instanceof Date,
    (v: number | Date) => (v instanceof Date ? v : new Date(v))
)
;(DatePrimitive as any).getSnapshot = function(node: Node) {
    return node.storedValue.getTime()
}

export function getPrimitiveFactoryFromValue(value: any): ISimpleType<any> {
    switch (typeof value) {
        case "string":
            return string
        case "number":
            return number
        case "boolean":
            return boolean
        case "object":
            if (value instanceof Date) return DatePrimitive
    }
    return fail("Cannot determine primitive type from value " + value)
}
