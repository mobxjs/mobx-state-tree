declare const global: any;

export type IDisposer = () => void;

export function fail(message = "Illegal state"): never {
    return invariant(false, message)
}

export function invariant(cond: boolean, message = "Illegal state") {
    if (!cond)
        throw new Error("[mobx-state-tree] " + message);
}

export function isPlainObject(value) {
    if (value === null || typeof value !== "object")
        return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}

export function isMutable(value) {
    return value !== null && typeof value === "object"
}

export function isSerializable(value) {
    return typeof value !== "function"
}

/**
 * escape slashes and backslashes
 */
export function escapeString(str: string) {
    return str.replace(/\\/g, "\\\\").replace(/\//g, "\\\/")
}

/**
 * unescape slashes and backslashes
 */
export function unescapeString(str: string) {
    return str.replace(/\\\//g, "//").replace(/\\\\/g, "\\")
}

export function addHiddenFinalProp(object: any, propName: string, value: any) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value
    })
}

export function registerEventHandler(handlers: [], handler): IDisposer {
    handlers.push(handler)
    return () => {
        const idx = handlers.indexOf(handler)
        if (idx !== -1)
            handlers.splice(idx, 1)
    }
}
