import * as mst from "../src"
import { test } from "ava"
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
    "getChildType",
    "getEnv",
    "getParent",
    "getPath",
    "getPathParts",
    "getRelativePath",
    "getRoot",
    "getSnapshot",
    "getType",
    "hasParent",
    "isAlive",
    "isProtected",
    "isRoot",
    "isStateTreeNode",
    "onAction",
    "onPatch",
    "onSnapshot",
    "process",
    "protect",
    "recordActions",
    "recordPatches",
    "resolveIdentifier",
    "resolvePath",
    "tryResolve",
    "typecheck",
    "types",
    "unescapeJsonPath",
    "unprotect",
    "walk"
]
const TYPES = [
    "Date",
    "array",
    "boolean",
    "compose",
    "frozen",
    "identifier",
    "late",
    "literal",
    "map",
    "maybe",
    "model",
    "null",
    "number",
    "optional",
    "reference",
    "refinement",
    "string",
    "undefined",
    "union",
    "enumeration"
]

test("correct api exposed", t => {
    t.deepEqual(Object.keys(mst).sort(), METHODS.sort())
})

test("correct types exposed", t => {
    t.deepEqual(Object.keys(mst.types).sort(), TYPES.sort())
})

test("all methods mentioned in readme.md", t => {
    const readme = readFileSync(__dirname + "/../../../../README.md", "utf8")
    const missing = TYPES.map(type => "types." + type)
        .concat(METHODS)
        .filter(identifier => readme.indexOf("`" + identifier) === -1)
    t.deepEqual(missing, [])
})

test("all methods mentioned in api.md", t => {
    const apimd = readFileSync(__dirname + "/../../../../API.md", "utf8")
    const missing = TYPES.map(type => "types." + type)
        .concat(METHODS)
        .filter(identifier => apimd.indexOf("# " + identifier) === -1)
    t.deepEqual(missing, [])
})
