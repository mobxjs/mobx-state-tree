import { isObservableArray, $mobx, getAtom } from "mobx"

/**
 * @internal
 * @private
 */
declare const global: any

/**
 * @internal
 * @private
 */
export const EMPTY_ARRAY: ReadonlyArray<any> = Object.freeze([])
/**
 * @internal
 * @private
 */
export const EMPTY_OBJECT: {} = Object.freeze({})

/**
 * @internal
 * @private
 */
export const mobxShallow =
    typeof $mobx === "string" ? { deep: false } : { deep: false, proxy: false }
Object.freeze(mobxShallow)

export type IDisposer = () => void

/**
 * @internal
 * @private
 */
export function fail(message = "Illegal state"): never {
    throw new Error("[mobx-state-tree] " + message)
}

/**
 * @internal
 * @private
 */
export function identity<T>(_: T): T {
    return _
}

/**
 * @internal
 * @private
 */
export function noop() {}

// pollyfill (for IE) suggested in MDN:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
/**
 * @internal
 * @private
 */
export const isInteger =
    Number.isInteger ||
    function(value: any) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value
    }

/**
 * @internal
 * @private
 */
export function isArray(val: any): val is any[] {
    return !!(Array.isArray(val) || isObservableArray(val)) as boolean
}

/**
 * @internal
 * @private
 */
export function asArray<T>(val: undefined | null | T | T[] | ReadonlyArray<T>): T[] {
    if (!val) return (EMPTY_ARRAY as any) as T[]
    if (isArray(val)) return val as T[]
    return [val] as T[]
}

/**
 * @internal
 * @private
 */
export function extend<A, B>(a: A, b: B): A & B
/**
 * @internal
 * @private
 */
export function extend<A, B, C>(a: A, b: B, c: C): A & B & C
/**
 * @internal
 * @private
 */
export function extend<A, B, C, D>(a: A, b: B, c: C, d: D): A & B & C & D
/**
 * @internal
 * @private
 */
export function extend(a: any, ...b: any[]): any
/**
 * @internal
 * @private
 */
export function extend(a: any, ...b: any[]) {
    for (let i = 0; i < b.length; i++) {
        const current = b[i]
        for (let key in current) a[key] = current[key]
    }
    return a
}

/**
 * @internal
 * @private
 */
export function isPlainObject(value: any): value is any {
    if (value === null || typeof value !== "object") return false
    const proto = Object.getPrototypeOf(value)
    return proto === Object.prototype || proto === null
}

/**
 * @internal
 * @private
 */
export function isMutable(value: any) {
    return (
        value !== null &&
        typeof value === "object" &&
        !(value instanceof Date) &&
        !(value instanceof RegExp)
    )
}

/**
 * @internal
 * @private
 */
export function isPrimitive(value: any): value is string | number | boolean | Date {
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
 * @private
 * Freeze a value and return it (if not in production)
 */
export function freeze<T>(value: T): T {
    if (process.env.NODE_ENV === "production") return value
    return isPrimitive(value) || isObservableArray(value) ? value : Object.freeze(value)
}

/**
 * @internal
 * @private
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

/**
 * @internal
 * @private
 */
export function isSerializable(value: any) {
    return typeof value !== "function"
}

/**
 * @internal
 * @private
 */
export function addHiddenFinalProp(object: any, propName: string, value: any) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value
    })
}

/**
 * @internal
 * @private
 */
export function addHiddenWritableProp(object: any, propName: string, value: any) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: true,
        configurable: true,
        value
    })
}

/**
 * @internal
 * @private
 */
export function addReadOnlyProp(object: any, propName: string, value: any) {
    Object.defineProperty(object, propName, {
        enumerable: true,
        writable: false,
        configurable: true,
        value
    })
}

/**
 * @internal
 * @private
 */
export class EventHandler<F extends Function> {
    private handlers?: F[]

    get hasSubscribers() {
        return this.handlers && this.handlers.length > 0
    }

    register(fn: F, atTheBeginning = false): IDisposer {
        if (!this.handlers) {
            this.handlers = []
        }
        if (atTheBeginning) {
            this.handlers.unshift(fn)
        } else {
            this.handlers.push(fn)
        }
        return () => {
            this.unregister(fn)
        }
    }

    private indexOf(fn: F): number {
        if (!this.handlers) {
            return -1
        }
        return this.handlers.indexOf(fn)
    }

    has(fn: F): boolean {
        return this.indexOf(fn) >= 0
    }

    unregister(fn: F) {
        const index = this.indexOf(fn)
        if (index >= 0) {
            this.handlers!.splice(index, 1)
        }
    }

    clear() {
        this.handlers = undefined
    }

    emit(...args: any[]) {
        if (this.handlers) {
            this.handlers.forEach(f => f(...args))
        }
    }
}

const prototypeHasOwnProperty = Object.prototype.hasOwnProperty
/**
 * @internal
 * @private
 */
export function hasOwnProperty(object: Object, propName: string) {
    return prototypeHasOwnProperty.call(object, propName)
}

/**
 * @internal
 * @private
 */
export function argsToArray(args: IArguments): any[] {
    const res = new Array(args.length)
    for (let i = 0; i < args.length; i++) res[i] = args[i]
    return res
}

/**
 * @internal
 * @private
 */
export function invalidateComputed(target: any, propName: string) {
    const atom = getAtom(target, propName) as any
    atom.trackAndCompute()
}

/**
 * @internal
 * @private
 */
export type DeprecatedFunction = Function & { ids?: { [id: string]: true } }
/**
 * @internal
 * @private
 */
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
