import { fail, stringStartsWith } from "../internal"

/**
 * https://tools.ietf.org/html/rfc6902
 * http://jsonpatch.com/
 */
export interface IJsonPatch {
  readonly op: "replace" | "add" | "remove"
  readonly path: string
  readonly value?: any
}

export interface IReversibleJsonPatch extends IJsonPatch {
  readonly oldValue: any // This goes beyond JSON-patch, but makes sure each patch can be inverse applied
}

/**
 * @internal
 * @hidden
 */
export function splitPatch(patch: IReversibleJsonPatch): [IJsonPatch, IJsonPatch] {
  if (!("oldValue" in patch)) throw fail(`Patches without \`oldValue\` field cannot be inversed`)
  return [stripPatch(patch), invertPatch(patch)]
}

/**
 * @internal
 * @hidden
 */
export function stripPatch(patch: IReversibleJsonPatch): IJsonPatch {
  // strips `oldvalue` information from the patch, so that it becomes a patch conform the json-patch spec
  // this removes the ability to undo the patch
  switch (patch.op) {
    case "add":
      return { op: "add", path: patch.path, value: patch.value }
    case "remove":
      return { op: "remove", path: patch.path }
    case "replace":
      return { op: "replace", path: patch.path, value: patch.value }
  }
}

function invertPatch(patch: IReversibleJsonPatch): IJsonPatch {
  switch (patch.op) {
    case "add":
      return {
        op: "remove",
        path: patch.path
      }
    case "remove":
      return {
        op: "add",
        path: patch.path,
        value: patch.oldValue
      }
    case "replace":
      return {
        op: "replace",
        path: patch.path,
        value: patch.oldValue
      }
  }
}

/**
 * Simple simple check to check it is a number.
 */
function isNumber(x: string): boolean {
  return typeof x === "number"
}

/**
 * Escape slashes and backslashes.
 *
 * http://tools.ietf.org/html/rfc6901
 */
export function escapeJsonPath(path: string): string {
  if (isNumber(path) === true) {
    return "" + path
  }
  if (path.indexOf("/") === -1 && path.indexOf("~") === -1) return path
  return path.replace(/~/g, "~0").replace(/\//g, "~1")
}

/**
 * Unescape slashes and backslashes.
 */
export function unescapeJsonPath(path: string): string {
  return path.replace(/~1/g, "/").replace(/~0/g, "~")
}

/**
 * Generates a json-path compliant json path from path parts.
 *
 * @param path
 * @returns
 */
export function joinJsonPath(path: string[]): string {
  // `/` refers to property with an empty name, while `` refers to root itself!
  if (path.length === 0) return ""

  const getPathStr = (p: string[]) => p.map(escapeJsonPath).join("/")
  if (path[0] === "." || path[0] === "..") {
    // relative
    return getPathStr(path)
  } else {
    // absolute
    return "/" + getPathStr(path)
  }
}

/**
 * Splits and decodes a json path into several parts.
 *
 * @param path
 * @returns
 */
export function splitJsonPath(path: string): string[] {
  // `/` refers to property with an empty name, while `` refers to root itself!
  const parts = path.split("/").map(unescapeJsonPath)

  const valid =
    path === "" ||
    path === "." ||
    path === ".." ||
    stringStartsWith(path, "/") ||
    stringStartsWith(path, "./") ||
    stringStartsWith(path, "../")
  if (!valid) {
    throw fail(`a json path must be either rooted, empty or relative, but got '${path}'`)
  }

  // '/a/b/c' -> ["a", "b", "c"]
  // '../../b/c' -> ["..", "..", "b", "c"]
  // '' -> []
  // '/' -> ['']
  // './a' -> [".", "a"]
  // /./a' -> [".", "a"] equivalent to './a'

  if (parts[0] === "") {
    parts.shift()
  }
  return parts
}
