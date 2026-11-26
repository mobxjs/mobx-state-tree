import {
    applyPatch,
    getSnapshot,
    IAnyModelType,
    IJsonPatch,
    Instance,
    cast,
    recordPatches,
    types,
    unprotect
} from "../../src"
import { describe, expect, test } from "bun:test"

/**
 * Patches are documented as JSON-Patch (RFC 6902), and users replay them on serialized snapshots.
 * The helpers below implement just enough of RFC 6902 to check that the recorded patches are valid
 * documents against a JSON snapshot: `replace` and `remove` require the target to exist, and
 * `replace` requires a `value` member.
 */
function serialize(value: any): any {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value))
}

function parsePointer(path: string): string[] {
    if (path === "") return []
    if (!path.startsWith("/")) throw new Error(`Not a JSON pointer: ${path}`)
    return path
        .slice(1)
        .split("/")
        .map(part => part.replace(/~1/g, "/").replace(/~0/g, "~"))
}

function resolveParent(document: any, path: string): { parent: any; key: string } {
    const parts = parsePointer(path)
    if (parts.length === 0) throw new Error(`Cannot resolve the document root: ${path}`)
    let parent = document
    for (const part of parts.slice(0, -1)) {
        if (parent === null || typeof parent !== "object" || !(part in parent)) {
            throw new Error(`OPERATION_PATH_UNRESOLVABLE: ${path}`)
        }
        parent = parent[part]
    }
    if (parent === null || typeof parent !== "object") {
        throw new Error(`OPERATION_PATH_UNRESOLVABLE: ${path}`)
    }
    return { parent, key: parts[parts.length - 1] }
}

function hasMember(patch: IJsonPatch): boolean {
    return Object.prototype.hasOwnProperty.call(patch, "value")
}

function applyJsonPatch(document: any, patch: IJsonPatch): any {
    if (patch.path === "") {
        if (patch.op === "replace" && hasMember(patch)) return patch.value
        throw new Error(`Unsupported root operation: ${patch.op}`)
    }
    const { parent, key } = resolveParent(document, patch.path)
    const exists = Array.isArray(parent) ? Number(key) < parent.length : key in parent

    switch (patch.op) {
        case "add":
            if (!hasMember(patch)) throw new Error(`OPERATION_VALUE_REQUIRED: ${patch.path}`)
            if (Array.isArray(parent)) parent.splice(Number(key), 0, patch.value)
            else parent[key] = patch.value
            return document
        case "remove":
            if (!exists) throw new Error(`OPERATION_PATH_UNRESOLVABLE: ${patch.path}`)
            if (Array.isArray(parent)) parent.splice(Number(key), 1)
            else delete parent[key]
            return document
        case "replace":
            if (!exists) throw new Error(`OPERATION_PATH_UNRESOLVABLE: ${patch.path}`)
            if (!hasMember(patch)) throw new Error(`OPERATION_VALUE_REQUIRED: ${patch.path}`)
            parent[key] = patch.value
            return document
        default:
            throw new Error(`Unsupported operation: ${(patch as any).op}`)
    }
}

function applyJsonPatches(document: any, patches: ReadonlyArray<IJsonPatch>): any {
    return patches.reduce(applyJsonPatch, document)
}

/** Records the patches of `mutate` and returns the before/after JSON snapshots next to them. */
function recordSeries<C, S, T extends object>(
    type: any,
    initial: C,
    mutate: (instance: Instance<any>) => void
) {
    const instance = type.create(initial)
    const before = serialize(getSnapshot(instance))
    const recorder = recordPatches(instance)
    unprotect(instance)
    mutate(instance)
    recorder.stop()
    return {
        instance,
        before,
        after: serialize(getSnapshot(instance)),
        patches: serialize(recorder.patches) as IJsonPatch[],
        inversePatches: serialize(recorder.inversePatches) as IJsonPatch[]
    }
}

