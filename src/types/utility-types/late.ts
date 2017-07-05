import { fail } from "../../utils"
import { Type, IType } from "../type"
import { TypeFlags } from "../type-flags"
import { IContext, IValidationResult } from "../type-checker"
import { Node } from "../../core"

export class Late<S, T> extends Type<S, T> {
    readonly definition: () => IType<S, T>
    private _subType: IType<S, T> | null = null

    get flags() {
        return this.subType.flags | TypeFlags.Late
    }

    get subType(): IType<S, T> {
        if (this._subType === null) {
            this._subType = this.definition()
        }
        return this._subType
    }

    constructor(name: string, definition: () => IType<S, T>) {
        super(name)
        if (!(typeof definition === "function" && definition.length === 0))
            fail(
                "Invalid late type, expected a function with zero arguments that returns a type, got: " +
                    definition
            )
        this.definition = definition
    }

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: any): Node {
        return this.subType.instantiate(parent, subpath, environment, snapshot)
    }

    reconcile(current: Node, newValue: any): Node {
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
 * Defines a type that gets implemented later. This is usefull when you have to deal with circular dependencies.
 * Please notice that when defining circular dependencies TypeScript is'nt smart enought to inference them.
 * You need to declare an interface to explicit the return type of the late parameter function.
 * 
 * ```typescript
 *  interface INode {
 *       childs: INode[]
 *  }
 *
 *   // TypeScript is'nt smart enough to infer self referencing types.
 *  const Node = types.model({
 *       childs: types.optional(types.array(types.late<any, INode>(() => Node)), [])
 *  })
 * ```
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
    return new Late<S, T>(name, type)
}
