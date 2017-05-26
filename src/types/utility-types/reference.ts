import { IType } from "../type"

export interface IReferenceDescription {
    targetType: IType<any, any>
    basePath: string
    isReference: true
}

// TODO: fix; handle paths deeply to elements with multiple id's in it correctly....
// TODO: fix, references are not mentioned in type.describe...
// TODO: make distinction between nullable and non-nullable refs?
// TODO: verify ref is requird in non-nullable snapshos and vice versa
export function reference<T>(factory: IType<any, T>): IType<{ $ref: string }, T | null>;
export function reference<T>(factory: IType<any, T>, basePath: string): IType<string, T | null>;
export function reference<T>(factory: IType<any, T>, basePath: string = ""): any {
    // FIXME: IType return type is inconsistent with what is actually returned, however, results in the best type-inference results for objects...
    return {
        targetType: factory,
        basePath: basePath,
        isReference: true
    } as IReferenceDescription
}

export function isReferenceFactory(thing: any): thing is IReferenceDescription {
    return thing.isReference === true
}