describe("patches applied to a serialized snapshot", () => {
    test("a types.maybe property going from undefined to a value is recorded as add", () => {
        const Model = types.model({ a: types.maybe(types.string), b: 1 })
        const { before, after, patches } = recordSeries(Model, {}, m => {
            m.a = "x"
        })

        expect(before).toEqual({ b: 1 })
        expect(patches).toEqual([{ op: "add", path: "/a", value: "x" }])
        expect(applyJsonPatches(serialize(before), patches)).toEqual(after)
    })

    test("a types.maybe property going from a value to undefined is recorded as remove", () => {
        const Model = types.model({ a: types.maybe(types.string), b: 1 })
        const { before, after, patches } = recordSeries(Model, { a: "x" }, m => {
            m.a = undefined
        })

        expect(patches).toEqual([{ op: "remove", path: "/a" }])
        expect(applyJsonPatches(serialize(before), patches)).toEqual(after)
    })

    test("records add and remove for nested maybe properties", () => {
        const Inner = types.model({ value: types.maybe(types.string) })
        const Outer = types.model({ inner: types.maybe(Inner) })
        const { instance, before, after, patches } = recordSeries(Outer, {}, m => {
            m.inner = cast({ value: "x" })
        })

        expect(patches).toEqual([{ op: "add", path: "/inner", value: { value: "x" } }])
        expect(applyJsonPatches(serialize(before), patches)).toEqual(after)

        const removed = recordSeries(Outer, { inner: { value: "x" } }, m => {
            m.inner = undefined
        })
        expect(removed.patches).toEqual([{ op: "remove", path: "/inner" }])
        expect(applyJsonPatches(serialize(removed.before), removed.patches)).toEqual(removed.after)
        expect(instance.inner).toBeDefined()
    })

    test("keeps replace for properties whose value is null", () => {
        const Model = types.model({ a: types.maybeNull(types.string) })
        const { patches } = recordSeries(Model, { a: "x" }, m => {
            m.a = null
        })

        expect(patches).toEqual([{ op: "replace", path: "/a", value: null }])
    })

    test("keeps replace for defined values, including falsy ones", () => {
        const Model = types.model({ n: 0, s: "" })
        const { before, after, patches } = recordSeries(Model, { n: 0, s: "" }, m => {
            m.n = 1
            m.s = "set"
        })

        expect(patches).toEqual([
            { op: "replace", path: "/n", value: 1 },
            { op: "replace", path: "/s", value: "set" }
        ])
        expect(applyJsonPatches(serialize(before), patches)).toEqual(after)
    })

    test("inverse patches restore the JSON snapshot for maybe properties", () => {
        const Model = types.model({ a: types.maybe(types.string), b: 1 })

        const added = recordSeries(Model, {}, m => {
            m.a = "x"
        })
        expect(added.inversePatches).toEqual([{ op: "remove", path: "/a" }])
        expect(applyJsonPatches(serialize(added.after), added.inversePatches)).toEqual(added.before)

        const removed = recordSeries(Model, { a: "x" }, m => {
            m.a = undefined
        })
        expect(removed.inversePatches).toEqual([{ op: "add", path: "/a", value: "x" }])
        expect(applyJsonPatches(serialize(removed.after), removed.inversePatches)).toEqual(
            removed.before
        )
    })

    test("patches survive a JSON.round-trip, as they do when stored and replayed later", () => {
        const Model = types.model({ a: types.maybe(types.string), list: types.array(types.string) })

        const { before, after, patches } = recordSeries(Model, { list: [] }, m => {
            m.a = "x"
            m.list.push("one")
            m.a = undefined
        })

        const stored = JSON.parse(JSON.stringify(patches))
        expect(stored).toEqual([
            { op: "add", path: "/a", value: "x" },
            { op: "add", path: "/list/0", value: "one" },
            { op: "remove", path: "/a" }
        ])
        expect(applyJsonPatches(serialize(before), stored)).toEqual(after)
    })
})

describe("applyPatch", () => {
    test("applies a recorded remove patch to the instance", () => {
        const Model = types.model({ a: types.maybe(types.string) })
        const instance = Model.create({ a: "x" })

        applyPatch(instance, { op: "remove", path: "/a" })

        expect(getSnapshot(instance)).toEqual({ a: undefined })
    })

    test("replays an add patch after a remove patch", () => {
        const Model = types.model({ a: types.maybe(types.string) })
        const instance = Model.create({})
        const recorder = recordPatches(instance)
        applyPatch(instance, { op: "add", path: "/a", value: "x" })
        applyPatch(instance, { op: "remove", path: "/a" })
        recorder.stop()

        expect(recorder.patches).toEqual([
            { op: "add", path: "/a", value: "x" },
            { op: "remove", path: "/a" }
        ])
        recorder.undo()
        expect(getSnapshot(instance)).toEqual({ a: undefined })
    })

    test("still rejects removing a property that cannot be undefined", () => {
        const Model = types.model({ title: types.string })
        const instance = Model.create({ title: "hello" })

        expect(() => applyPatch(instance, { op: "remove", path: "/title" })).toThrow(
            "value `undefined` is not assignable to type: `string`"
        )
        expect(getSnapshot(instance)).toEqual({ title: "hello" })
    })
})
