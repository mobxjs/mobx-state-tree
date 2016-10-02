import * as test from "tape"
import {subscribe, onPatch, createFactory, applyPatch, _getNode, getPath, IJsonPatch, applySnapshot, generateFactory} from "../src/"

function objectTest(name, initialState, f, expectedPatches, expectedSnapshots) {
    test(name, t => {
        const factory = generateFactory(initialState)
        const state = factory(initialState)
        const patches: IJsonPatch[] = []
        const snapshots: any[] = []
        subscribe(state, snapshot => { snapshots.push(snapshot) })
        onPatch(state, patch => patches.push(patch))

        f(state)

        t.deepEqual(patches, expectedPatches)
        t.deepEqual(snapshots, expectedSnapshots)
        t.end()
    })
}

test("basic object", t => {
    const patches: IJsonPatch[] = []
    const snapshots: any[] = []

    const f = createFactory(() => ({
        hello: "test"
    }))
    const state = f({
        hello: "world"
    })

    const $state = _getNode(state)
    t.ok($state.state === state)
    t.equal($state.path, "")
    t.deepEqual($state.pathParts, [])
    t.equal($state.isRoot, true)
    t.equal($state.parent, null)

    snapshots.push($state.snapshot)

    t.deepEqual(snapshots, [{
        hello: "world"
    }])

    $state.onPatch(p => patches.push(p))
    $state.onSnapshot(s => snapshots.push(s))

    state.hello = "universe"

    t.deepEqual(snapshots, [{
        hello: "world"
    }, {
        hello: "universe"
    }])

    t.deepEqual(patches, [{
        op: "replace",
        path: "/hello",
        value: "universe"
    }])

    t.equal(getPath(state), "")

    applySnapshot(state, snapshots[0])
    t.equal(state.hello, "world")
    applyPatch(state, patches[0])
    t.equal(state.hello, "universe")

    t.deepEqual(snapshots, [{
        hello: "world"
    }, {
        hello: "universe"
    }, {
        hello: "world"
    }, {
        hello: "universe"
    }])

    t.deepEqual(patches, [{
        op: "replace",
        path: "/hello",
        value: "universe"
    }, {
        op: "replace",
        path: "/hello",
        value: "world"
    }, {
        op: "replace",
        path: "/hello",
        value: "universe"
    }])

    t.end()
})

objectTest("nested objects", { a: { b: { c: 3 }}}, state => {
    state.a.b.c = 4
    state.a.b = { c: 5 }
    state.a.b.c = 6
}, [
    { op: "replace", path: "/a/b/c", value: 4 },
    { op: "replace", path: "/a/b", value: { c: 5} },
    { op: "replace", path: "/a/b/c", value: 6 }
], [
    { a: { b: { c: 4}}},
    { a: { b: { c: 5}}},
    { a: { b: { c: 6}}}
])

test("structural sharing", t => {
    const child = createFactory(() => ({ b: 0 }))
    const parent = createFactory(() => ({  a: child, c: 0 }))
    const state = parent({ a: { b: 3 }, c: 4})
    const s: any[] = []
    subscribe(state, sn => s.push(sn))

    state.c = 5
    state.c = 6
    state.a = { b: 1}
    state.a.b = 4
    state.c = 7
    applyPatch(state, { op: "replace", path: "/c", value: 3})
    t.equal(state.a.b, 4)
    t.equal(state.c, 3)

    t.ok(s[0].a === s[1].a)
    t.ok(s[1].a !== s[2].a)
    t.ok(s[2].a !== s[3].a)
    t.ok(s[3].a === s[4].a)
    t.ok(s[4].a === s[5].a)

    t.end()
})

test("add node to tree", t => {
    const f1 = createFactory(() => ({ a: null }))
    const f2 = createFactory(() => ({ b: 0 }))
    const parent = f1({ a : null })
    const child = f2({ b: 2 })
    const $parent = _getNode(parent)
    const $child = _getNode(child)

    const patches: IJsonPatch[] = []
    const snapshots: Object[] = []
    $parent.subscribe(s => snapshots.push(s))
    $child.subscribe(s => snapshots.push(s))
    $parent.onPatch(p => patches.push(p))
    $child.onPatch(p => patches.push(p))

    t.equal($parent.isRoot, true)
    t.equal($child.isRoot, true)
    parent.a = child
    t.equal($child.isRoot, false)
    t.equal($parent.path, "")
    t.equal($child.path, "a")

    child.b = 3

    // detach
    parent.a = null
    t.equal($child.isRoot, true)
    t.equal($child.path, "/")

    child.b = 4

    t.deepEqual(patches, [
        { op: 'replace', path: 'a', value: { b: 2 } },
        { op: 'replace', path: 'b', value: 3 },
        { op: 'replace', path: 'a/b', value: 3 },
        { op: 'replace', path: 'a', value: null },
        { op: 'replace', path: 'b', value: 4 }
    ])
    t.deepEqual(snapshots, [
        { a: { b: 2 } },
        { b: 3 },
        { a: { b: 3 } },
        { a: null },
        { b: 4 }
    ])

    t.end()
})

// test("cannot add tree to node twice", t => {
//     const parent = { a: null, b: null }
//     const child = { c: null }
//     $.asNode(parent)

//     parent.a = child
//     t.throws(() => parent.b = child, /A node cannot exists twice in the state tree. Failed to add object to path '\/b', it exists already at '\/a'/)
//     t.end()
// })

// test("cannot add tree to itself", t => {
//     const child = { c: null }
//     $.asNode(child)

//     t.throws(() => {
//         child.c = child
//     }, /A state tree is not allowed to contain itself. Cannot add root to path '\/c'/)
//     t.end()
// })


// test("cannot add tree deeply to itself", t => {
//     const child = { c: null }
//     $.asNode(child)

//     const parent = {
//         a: child
//     }
//     $.asNode(parent)


//     t.throws(() => {
//         child.c = parent
//     }, /A state tree is not allowed to contain itself. Cannot add root to path '\/a\/c'/)
//     t.end()
// })

// test("cannot add tree deeple to itself - 2", t => {
//     const child = { c: null }
//     child.c = child

//     t.throws(() => {
//         $.asNode(child)
//     }, /A state tree is not allowed to contain itself. Cannot add root to path '\/c'/)
//     t.end()
// })

// test("subpath is updated correctly", t => {
//     const child = { a: { b: 3 }}
//     const $child = $.asNode(child)
//     const parent = { c: null }
//     const $parent = $.asNode(parent)

//     t.equal($child.isRoot, true)
//     t.equal($child.path, "/")
//     t.equal($.getPath(child.a), "/a")

//     parent.c = child
//     t.equal($child.isRoot, false)
//     t.equal($child.path, "/c")
//     t.equal($.getPath(child.a), "/c/a")

//     parent.c = null
//     t.equal($child.isRoot, true)
//     t.equal($child.path, "/")
//     t.equal($.getPath(child.a), "/a")

//     t.end()
// })