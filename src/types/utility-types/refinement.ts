import { IType, Type } from "../type"
import { TypeFlags, isType } from "../type-flags"
import { isStateTreeNode, getStateTreeNode, Node } from "../../core"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure } from "../type-checker"
import { fail } from "../../utils"

export class Refinement<S, T> extends Type<S, T> {
    readonly type: IType<any, any>
    readonly predicate: (v: any) => boolean

    get flags() {
        return this.type.flags | TypeFlags.Refinement
    }

    constructor(name: string, type: IType<any, any>, predicate: (v: any) => boolean) {
        super(name)
        this.type = type
        this.predicate = predicate
    }

    describe() {
        return this.name
    }

    instantiate(parent: Node, subpath: string, environment: any, value: any): Node {
        // create the child type
        const inst = this.type.instantiate(parent, subpath, environment, value)

        return inst
    }

    isAssignableFrom(type: IType<any, any>) {
        return this.type.isAssignableFrom(type)
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        const subtypeErrors = this.type.validate(value, context)
        if (subtypeErrors.length > 0) return subtypeErrors

        const snapshot = isStateTreeNode(value) ? getStateTreeNode(value).snapshot : value

        if (!this.predicate(snapshot)) {
            return typeCheckFailure(
                context,
                value,
                "Value does not respect the refinement predicate"
            )
        }

        return typeCheckSuccess()
    }
}

export function refinement<T>(
    name: string,
    type: IType<T, T>,
    predicate: (snapshot: T) => boolean
): IType<T, T>
export function refinement<S, T extends S, U extends S>(
    name: string,
    type: IType<S, T>,
    predicate: (snapshot: S) => snapshot is U
): IType<S, U>
/**
 * `types.refinement(baseType, (snapshot) => boolean)` creates a type that is more specific then the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.
 *
 * @export
 * @alias types.refinement
 * @template T
 * @param {string} name
 * @param {IType<T, T>} type
 * @param {(snapshot: T) => boolean} predicate
 * @returns {IType<T, T>}
 */
export function refinement(
    name: string,
    type: IType<any, any>,
    predicate: (snapshot: any) => boolean
): IType<any, any> {
    // ensures all parameters are correct
    if (process.env.NODE_ENV !== "production") {
        if (typeof name !== "string")
            fail("expected a string as first argument, got " + name + " instead")
        if (!isType(type))
            fail("expected a mobx-state-tree type as second argument, got " + type + " instead")
        if (typeof predicate !== "function")
            fail("expected a function as third argument, got " + predicate + " instead")
    }
    return new Refinement(name, type, predicate)
}
