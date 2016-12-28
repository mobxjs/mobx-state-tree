import {tryResolve, getRoot} from "../index"
import {invariant, fail} from "../utils"
import {getObjectNode} from "./object-node"

export type IReferenceGetter = (identifier: string, owner: Object, propertyName: string) => any
export type IReferenceSetter = (value: any, owner: Object, propertyName: string) => string

export interface IReferenceDescription {
    getter: IReferenceGetter
    setter: IReferenceSetter
    isReferenceTo: true
}

// TODO: future work: create factories for reference lists and maps!
export function referenceTo<T>(path: string): T;
export function referenceTo<T>(getter: IReferenceGetter, setter?: IReferenceSetter): T;
export function referenceTo(arg1, arg2?) {
    if (typeof arg1 === "string")
        return createRelativeReferenceTo(arg1)
    return {
        isReferenceTo: true,
        getter: arg1,
        setter: arg2 || unwritableReference
    } as IReferenceDescription
}

function createRelativeReferenceTo(path: string) {
    const targetIdAttribute = path.split("/").slice(-1)[0]
    path = path.split("/").slice(0, -1).join("/")
    return referenceTo(
        (identifier: string, owner: Object) => tryResolve(owner, `${path}/${identifier}`),
        (value: any)                        => value[targetIdAttribute]
    )
}

export function createReferenceProps(name: string, ref: IReferenceDescription) {
    const sourceIdAttribute = `${name}_id`
    const res = {
        [sourceIdAttribute]: "" // the raw attribute value
    }
    Object.defineProperty(res, name, {
        get: function() {
            // Optimization: reuse closures based on the same name or configuration
            const id = this[sourceIdAttribute]
            return id ? ref.getter(id, this, name) : null
        },
        set: function(v) {
            invariant(getObjectNode(this).isRunningAction(), `Reference '${name}' can only be modified from within an action`)
            invariant(!v || (getRoot(v) === getRoot(this)), `The value assigned to the reference '${name}' should already be part of the same model tree`)
            this[sourceIdAttribute] = v ? ref.setter(v, this, name) : ""
        },
        enumerable: true
    })
    return res
}

function unwritableReference(_, owner, propertyName) {
    return fail(`Cannot assign a new value to the reference '${propertyName}', the reference is read-only`)
}

export function isReferenceFactory(thing) {
    return thing.isReferenceTo === true
}
