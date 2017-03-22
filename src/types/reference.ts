import {isObservableArray, isObservableMap} from "mobx"
import {IModel, IFactory, isFactory, isModel} from "../core/factories"
import {resolve} from "../top-level-api"
import {invariant, fail} from "../utils"
import { getNode, getRelativePath } from "../core/node"

export interface IReference {
    $ref: string
}

export interface IReferenceDescription {
    getter: (value: any) => any
    setter: (value: any) => any
    isReference: true
}

export function reference<T>(factory: IFactory<any, T>, basePath?: string): T {
    if (arguments.length === 1)
        return createGenericRelativeReference(factory) as any
    else
        return createReferenceWithBasePath(factory, basePath!) as any
}

function createGenericRelativeReference(factory: IFactory<any, any>): IReferenceDescription {
    return {
        isReference: true,
        getter: function (this: IModel, identifier: IReference | null | undefined): any {
            if (identifier === null || identifier === undefined)
                return identifier
            // TODO: would be better to test as part of snapshot...
            invariant(typeof identifier.$ref === "string", "Expected a reference in the format `{ $ref: ... }`")
            return resolve(this, identifier.$ref)
        },
        setter: function(this: IModel, value: IModel): IReference {
            if (value === null || value === undefined)
                return value
            invariant(isModel(value), `Failed to assign a value to a reference; the value is not a model instance`)
            invariant(factory.is(value), `Failed to assign a value to a reference; the value is not a model of type ${factory}`)
            const base = getNode(this)
            const target = getNode(value)
            invariant(base.root === target.root, `Failed to assign a value to a reference; the value should already be part of the same model tree`)
            return { $ref: getRelativePath(base, target) }
        }
    }
}

function createReferenceWithBasePath(factory: IFactory<any, any>, path: string): IReferenceDescription {
    const targetIdAttribute = path.split("/").slice(-1)[0]
    path = path.split("/").slice(0, -1).join("/")

    return {
        isReference: true,
        getter: function (this: IModel, identifier: string | null | undefined): any {
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
        setter: function(this: IModel, value: IModel): string {
            if (value === null || value === undefined)
                return value
            invariant(isModel(value), `Failed to assign a value to a reference; the value is not a model instance`)
            invariant(factory.is(value), `Failed to assign a value to a reference; the value is not a model of type ${factory}`)
            const base = getNode(this)
            const target = getNode(value)
            invariant(base.root === target.root, `Failed to assign a value to a reference; the value should already be part of the same model tree`)
            const identifier = value[targetIdAttribute]
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

export function isReferenceFactory(thing): thing is IReferenceDescription {
    return thing.isReference === true
}
