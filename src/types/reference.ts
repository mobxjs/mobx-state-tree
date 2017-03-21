// TODO: move file to better place, not really a type

import {IModel, IFactory, isFactory, isModel} from "../core/factories"
import {resolve} from "../top-level-api"
import {invariant, fail} from "../utils"
import { getNode, getRelativePath } from "../core/node"

export interface IReferenceDescription {
    getter: (value: any) => any
    setter: (value: any) => any
    isReference: true
}

// export function reference<T>(path: string): T;
// export function reference<T>(getter: IReferenceGetter<T>, setter?: IReferenceSetter<T>): T;
export function reference<T>(factory: IFactory<any, T>): T;
export function reference(arg1, arg2?) {
    if (isFactory(arg1))
        return createGenericRelativeReference(arg1)
    throw "TODO"
    // if (typeof arg1 === "string")
    //     return createRelativeReferenceTo(arg1)
    // return {
    //     isReference: true,
    //     getter: arg1,
    //     setter: arg2 || unwritableReference
    // } as IReferenceDescription
}

// function createRelativeReferenceTo(path: string) {
//     // TODO: remove this option?
//     const targetIdAttribute = path.split("/").slice(-1)[0]
//     path = path.split("/").slice(0, -1).join("/")
//     return reference(
//         (identifier: string, owner: IModel) => resolve(owner, `${path}/${identifier}`),
//         (value: any, owner: IModel, name)   => {
//             invariant(!value || (getNode(value).root === getNode(owner).root), `The value assigned to the reference '${name}' should already be part of the same model tree`)
//             return value[targetIdAttribute]
//         }
//     )
// }

// function createGenericRelativeReference(factory: IFactory<any, any>) {
//     // TODO: store as {$ref: "..."} instead of just the string
//     return reference(
//         (identifier: string, owner: IModel) => {
//             if (identifier === null || identifier === undefined)
//                 return identifier
//             return resolve(owner, identifier)
//         },
//         (value: any, owner: IModel, name) => {
//             if (value === null || value === undefined)
//                 return value
//             invariant(isModel(value), `The value assigned to the reference '${name}' is not a model instance`)
//             invariant(factory.is(value), `The value assigned to the reference '${name}' is not a model of type ${factory}`)
//             const base = getNode(owner)
//             const target = getNode(value)
//             invariant(base.root === target.root, `The value assigned to the reference '${name}' should already be part of the same model tree`)
//             return getRelativePath(base, target)
//         }
//     )
// }

function createGenericRelativeReference(factory: IFactory<any, any>): IReferenceDescription {
    // TODO: store as {$ref: "..."} instead of just the string
    return {
        isReference: true,
        getter: function (this: IModel, identifier: string | null | undefined): any {
            if (identifier === null || identifier === undefined)
                return identifier
            return resolve(this, identifier)
        },
        setter: function(this: IModel, value: IModel): string {
            if (value === null || value === undefined)
                return value
            invariant(isModel(value), `Failed to assign a value to a reference; the value is not a model instance`)
            invariant(factory.is(value), `Failed to assign a value to a reference; the value is not a model of type ${factory}`)
            const base = getNode(this)
            const target = getNode(value)
            invariant(base.root === target.root, `Failed to assign a value to a reference; the value should already be part of the same model tree`)
            return getRelativePath(base, target)
        }
    }
}


// export function createReferenceProps(name: string, ref: IReferenceDescription) {
//     const sourceIdAttribute = `${name}_id`
//     const res = {
//         [sourceIdAttribute]: "" // the raw attribute value
//     }
//     Object.defineProperty(res, name, {
//         get: function() {
//             // Optimization: reuse closures based on the same name or configuration
//             const id = this[sourceIdAttribute]
//             return id ? ref.getter(id, this, name) : null
//         },
//         set: function(v) {
//             invariant(getNode(this).isRunningAction(), `Reference '${name}' can only be modified from within an action`)
//             this[sourceIdAttribute] = v ? ref.setter(v, this, name) : ""
//         },
//         enumerable: true
//     })
//     return res
// }

// function unwritableReference(_, owner, propertyName) {
//     return fail(`Cannot assign a new value to the reference '${propertyName}', the reference is read-only`)
// }

export function isReferenceFactory(thing): thing is IReferenceDescription {
    return thing.isReference === true
}
