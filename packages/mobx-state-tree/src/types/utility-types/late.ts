import {
    fail,
    INode,
    Type,
    IType,
    IContext,
    IValidationResult,
    TypeFlags,
    isType
} from "../../internal"

export class Late<S, T> extends Type<S, T> {
    readonly definition: () => IType<S, T>
    private _subType: IType<S, T> | null = null

    get flags() {
        return this.subType.flags | TypeFlags.Late
    }

    get shouldAttachNode() {
        return this.subType.shouldAttachNode
    }

    get subType(): IType<S, T> {
        if (this._subType === null) {
            // If called too early in es5 environment, this won't throw, but return undefined
            // see "it should apply deep patches to maps" test for example
            const definition = this.definition()
            if (typeof definition !== "object")
                fail("Failed to determine subtype, make sure types.late returns a type definition.")
            this._subType = definition
        }
        return this._subType
    }

    constructor(name: string, definition: () => IType<S, T>) {
        super(name)
        this.definition = definition
    }

    instantiate(parent: INode | null, subpath: string, environment: any, snapshot: any): INode {
        return this.subType.instantiate(parent, subpath, environment, snapshot)
    }

    reconcile(current: INode, newValue: any): INode {
        return this.subType.reconcile(current, newValue)
    }

    describe() {
        return this.subType.name
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        return this.subType.validate(value, context)
    }

    isAssignableFrom(type: IType<any, any>) {
        return this.subType.isAssignableFrom(type)
    }
}

export type ILateType<S, T> = () => IType<S, T>

export function late<S = any, T = any>(type: ILateType<S, T>): IType<S, T>
export function late<S = any, T = any>(name: string, type: ILateType<S, T>): IType<S, T>
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
export function late<S, T>(nameOrType: any, maybeType?: ILateType<S, T>): IType<S, T> {
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
    return new Late<S, T>(name, type)
}

export function isLateType(type: any): type is Late<any, any> {
    return isType(type) && (type.flags & TypeFlags.Late) > 0
}
