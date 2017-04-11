import { isObservableArray, isObservableMap } from "mobx"
import { resolve, getMSTAdministration, getRelativePath, isMST, IMSTNode } from "../../core"
import { invariant, fail } from "../../utils"
import { getIdentifierAttribute } from "../complex-types/object"
import { IType, typecheck } from "../type"

export interface IReference {
    $ref: string
}

export interface IReferenceDescription {
    getter: (value: any) => any
    setter: (value: any) => any
    isReference: true
}

// TODO: fix, references are not mentioned in type.describe...
// TODO: make distinction between nullable and non-nullable refs?
// TODO: verify ref is requird in non-nullable snapshos and vice versa
export function reference<T>(factory: IType<any, T>): IType<{ $ref: string }, T | null>;
export function reference<T>(factory: IType<any, T>, basePath: string): IType<string, T | null>;
export function reference<T>(factory: IType<any, T>, basePath?: string): any {
    // FIXME: IType return type is inconsistent with what is actually returned, however, results in the best type-inference results for objects...
    if (arguments.length === 1)
        return createGenericRelativeReference(factory) as any
    else
        return createReferenceWithBasePath(factory, basePath!) as any
}

function createGenericRelativeReference(factory: IType<any, any>): IReferenceDescription {
    return {
        isReference: true,
        getter: function (this: IMSTNode, identifier: IReference | null | undefined): any {
            if (identifier === null || identifier === undefined)
                return null
            // TODO: would be better to test as part of snapshot...
            invariant(typeof identifier.$ref === "string", "Expected a reference in the format `{ $ref: ... }`")
            return resolve(this, identifier.$ref)
        },
        setter: function(this: IMSTNode, value: IMSTNode): IReference {
            if (value === null || value === undefined)
                return value
            invariant(isMST(value), `Failed to assign a value to a reference; the value is not a model instance`)
            typecheck(factory, value)
            const base = getMSTAdministration(this)
            const target = getMSTAdministration(value)
            invariant(base.root === target.root, `Failed to assign a value to a reference; the value should already be part of the same model tree`)
            return { $ref: getRelativePath(base, target) }
        }
    }
}

function createReferenceWithBasePath(type: IType<any, any>, path: string): IReferenceDescription {
    const targetIdAttribute = getIdentifierAttribute(type)
    if (!targetIdAttribute)
        return fail(`Cannot create reference to path '${path}'; the targetted type, ${type.describe()}, does not specify an identifier property`)

    return {
        isReference: true,
        getter: function (this: IMSTNode, identifier: string | null | undefined): any {
            if (identifier === null || identifier === undefined)
                return identifier
            const targetCollection = resolve(this, `${path}`)
            if (isObservableArray(targetCollection)) {
                return targetCollection.find(item => item && item[targetIdAttribute] === identifier)
            } else if (isObservableMap(targetCollection)) {
                const child = targetCollection.get(identifier)
                invariant(!child || child[targetIdAttribute] === identifier, `Inconsistent collection, the map entry under key '${identifier}' should have property '${targetIdAttribute}' set to value '${identifier}`)
                return child
            } else
                return fail("References with base paths should point to either an `array` or `map` collection")
        },
        setter: function(this: IMSTNode, value: IMSTNode): string {
            if (value === null || value === undefined)
                return value
            invariant(isMST(value), `Failed to assign a value to a reference; the value is not a model instance`)
            invariant(type.is(value), `Failed to assign a value to a reference; the value is not a model of type ${type}`)
            const base = getMSTAdministration(this)
            const target = getMSTAdministration(value)
            invariant(base.root === target.root, `Failed to assign a value to a reference; the value should already be part of the same model tree`)
            const identifier = (value as any)[targetIdAttribute]
            const targetCollection = resolve(this, `${path}`)
            if (isObservableArray(targetCollection)) {
                invariant(targetCollection.indexOf(value) !== -1, `The assigned value is not part of the collection the reference resolves to`)
            } else if (isObservableMap(targetCollection)) {
                invariant(targetCollection.get(identifier) === value, `The assigned value was not found in the collection the reference resolves to, under key '${identifier}'`)
            } else
                return fail("References with base paths should point to either an `array` or `map` collection")
            return identifier
        }
    }
}

export function isReferenceFactory(thing: any): thing is IReferenceDescription {
    return thing.isReference === true
}
