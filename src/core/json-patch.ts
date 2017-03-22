// TODO: move file to utils
import {invariant} from "../utils"

// https://tools.ietf.org/html/rfc6902
// http://jsonpatch.com/

export interface IJsonPatch {
    op: "replace" | "add" | "remove"
    path: string
    value?: any
}


/**
 * escape slashes and backslashes
 * http://tools.ietf.org/html/rfc6901
 */
export function escapeJsonPath(str: string) {
    return str.replace(/~/g, "~1").replace(/\//g, "~0")
}

/**
 * unescape slashes and backslashes
 */
export function unescapeJsonPath(str: string) {
    return str.replace(/~0/g, "\\").replace(/~1/g, "~")
}

export function joinJsonPath(path: string[]): string {
    // `/` refers to property with an empty name, while `` refers to root itself!
    if (path.length === 0)
        return ""
    return path.map(escapeJsonPath).join("/")
}

export function splitJsonPath(path: string): string[] {
    // `/` refers to property with an empty name, while `` refers to root itself!
    if (path === "")
        return []
    return path.split("/").map(unescapeJsonPath)
}
