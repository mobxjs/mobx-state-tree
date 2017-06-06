import { IType, TypeFlags, Type } from "../type"
import { fail } from "../../utils"
import { isStateTreeNode, getStateTreeNode, Node } from "../../core"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure } from "../type-checker"

export class Refinement extends Type<any, any> {
    readonly type: IType<any, any>
    readonly predicate: (v: any) => boolean

    get flags () {
        return this.type.flags
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
        if (this.type.is(value)) {
            const snapshot = isStateTreeNode(value) ? getStateTreeNode(value).snapshot : value

            if (this.predicate(snapshot)) {
                return typeCheckSuccess()
            }
        }
        return typeCheckFailure(context, value)
    }
}

export function refinement<T>(name: string, type: IType<T, T>, predicate: (snapshot: T) => boolean): IType<T, T>
export function refinement<S, T extends S, U extends S>(name: string, type: IType<S, T>, predicate: (snapshot: S) => snapshot is U): IType<S, U>
export function refinement(name: string, type: IType<any, any>, predicate: (snapshot: any) => boolean): IType<any, any> {
    // check if the subtype default value passes the predicate
    const inst = type.create()
    if (!predicate(isStateTreeNode(inst) ? getStateTreeNode(inst).snapshot : inst)) fail(`Default value for refinement type ` + name + ` does not pass the predicate.`)

    return new Refinement(name, type, predicate)
}
