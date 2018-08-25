import { isObservableArray, $mobx, getAtom } from "mobx"

/** @internal */
declare const global: any

/** @internal */
export const EMPTY_ARRAY: ReadonlyArray<any> = Object.freeze([])
/** @internal */
export const EMPTY_OBJECT: {} = Object.freeze({})

/** @internal */
export const mobxShallow =
    typeof $mobx === "string" ? { deep: false } : { deep: false, proxy: false }
Object.freeze(mobxShallow)

export type IDisposer = () => void

/** @internal */
export function fail(message = "Illegal state"): never {
    throw new Error("[mobx-state-tree] " + message)
}

/** @internal */
export function identity<T>(_: T): T {
    return _
}

/** @internal */
export function nothing(): null {
    return null
}

/** @internal */
export function noop() {}

// pollyfill (for IE) suggested in MDN:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
/** @internal */
export const isInteger =
    Number.isInteger ||
    function(value: any) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value
    }

/** @internal */
export function isArray(val: any): boolean {
    return !!(Array.isArray(val) || isObservableArray(val)) as boolean
}

/** @internal */
export function asArray<T>(val: undefined | null | T | T[] | ReadonlyArray<T>): T[] {
    if (!val) return (EMPTY_ARRAY as any) as T[]
    if (isArray(val)) return val as T[]
    return [val] as T[]
}

/** @internal */
export function extend<A, B>(a: A, b: B): A & B
/** @internal */
export function extend<A, B, C>(a: A, b: B, c: C): A & B & C
/** @internal */
export function extend<A, B, C, D>(a: A, b: B, c: C, d: D): A & B & C & D
/** @internal */
export function extend(a: any, ...b: any[]): any
/** @internal */
export function extend(a: any, ...b: any[]) {
    for (let i = 0; i < b.length; i++) {
        const current = b[i]
        for (let key in current) a[key] = current[key]
    }
    return a
}

/** @internal */
export function extendKeepGetter<A, B>(a: A, b: B): A & B
/** @internal */
export function extendKeepGetter<A, B, C>(a: A, b: B, c: C): A & B & C
/** @internal */
export function extendKeepGetter<A, B, C, D>(a: A, b: B, c: C, d: D): A & B & C & D
/** @internal */
export function extendKeepGetter(a: any, ...b: any[]): any
/** @internal */
export function extendKeepGetter(a: any, ...b: any[]) {
    for (let i = 0; i < b.length; i++) {
        const current = b[i]
        for (let key in current) {
            const descriptor = Object.getOwnPropertyDescriptor(current, key)!
            if ("get" in descriptor) {
                Object.defineProperty(a, key, { ...descriptor, configurable: true })
                continue
            }
            a[key] = current[key]
        }
    }
    return a
}

/** @internal */
export function isPlainObject(value: any) {
    if (value === null || typeof value !== "object") return false
    const proto = Object.getPrototypeOf(value)
    return proto === Object.prototype || proto === null
}

/** @internal */
export function isMutable(value: any) {
    return (
        value !== null &&
        typeof value === "object" &&
        !(value instanceof Date) &&
        !(value instanceof RegExp)
    )
}

/** @internal */
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

/**
 * @internal
 * Freeze a value and return it (if not in production)
 */
export function freeze<T>(value: T): T {
    if (process.env.NODE_ENV === "production") return value
    return isPrimitive(value) || isObservableArray(value) ? value : Object.freeze(value)
}

/**
 * @internal
 * Recursively freeze a value (if not in production)
 */
export function deepFreeze<T>(value: T): T {
    if (process.env.NODE_ENV === "production") return value
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

/** @internal */
export function isSerializable(value: any) {
    return typeof value !== "function"
}

/** @internal */
export function addHiddenFinalProp(object: any, propName: string, value: any) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value
    })
}

/** @internal */
export function addHiddenWritableProp(object: any, propName: string, value: any) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: true,
        configurable: true,
        value
    })
}

/** @internal */
export function addReadOnlyProp(object: any, propName: string, value: any) {
    Object.defineProperty(object, propName, {
        enumerable: true,
        writable: false,
        configurable: true,
        value
    })
}

/** @internal */
export function remove<T>(collection: T[], item: T) {
    const idx = collection.indexOf(item)
    if (idx !== -1) collection.splice(idx, 1)
}

/** @internal */
export function registerEventHandler(handlers: Function[], handler: Function): IDisposer {
    handlers.push(handler)
    return () => {
        remove(handlers, handler)
    }
}

const prototypeHasOwnProperty = Object.prototype.hasOwnProperty
/** @internal */
export function hasOwnProperty(object: Object, propName: string) {
    return prototypeHasOwnProperty.call(object, propName)
}

/** @internal */
export function argsToArray(args: IArguments): any[] {
    const res = new Array(args.length)
    for (let i = 0; i < args.length; i++) res[i] = args[i]
    return res
}

/** @internal */
export function invalidateComputed(target: any, propName: string) {
    const atom = getAtom(target, propName) as any
    atom.trackAndCompute()
}

/** @internal */
export type DeprecatedFunction = Function & { ids?: { [id: string]: true } }
/** @internal */
export const deprecated: DeprecatedFunction = function(id: string, message: string): void {
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
