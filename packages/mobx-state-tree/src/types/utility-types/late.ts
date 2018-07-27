import {
    fail,
    INode,
    Type,
    IContext,
    IValidationResult,
    TypeFlags,
    isType,
    IAnyType,
    typeCheckSuccess
} from "../../internal"

export class Late<C, S, T> extends Type<C, S, T> {
    readonly definition: () => IAnyType
    private _subType: IAnyType | null = null

    get flags() {
        return (this._subType ? this._subType.flags : 0) | TypeFlags.Late
    }

    get shouldAttachNode() {
        return this.getSubType(true).shouldAttachNode
    }

    getSubType(mustSucceed: true): IAnyType
    getSubType(mustSucceed: false): IAnyType | null
    getSubType(mustSucceed: boolean): IAnyType | null {
        if (this._subType === null) {
            let t = undefined
            try {
                t = this.definition()
            } catch (e) {
                if (e instanceof ReferenceError)
                    // can happen in strict ES5 code when a definition is self refering
                    t = undefined
                else throw e
            }
            if (mustSucceed && t === undefined)
                fail(
                    "Late type seems to be used too early, the definition (still) returns undefined"
                )
            if (t) {
                if (process.env.NODE_ENV !== "production" && !isType(t))
                    fail(
                        "Failed to determine subtype, make sure types.late returns a type definition."
                    )
                this._subType = t
                return t
            }
        }
        return this._subType
    }
    constructor(name: string, definition: () => IAnyType) {
        super(name)
        this.definition = definition
    }

    instantiate(parent: INode | null, subpath: string, environment: any, snapshot: any): INode {
        return this.getSubType(true).instantiate(parent, subpath, environment, snapshot)
    }

    reconcile(current: INode, newValue: any): INode {
        return this.getSubType(true).reconcile(current, newValue)
    }

    describe() {
        const t = this.getSubType(false)
        return t ? t.name : "<uknown late type>"
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        const t = this.getSubType(false)
        if (!t) {
            // See #916; the variable the definition closure is pointing to wasn't defined yet, so can't be evaluted yet here
            return typeCheckSuccess()
        }
        return t.validate(value, context)
    }

    isAssignableFrom(type: IAnyType) {
        const t = this.getSubType(false)
        return t ? t.isAssignableFrom(type) : false
    }
}

export function late<T extends IAnyType>(type: () => T): T
export function late<T extends IAnyType>(name: string, type: () => T): T
/**
 * Defines a type that gets implemented later. This is useful when you have to deal with circular dependencies.
 * Please notice that when defining circular dependencies TypeScript isn't smart enough to inference them.
 * You need to declare an interface to explicit the return type of the late parameter function.
 *
 * @example
 *  interface INode {
 *       childs: INode[]
 *  }
 *
 *   // TypeScript is'nt smart enough to infer self referencing types.
 *  const Node = types.model({
 *       childs: types.optional(types.array(types.late<any, INode>(() => Node)), [])
 *  })
 *
 * @export
 * @alias types.late
 * @template S
 * @template T
 * @param {string} [name] The name to use for the type that will be returned.
 * @param {ILateType<S, T>} type A function that returns the type that will be defined.
 * @returns {IType<S, T>}
 */
export function late(nameOrType: any, maybeType?: () => IAnyType): IAnyType {
    const name = typeof nameOrType === "string" ? nameOrType : `late(${nameOrType.toString()})`
    const type = typeof nameOrType === "string" ? maybeType : nameOrType
    // checks that the type is actually a late type
    if (process.env.NODE_ENV !== "production") {
        if (!(typeof type === "function" && type.length === 0))
            fail(
                "Invalid late type, expected a function with zero arguments that returns a type, got: " +
                    type
            )
    }
    return new Late(name, type)
}

export function isLateType<IT extends IAnyType>(type: IT): type is IT {
    return isType(type) && (type.flags & TypeFlags.Late) > 0
}
