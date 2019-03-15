import * as mst from "../../src"
import { readFileSync } from "fs"

function stringToArray(s: string): string[] {
    return s.split(",").map(str => str.trim())
}

const METHODS_AND_INTERNAL_TYPES = stringToArray(`
    typecheck,
    escapeJsonPath,
    unescapeJsonPath,
    joinJsonPath,
    splitJsonPath,
    decorate,
    addMiddleware,
    isStateTreeNode,
    flow,
    castFlowReturn,
    applyAction,
    onAction,
    recordActions,
    createActionTrackingMiddleware,
    setLivelinessChecking,
    getLivelinessChecking,
    getType,
    getChildType,
    onPatch,
    onSnapshot,
    applyPatch,
    recordPatches,
    protect,
    unprotect,
    isProtected,
    applySnapshot,
    getSnapshot,
    hasParent,
    getParent,
    hasParentOfType,
    getParentOfType,
    getRoot,
    getPath,
    getPathParts,
    isRoot,
    resolvePath,
    resolveIdentifier,
    getIdentifier,
    tryResolve,
    getRelativePath,
    clone,
    detach,
    destroy,
    isAlive,
    addDisposer,
    getEnv,
    walk,
    getMembers,
    getPropertyMembers,
    cast,
    castToSnapshot,
    castToReferenceSnapshot,
    isType,
    isArrayType,
    isFrozenType,
    isIdentifierType,
    isLateType,
    isLiteralType,
    isMapType,
    isModelType,
    isOptionalType,
    isPrimitiveType,
    isReferenceType,
    isRefinementType,
    isUnionType,
    isValidReference,
    tryReference,
    getNodeId,

    types
`)

const DEPRECATED_METHODS_AND_INTERNAL_TYPES = stringToArray(`
    setLivelynessChecking,
    process
`)

const METHODS = METHODS_AND_INTERNAL_TYPES.filter(s => s[0].toLowerCase() === s[0])

const INTERNAL_TYPES = METHODS_AND_INTERNAL_TYPES.filter(s => s[0].toUpperCase() === s[0])

const TYPES = stringToArray(`
    enumeration,
    model,
    compose,
    custom,
    reference,
    safeReference,
    union,
    optional,
    literal,
    maybe,
    maybeNull,
    refinement,
    string,
    boolean,
    number,
    integer,
    Date,
    map,
    array,
    frozen,
    identifier,
    identifierNumber,
    late,
    undefined,
    null,
    snapshotProcessor
`)

test("correct api exposed", () => {
    expect(
        Object.keys(mst)
            .sort()
            .filter(key => (mst as any)[key] !== undefined) // filter out interfaces
            .filter(s => !DEPRECATED_METHODS_AND_INTERNAL_TYPES.includes(s))
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
        .filter(s => !DEPRECATED_METHODS_AND_INTERNAL_TYPES.includes(s))
    expect(missing).toEqual([])
})
test("all methods mentioned in API docs", () => {
    const apimd = readFileSync(__dirname + "/../../../../docs/API/README.md", "utf8")
    const missing = TYPES.map(type => "types." + type).filter(
        identifier => apimd.indexOf(identifier) === -1
    )
    missing.push(
        ...METHODS.filter(identifier => apimd.indexOf("#" + identifier.toLowerCase()) === -1)
    )
    expect(missing).toEqual([])
})

test("only accepted dependencies", () => {
    const validDeps = ["tslib"]

    const deps = JSON.parse(readFileSync(__dirname + "/../../package.json", "utf8")).dependencies

    const depNames = Object.keys(deps) || []
    expect(depNames.sort()).toEqual(validDeps.sort())
})
