export interface IIdentifierDescriptor {
    isIdentifier: true
}

export function identifier(): string {
    return {
        isIdentifier: true
    } as IIdentifierDescriptor as any
}

export function isIdentifierFactory(thing: any): thing is IIdentifierDescriptor {
    return typeof thing === "object" && thing && thing.isIdentifier === true
}
