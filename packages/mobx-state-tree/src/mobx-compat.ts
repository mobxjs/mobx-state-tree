import {
    extendObservable,
    observable,
    _getAdministration as getAdministration,
    _interceptReads as interceptReads,
    reaction as mobxReaction,
    onReactionError,
    configure,
    isObservable as mobxIsObservable,
    isComputed as mobxIsComputed,
    IObservable,
    IObservableValue,
    extendShallowObservable as mobxExtendShallowObservable
} from "mobx"

// scoped options
// const SHALLOW_OPTIONS = Object.freeze({ deep: false })

export function extendShallowObservable(target, props) {
    // does not do what it says in the error log
    // return extendObservable(target, props, SHALLOW_OPTIONS)
    return mobxExtendShallowObservable(target, props)
}

// @rollup @warning 'configure' is imported from external module 'mobx' but never used
export function useStrict(should: boolean): void {
    configure({ enforceActions: should })
}

export function shallowObject(values: Object) {
    // does not do what it says in the error log
    // [mobx] Deprecated: 'observable.shallowObject', use 'observable.object(values, {}, { deep: false })' instead.
    // return observable.object(values, {}, SHALLOW_OPTIONS)
    // return observable.object(values, {}, { deep: false })
    return observable.shallowObject.apply(observable.shallowObject, arguments)
}

export function shallowArray(values: Array<any>) {
    // return observable.array(values, SHALLOW_OPTIONS)
    return observable.array(values, { deep: false })
}

// @todo temporary, can import utils, but this is dependency free
function isPrimitive(node: any): boolean {
    return (
        node === undefined ||
        node === null ||
        typeof node === "string" ||
        typeof node === "number" ||
        typeof node === "boolean"
    )
}
function compatObservable(
    arg1?: any,
    options?: any,
    arg3?: any
): IObservable | IObservableValue<any> {
    if (isPrimitive(arg1) === true) {
        if (arguments.length === 2) {
            return observable.box(arg1, options)
        } else {
            return observable.box(arg1)
        }
    } else {
        return observable.apply(observable, arguments)
    }
}

export function isComputed(target: Object, key: string): boolean {
    const descriptor = Object.getOwnPropertyDescriptor(target, key)
    if (descriptor === undefined) {
        return false
    }
    const is = mobxIsComputed(descriptor.get) || mobxIsComputed(descriptor.value)
    return is
}

export function isObservable(target: Object, key: string): boolean {
    const descriptor = Object.getOwnPropertyDescriptor(target, key)
    if (descriptor === undefined) {
        return false
    }
    const is = mobxIsObservable(descriptor.get) || mobxIsObservable(descriptor.value)
    // console.log({ descriptor, is })
    return is
}

Object.assign(compatObservable, observable)
compatObservable.shallowArray = shallowArray
compatObservable.shallowObject = shallowObject
compatObservable.isObservable = isObservable
compatObservable.isComputed = isComputed
compatObservable.extendShallowObservable = extendShallowObservable
compatObservable.extendObservable = extendObservable

export { observable, interceptReads, getAdministration, mobxReaction as reaction }

// export function reaction() {
//     const reactable = mobxReaction.apply(mobxReaction, arguments)
//     reactable.onError = onReactionError
//     return reactable
// }
// could do any of these as well
// compatObservable as observable,
// export const extras = {
//     getAdministration,
// }
// export default compatObservable
// map.keys().forEach => keys(map.keys())
// map.values() ^
