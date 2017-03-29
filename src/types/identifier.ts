export interface IIdentifierDescriptor {
    isIdentifier: true
}

// TODO: properly turn this into a factory, that reuses `types.string`?
// See: https://github.com/mobxjs/mobx-state-tree/pull/65#issuecomment-289603441

export function identifier(): string {
    return {
        isIdentifier: true
    } as IIdentifierDescriptor as any
}

export function isIdentifierFactory(thing: any): thing is IIdentifierDescriptor {
    return typeof thing === "object" && thing && thing.isIdentifier === true
}
