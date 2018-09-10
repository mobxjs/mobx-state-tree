import { IComplexType, late, IAnyModelType } from "../../internal"

// these two types are fake and only for typings
export interface SelfTypeC {
    readonly $typeRef: "self"
}

export interface SelfType extends IComplexType<SelfTypeC, SelfTypeC, SelfTypeC> {}

/**
 * `types.self` can be used as a syntatic sugar for this very same model.
 * This is especially useful when using TypeScript, since it will
 * be able to infer the typings appropiately.
 *
 * There are some constraints though:
 * The first one is that it will only be able to infer properly the type up to 10 levels deep.
 * The second one is that while it can be used inside arrays, maps, maybe and maybeNull,
 * other usages most probably won't be able to infer a proper type (e.g. optional, union, etc.)
 *
 * @export
 * @alias types.self
 */
export const selfType = (t: () => IAnyModelType): SelfType => {
    return late(t)
}
