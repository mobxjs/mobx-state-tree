import {
    isSerializable,
    deepFreeze,
    createNode,
    INode,
    ISimpleType,
    Type,
    IContext,
    IValidationResult,
    typeCheckSuccess,
    typeCheckFailure,
    TypeFlags,
    isType,
    ObjectNode,
    optional,
    IType
} from "../../internal"

export class Frozen<T> extends Type<T, T, T> {
    readonly shouldAttachNode = false
    flags = TypeFlags.Frozen

    constructor() {
        super("frozen")
    }

    describe() {
        return "<any immutable value>"
    }

    instantiate(parent: ObjectNode | null, subpath: string, environment: any, value: any): INode {
        // create the node
        return createNode(this, parent, subpath, environment, deepFreeze(value))
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (!isSerializable(value)) {
            return typeCheckFailure(
                context,
                value,
                "Value is not serializable and cannot be frozen"
            )
        }
        return typeCheckSuccess()
    }
}

const frozenInstance = new Frozen()

/**
 * Frozen can be used to story any value that is serializable in itself (that is valid JSON).
 * Frozen values need to be immutable or treated as if immutable. They need be serializable as well.
 * Values stored in frozen will snapshotted as-is by MST, and internal changes will not be tracked.
 *
 * This is useful to store complex, but immutable values like vectors etc. It can form a powerful bridge to parts of your application that should be immutable, or that assume data to be immutable.
 *
 * Note: if you want to store free-form state that is mutable, or not serializeable, consider using volatile state instead.
 *
 * `types.frozen` accepts an optional default value. Note that the function is generic to support strong typing
 *
 * @example
 * const GameCharacter = types.model({
 *   name: string,
 *   location: types.frozen({ x: 0, y: 0})
 * })
 *
 * const hero = GameCharacter.create({
 *   name: "Mario",
 *   location: { x: 7, y: 4 }
 * })
 *
 * hero.location = { x: 10, y: 2 } // OK
 * hero.location.x = 7 // Not ok!
 *
 * @example
 * type Point = { x: number, y: number }
 *    const Mouse = types.model({
 *         loc: types.frozen<Point>()
 *    })
 *
 * @alias types.frozen
 */
export function frozen<T>(defaultValue: T): IType<T | undefined, T, Readonly<T>>
export function frozen<T>(): IType<T, T, Readonly<T>>
export function frozen<T>(defaultValue?: any) {
    if (arguments.length === 0) return frozenInstance as any
    else return optional(frozenInstance, defaultValue) as any
}

export function isFrozenType(type: any): type is Frozen<any> {
    return isType(type) && (type.flags & TypeFlags.Frozen) > 0
}
