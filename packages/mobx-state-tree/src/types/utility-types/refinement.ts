import {
    isStateTreeNode,
    getStateTreeNode,
    INode,
    Type,
    IContext,
    IValidationResult,
    typeCheckSuccess,
    typeCheckFailure,
    isType,
    fail,
    TypeFlags,
    IAnyType,
    ExtractC
} from "../../internal"

/**
 * @internal
 * @private
 */
export class Refinement<C, S, T> extends Type<C, S, T> {
    readonly type: IAnyType
    readonly predicate: (v: any) => boolean
    readonly message: (v: any) => string

    get flags() {
        return this.type.flags | TypeFlags.Refinement
    }

    get shouldAttachNode() {
        return this.type.shouldAttachNode
    }

    constructor(
        name: string,
        type: IAnyType,
        predicate: (v: any) => boolean,
        message: (v: any) => string
    ) {
        super(name)
        this.type = type
        this.predicate = predicate
        this.message = message
    }

    describe() {
        return this.name
    }

    instantiate(parent: INode, subpath: string, environment: any, value: any): INode {
        // create the child type
        const inst = this.type.instantiate(parent, subpath, environment, value)

        return inst
    }

    isAssignableFrom(type: IAnyType) {
        return this.type.isAssignableFrom(type)
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        const subtypeErrors = this.type.validate(value, context)
        if (subtypeErrors.length > 0) return subtypeErrors

        const snapshot = isStateTreeNode(value) ? getStateTreeNode(value).snapshot : value

        if (!this.predicate(snapshot)) {
            return typeCheckFailure(context, value, this.message(value))
        }

        return typeCheckSuccess()
    }
}

export function refinement<IT extends IAnyType>(
    name: string,
    type: IT,
    predicate: (snapshot: ExtractC<IT>) => boolean,
    message?: string | ((v: any) => string)
): IT
export function refinement<IT extends IAnyType>(
    type: IT,
    predicate: (snapshot: ExtractC<IT>) => boolean,
    message?: string | ((v: any) => string)
): IT

/**
 * `types.refinement(baseType, (snapshot) => boolean)` creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.
 *
 * @export
 * @alias types.refinement
 * @template T
 * @param {string} name
 * @param {IType<T, T>} type
 * @param {(snapshot: T) => boolean} predicate
 * @returns {IType<T, T>}
 */
export function refinement(...args: any[]): IAnyType {
    const name = typeof args[0] === "string" ? args.shift() : isType(args[0]) ? args[0].name : null
    const type = args[0]
    const predicate = args[1]
    const message = args[2]
        ? args[2]
        : (v: any) => "Value does not respect the refinement predicate"
    // ensures all parameters are correct
    if (process.env.NODE_ENV !== "production") {
        if (typeof name !== "string")
            fail("expected a string as first argument, got " + name + " instead")
        if (!isType(type))
            fail(
                "expected a mobx-state-tree type as first or second argument, got " +
                    type +
                    " instead"
            )
        if (typeof predicate !== "function")
            fail("expected a function as third argument, got " + predicate + " instead")
        if (typeof message !== "function")
            fail("expected a function as fourth argument, got " + message + " instead")
    }
    return new Refinement(name, type, predicate, message)
}

/**
 * Returns if a given value is a refinement type.
 *
 * @export
 * @template IT
 * @param {IT} type
 * @returns {type is IT}
 */
export function isRefinementType<IT extends IAnyType>(type: IT): type is IT {
    return (type.flags & TypeFlags.Refinement) > 0
}
