import {
    isStateTreeNode,
    getStateTreeNode,
    Type,
    IContext,
    IValidationResult,
    typeCheckSuccess,
    typeCheckFailure,
    isType,
    fail,
    TypeFlags,
    IAnyType,
    ExtractC,
    AnyObjectNode
} from "../../internal"

/**
 * @internal
 * @hidden
 */
export class Refinement<C, S, T> extends Type<C, S, T, false> {
    readonly type: IAnyType
    readonly predicate: (v: C) => boolean
    readonly message: (v: C) => string

    get flags() {
        return this.type.flags | TypeFlags.Refinement
    }

    constructor(
        name: string,
        type: IAnyType,
        predicate: (v: C) => boolean,
        message: (v: C) => string
    ) {
        super(name)
        this.type = type
        this.predicate = predicate
        this.message = message
    }

    describe() {
        return this.name
    }

    instantiate(
        parent: AnyObjectNode | null,
        subpath: string,
        environment: any,
        value: any
    ): this["N"] {
        // create the child type
        return this.type.instantiate(parent, subpath, environment, value)
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
    message?: string | ((v: ExtractC<IT>) => string)
): IT
export function refinement<IT extends IAnyType>(
    type: IT,
    predicate: (snapshot: ExtractC<IT>) => boolean,
    message?: string | ((v: ExtractC<IT>) => string)
): IT

/**
 * `types.refinement` - Creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.
 *
 * @param name
 * @param type
 * @param predicate
 * @returns
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
            throw fail("expected a string as first argument, got " + name + " instead")
        if (!isType(type))
            throw fail(
                "expected a mobx-state-tree type as first or second argument, got " +
                    type +
                    " instead"
            )
        if (typeof predicate !== "function")
            throw fail("expected a function as third argument, got " + predicate + " instead")
        if (typeof message !== "function")
            throw fail("expected a function as fourth argument, got " + message + " instead")
    }
    return new Refinement(name, type, predicate, message)
}

/**
 * Returns if a given value is a refinement type.
 *
 * @param type
 * @returns
 */
export function isRefinementType<IT extends IAnyType>(type: IT): type is IT {
    return (type.flags & TypeFlags.Refinement) > 0
}
