import {
    batch,
    isObservable,
    observable as legendObservable,
    computed as legendComputed,
    observe as legendObserve,
    mergeIntoObservable,
    ObservableArray
} from "@legendapp/state"
import { CreateObservableOptions } from "mobx"

/**
 * This file exports a compatability layer for MobX to
 * Legend State. That is, it has a MobX API but uses
 * Legend State under the hood.
 */

// export function isObservable(thing: any): boolean {
//     // Need to figure out how to do this in Legend State
//     return !!thing
// }

const DEBUG = true
const log = (msg: string) => {
    if (DEBUG) console.log(msg)
}

/**
 * Really just a fake version of an atom that doesn't do much except console logs
 */
export function createAtom(name: string): any {
    return {
        reportChanged() {
            // no-op for now
            log(`Atom ${name} changed`)
        },
        reportObserved() {
            // no-op for now
            log(`Atom ${name} observed`)
        }
    }
}

export function isObservableObject(obj: any) {
    return isObservable(obj)
}

export function isObservableArray(arr: any) {
    return isObservable(arr) && Array.isArray(arr.peek())
}

export function mobxDefineProperty(obj: any, prop: string | number | symbol, value: any) {
    obj[prop].set(value)
}

// This feels inadequate
// https://github.com/mobxjs/mobx/blob/fe25cfede0aee3bddd7fa434a14ed4b40a57ee26/packages/mobx/src/api/object-api.ts#L36-L54
export function values(obj: any) {
    // if obj is an array
    if (Array.isArray(obj.peek())) {
        return obj.peek()
    }

    // if obj is an object
    if (typeof obj.peek() === "object") {
        return Object.values(obj)
    }

    throw new Error(`Don't know what to do with ${obj} in values() compat function, legend-mobx.ts`)
}

// This feels inadequate
// https://github.com/mobxjs/mobx/blob/fe25cfede0aee3bddd7fa434a14ed4b40a57ee26/packages/mobx/src/api/object-api.ts#L56-L76
export function entries(obj: any) {
    if (isObservableArray(obj)) {
        return (obj.peek() as Array<any>).map((key, index) => [index, key])
    }
    if (isObservableObject(obj)) {
        return Object.keys(obj.peek()).map((key) => [key, obj[key]])
    }

    throw new Error(
        `Don't know what to do with ${obj} in entries() compat function, legend-mobx.ts`
    )
}

export function mobxAction(fn: Function) {
    return (...args: any) => batch(() => fn(...args))
}
export const action = mobxAction

// Add a fake `observable` object ... Legend State doesn't care what you give it
// @ts-ignore
export const observable = {
    object: legendObservable,
    // @ts-ignore
    array: <T, _>(value?: T | Promise<T>, _: any = undefined) => legendObservable(value || {}),
    // @ts-ignore
    map: <T, _>(value?: T | Promise<T>, _: any = undefined) => legendObservable(value || []),
    ref: {
        enhancer: () => {
            throw new Error("observable.ref is not implemented in Legend State")
        }
    }
}

export function computed<T = any>(fn: () => unknown): any {
    return legendComputed(fn).get()
}

// replace with actual reaction from Legend State when it's released
export function reaction<Value>(
    observeFn: () => Value,
    callback: (value: Value, previousValue: Value, reaction: any) => any,
    options: any
) {
    let prevValue: Value
    return legendObserve((e) => {
        const value = observeFn()

        // don't observe this, eventually
        callback(value, prevValue, { dispose: () => {} })
    })
}

export function isComputedProp(obj: any, key: string) {
    log("isComputedProp isn't implemented yet")
    return false
    // throw new Error("isComputedProp is not implemented in Legend State yet")
}

export function isObservableProp(obj: any, key: string) {
    return isObservable(obj[key])
}

export function runInAction(fn: Function) {
    return mobxAction(() => fn())()
}

export function intercept(obj: any, key: string, handler: any) {
    throw new Error("intercept is not implemented in Legend State yet")
}

export function observe(obj: any, callback: Function) {
    obj.onChange(callback)
}

export function defineProperty(obj: any, key: string, _descriptor: any) {
    obj[key].set(undefined) // I guess?
}

export function getAtom(obj: any) {
    // not really implemented...I guess?
    throw new Error("getAtom is not implemented in Legend State yet")
}

export function set(obj: any, keyOrObj: any, valueOrUndefined: any = undefined) {
    if (typeof keyOrObj === "string" && valueOrUndefined !== undefined) {
        obj[keyOrObj].set(valueOrUndefined)
    } else {
        mergeIntoObservable(obj, keyOrObj)
    }
}

export function makeObservable<T>(target: T, annotations?: any, options?: CreateObservableOptions) {
    return legendObservable(target)
}
