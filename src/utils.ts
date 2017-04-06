declare const global: any

export type IDisposer = () => void;

export function fail(message = "Illegal state"): never {
    invariant(false, message)
    throw "!"
}

// Optimize: accept () => string as message, so string doesn't have to be prepared at runtime
export function invariant(cond: boolean, message = "Illegal state") {
    if (!cond)
        throw new Error("[mobx-state-tree] " + message)
}

export function identity<T>(_: T): T {
    return _
}

export function nothing(): null {
    return null
}

export function extend<A, B>(a: A, b: B): A & B
export function extend<A, B, C>(a: A, b: B, c: C): A & B & C
export function extend<A, B, C, D>(a: A, b: B, c: C, d: D): A & B & C & D
export function extend(a: any, ...b: any[]): any
export function extend(a: any, ...b: any[]) {
    for (let i = 0; i < b.length; i++) {
        const current = b[i]
        for (let key in current)
            a[key] = current[key]
    }
    return a
}

export function isPlainObject(value: any) {
    if (value === null || typeof value !== "object")
        return false
    const proto = Object.getPrototypeOf(value)
    return proto === Object.prototype || proto === null
}

export function isMutable(value: any) {
    return value !== null && typeof value === "object" && !(value instanceof Date) && !(value instanceof RegExp)
}

export function isPrimitive(value: any): boolean {
    if (value === null || value === undefined)
        return true
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value instanceof Date)
        return true
    return false
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

export function registerEventHandler(handlers: Function[], handler: Function): IDisposer {
    handlers.push(handler)
    return () => {
        const idx = handlers.indexOf(handler)
        if (idx !== -1)
            handlers.splice(idx, 1)
    }
}

const prototypeHasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwnProperty(object: Object, propName: string) {
    return prototypeHasOwnProperty.call(object, propName)
}

export function argsToArray(args: IArguments): any [] {
    const res = new Array(args.length)
    for (let i = 0; i < args.length; i++)
        res[i] = args[i]
    return res
}

export function createNamedFunction(name: string, fn: Function) {
    return new Function("f", `return function ${name}() { return f.apply(this, arguments)}`)(fn)
}

export function isValidIdentifier(identifier: any): boolean {
    if (typeof identifier !== "string")
        return false
    return /^[a-z0-9_-]+$/i.test(identifier)
}
