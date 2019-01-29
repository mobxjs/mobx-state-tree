import {
    Type,
    isPrimitive,
    fail,
    identity,
    createScalarNode,
    ISimpleType,
    IType,
    TypeFlags,
    IValidationContext,
    IValidationResult,
    typeCheckSuccess,
    typeCheckFailure,
    isType,
    IChildNodesMap,
    isInteger,
    AnyObjectNode,
    AnyNode
} from "../internal"

// TODO: implement CoreType using types.custom ?
/**
 * @internal
 * @hidden
 */
export class CoreType<C, S, T> extends Type<C, S, T> {
    constructor(
        name: string,
        readonly flags: TypeFlags,
        private readonly checker: (value: C) => boolean,
        private readonly initializer: (v: C) => T = identity
    ) {
        super(name)
        this.flags = flags
    }

    describe() {
        return this.name
    }

    instantiate(
        parent: AnyObjectNode | null,
        subpath: string,
        environment: any,
        snapshot: T
    ): this["N"] {
        return createScalarNode(this, parent, subpath, environment, snapshot)
    }

    createNewInstance(node: this["N"], childNodes: IChildNodesMap, initialValue: any) {
        return this.initializer(initialValue)
    }

    isValidSnapshot(value: any, context: IValidationContext): IValidationResult {
        if (isPrimitive(value) && this.checker(value as any)) {
            return typeCheckSuccess()
        }
        const typeName = this.name === "Date" ? "Date or a unix milliseconds timestamp" : this.name
        return typeCheckFailure(context, value, `Value is not a ${typeName}`)
    }
}

/**
 * `types.string` - Creates a type that can only contain a string value.
 * This type is used for string values by default
 *
 * Example:
 * ```ts
 * const Person = types.model({
 *   firstName: types.string,
 *   lastName: "Doe"
 * })
 * ```
 */
// tslint:disable-next-line:variable-name
export const string: ISimpleType<string> = new CoreType<string, string, string>(
    "string",
    TypeFlags.String,
    v => typeof v === "string"
)

/**
 * `types.number` - Creates a type that can only contain a numeric value.
 * This type is used for numeric values by default
 *
 * Example:
 * ```ts
 * const Vector = types.model({
 *   x: types.number,
 *   y: 1.5
 * })
 * ```
 */
// tslint:disable-next-line:variable-name
export const number: ISimpleType<number> = new CoreType<number, number, number>(
    "number",
    TypeFlags.Number,
    v => typeof v === "number"
)

/**
 * `types.integer` - Creates a type that can only contain an integer value.
 * This type is used for integer values by default
 *
 * Example:
 * ```ts
 * const Size = types.model({
 *   width: types.integer,
 *   height: 10
 * })
 * ```
 */
// tslint:disable-next-line:variable-name
export const integer: ISimpleType<number> = new CoreType<number, number, number>(
    "integer",
    TypeFlags.Integer,
    v => isInteger(v)
)

/**
 * `types.boolean` - Creates a type that can only contain a boolean value.
 * This type is used for boolean values by default
 *
 * Example:
 * ```ts
 * const Thing = types.model({
 *   isCool: types.boolean,
 *   isAwesome: false
 * })
 * ```
 */
// tslint:disable-next-line:variable-name
export const boolean: ISimpleType<boolean> = new CoreType<boolean, boolean, boolean>(
    "boolean",
    TypeFlags.Boolean,
    v => typeof v === "boolean"
)

/**
 * `types.null` - The type of the value `null`
 */
export const nullType: ISimpleType<null> = new CoreType<null, null, null>(
    "null",
    TypeFlags.Null,
    v => v === null
)

/**
 * `types.undefined` - The type of the value `undefined`
 */
export const undefinedType: ISimpleType<undefined> = new CoreType<undefined, undefined, undefined>(
    "undefined",
    TypeFlags.Undefined,
    v => v === undefined
)

/**
 * `types.Date` - Creates a type that can only contain a javascript Date value.
 *
 * Example:
 * ```ts
 * const LogLine = types.model({
 *   timestamp: types.Date,
 * })
 *
 * LogLine.create({ timestamp: new Date() })
 * ```
 */
// tslint:disable-next-line:variable-name
export const DatePrimitive: IType<number | Date, number, Date> = new CoreType<
    number | Date,
    number,
    Date
>(
    "Date",
    TypeFlags.Date,
    v => typeof v === "number" || v instanceof Date,
    v => (v instanceof Date ? v : new Date(v))
)
DatePrimitive.getSnapshot = function(node: AnyNode) {
    return node.storedValue.getTime()
}

/**
 * @internal
 * @hidden
 */
export function getPrimitiveFactoryFromValue(value: any): ISimpleType<any> {
    switch (typeof value) {
        case "string":
            return string
        case "number":
            return number // In the future, isInteger(value) ? integer : number would be interesting, but would be too breaking for now
        case "boolean":
            return boolean
        case "object":
            if (value instanceof Date) return DatePrimitive
    }
    throw fail("Cannot determine primitive type from value " + value)
}

/**
 * Returns if a given value represents a primitive type.
 *
 * @param type
 * @returns
 */
export function isPrimitiveType<
    IT extends
        | ISimpleType<string>
        | ISimpleType<number>
        | ISimpleType<boolean>
        | typeof DatePrimitive
>(type: IT): type is IT {
    return (
        isType(type) &&
        (type.flags &
            (TypeFlags.String |
                TypeFlags.Number |
                TypeFlags.Integer |
                TypeFlags.Boolean |
                TypeFlags.Date)) >
            0
    )
}
