declare const global: any;

export type IDisposer = () => void;

export function fail(message = "Illegal state"): never {
    invariant(false, message)
    throw "!"
}

export function invariant(cond: boolean, message = "Illegal state") {
    if (!cond)
        throw new Error("[mobx-state-tree] " + message);
}

export function extend(a, ...b: any[]) {
    for (let i = 0; i < b.length; i++) {
        const current = b[i]
        for (let key in current)
            a[key] = current[key]
    }
    return a
}

export function isPlainObject(value) {
    if (value === null || typeof value !== "object")
        return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}

export function isMutable(value) {
    // TODO: not, date, regex, ..what more?
    return value !== null && typeof value === "object"
}

export function isSerializable(value) {
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

export function registerEventHandler(handlers: Function[], handler: Function): IDisposer {
    handlers.push(handler)
    return () => {
        const idx = handlers.indexOf(handler)
        if (idx !== -1)
            handlers.splice(idx, 1)
    }
}
