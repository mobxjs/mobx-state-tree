import { isObservableArray } from "mobx"

declare const global: any

export const EMPTY_ARRAY: ReadonlyArray<any> = Object.freeze([])
export const EMPTY_OBJECT: {} = Object.freeze({})

export type IDisposer = () => void

export function fail(message = "Illegal state"): never {
    throw new Error("[mobx-state-tree] " + message)
}

export function identity<T>(_: T): T {
    return _
}

export function nothing(): null {
    return null
}

export function noop() {}

export function isArray(val: any): boolean {
    return !!(Array.isArray(val) || isObservableArray(val)) as boolean
}

export function asArray<T>(val: undefined | null | T | T[]): T[] {
    if (!val) return (EMPTY_ARRAY as any) as T[]
    if (isArray(val)) return val as T[]
    return [val] as T[]
}

export function extend<A, B>(a: A, b: B): A & B
export function extend<A, B, C>(a: A, b: B, c: C): A & B & C
export function extend<A, B, C, D>(a: A, b: B, c: C, d: D): A & B & C & D
export function extend(a: any, ...b: any[]): any
export function extend(a: any, ...b: any[]) {
    for (let i = 0; i < b.length; i++) {
        const current = b[i]
        for (let key in current) a[key] = current[key]
    }
    return a
}

export function extendKeepGetter<A, B>(a: A, b: B): A & B
export function extendKeepGetter<A, B, C>(a: A, b: B, c: C): A & B & C
export function extendKeepGetter<A, B, C, D>(a: A, b: B, c: C, d: D): A & B & C & D
export function extendKeepGetter(a: any, ...b: any[]): any
export function extendKeepGetter(a: any, ...b: any[]) {
    for (let i = 0; i < b.length; i++) {
        const current = b[i]
        for (let key in current) {
            const descriptor = Object.getOwnPropertyDescriptor(current, key)
            if ("get" in descriptor) {
                Object.defineProperty(a, key, { ...descriptor, configurable: true })
                continue
            }
            a[key] = current[key]
        }
    }
    return a
}

export function isPlainObject(value: any) {
    if (value === null || typeof value !== "object") return false
    const proto = Object.getPrototypeOf(value)
    return proto === Object.prototype || proto === null
}

export function isMutable(value: any) {
    return (
        value !== null &&
        typeof value === "object" &&
        !(value instanceof Date) &&
        !(value instanceof RegExp)
    )
}

export function isPrimitive(value: any): boolean {
    if (value === null || value === undefined) return true
    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value instanceof Date
    )
        return true
    return false
}

export function freeze<T>(value: T): T {
    return isPrimitive(value) ? value : Object.freeze(value)
}

export function deepFreeze<T>(value: T): T {
    freeze(value)

    if (isPlainObject(value)) {
        Object.keys(value).forEach(propKey => {
            if (
                !isPrimitive((value as any)[propKey]) &&
                !Object.isFrozen((value as any)[propKey])
            ) {
                deepFreeze((value as any)[propKey])
            }
        })
    }

    return value
}

export function isSerializable(value: any) {
    return typeof value !== "function"
}

export function addHiddenFinalProp(object: any, propName: string, value: any) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value
    })
}

export function addHiddenWritableProp(object: any, propName: string, value: any) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: true,
        configurable: true,
        value
    })
}

export function addReadOnlyProp(object: any, propName: string, value: any) {
    Object.defineProperty(object, propName, {
        enumerable: true,
        writable: false,
        configurable: true,
        value
    })
}

export function remove<T>(collection: T[], item: T) {
    const idx = collection.indexOf(item)
    if (idx !== -1) collection.splice(idx, 1)
}

export function registerEventHandler(handlers: Function[], handler: Function): IDisposer {
    handlers.push(handler)
    return () => {
        remove(handlers, handler)
    }
}

const prototypeHasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwnProperty(object: Object, propName: string) {
    return prototypeHasOwnProperty.call(object, propName)
}

export function argsToArray(args: IArguments): any[] {
    const res = new Array(args.length)
    for (let i = 0; i < args.length; i++) res[i] = args[i]
    return res
}

export type DeprecatedFunction = Function & { ids?: { [id: string]: true } }
let deprecated: DeprecatedFunction = function() {}
deprecated = function(id: string, message: string): void {
    // skip if running production
    if (process.env.NODE_ENV === "production") return
    // warn if hasn't been warned before
    if (deprecated.ids && !deprecated.ids.hasOwnProperty(id)) {
        console.warn("[mobx-state-tree] Deprecation warning: " + message)
    }
    // mark as warned to avoid duplicate warn message
    if (deprecated.ids) deprecated.ids[id] = true
}
deprecated.ids = {}
export { deprecated }
