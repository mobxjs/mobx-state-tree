import * as mst from "../../src"
import { readFileSync } from "fs"

const METHODS = [
    "addDisposer",
    "addMiddleware",
    "applyAction",
    "applyPatch",
    "applySnapshot",
    "createActionTrackingMiddleware",
    "clone",
    "decorate",
    "destroy",
    "detach",
    "escapeJsonPath",
    "flow",
    "getChildType",
    "getEnv",
    "getParent",
    "getParentOfType",
    "getPath",
    "getPathParts",
    "getRelativePath",
    "getRoot",
    "getIdentifier",
    "getSnapshot",
    "getType",
    "hasParent",
    "hasParentOfType",
    "isAlive",
    "isProtected",
    "isRoot",
    "isStateTreeNode",
    "joinJsonPath",
    "onAction",
    "onPatch",
    "onSnapshot",
    "process",
    "protect",
    "recordActions",
    "recordPatches",
    "resolveIdentifier",
    "resolvePath",
    "setLivelynessChecking",
    "splitJsonPath",
    "tryResolve",
    "typecheck",
    "types",
    "unescapeJsonPath",
    "unprotect",
    "walk",
    "getMembers",
    "cast"
]
const TYPES = [
    "Date",
    "array",
    "boolean",
    "compose",
    "custom",
    "frozen",
    "identifier",
    "identifierNumber",
    "late",
    "literal",
    "map",
    "maybe",
    "maybeNull",
    "model",
    "null",
    "number",
    "integer",
    "optional",
    "reference",
    "refinement",
    "string",
    "undefined",
    "union",
    "enumeration"
]
const INTERNAL_TYPES = ["TypeFlags"]

test("correct api exposed", () => {
    expect(
        Object.keys(mst)
            .sort()
            .filter(key => (mst as any)[key] !== undefined) // filter out interfaces
    ).toEqual([...METHODS, ...INTERNAL_TYPES].sort())
})
test("correct types exposed", () => {
    expect(Object.keys(mst.types).sort()).toEqual(TYPES.sort())
})
test("all methods mentioned in readme.md", () => {
    const readme = readFileSync(__dirname + "/../../../../README.md", "utf8")
    const missing = TYPES.map(type => "types." + type)
        .concat(METHODS)
        .filter(identifier => readme.indexOf("`" + identifier) === -1)
    expect(missing).toEqual([])
})
test("all methods mentioned in api.md", () => {
    const apimd = readFileSync(__dirname + "/../../../../API.md", "utf8")
    const missing = TYPES.map(type => "types." + type)
        .concat(METHODS)
        .filter(identifier => apimd.indexOf("# " + identifier) === -1)
    expect(missing).toEqual([])
})

test("no dependencies", () => {
    const deps = JSON.parse(readFileSync(__dirname + "/../../package.json", "utf8")).dependencies
    expect(deps === undefined || Object.keys(deps).length === 0).toBe(true)
})
