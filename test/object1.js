"use strict"

const mobx = require("mobx")
const test = require("tape")
const $ = require("../")

function objectTest(name, initialState, f, expectedPatches, expectedSnapshots) {
    test(name, t => {
        const patches = []
        const snapshots = []
        const tree = $.asNode(initialState)
        tree.subscribe(snapshot => snapshots.push(snapshot))
        tree.patchStream(patch => patches.push(patch))

        f(initialState)

        t.deepEqual(patches, expectedPatches)
        t.deepEqual(snapshots, expectedSnapshots)
        t.end()
    })
}

test("basic object", t => {
    const patches = []
    const snapshots = []
    const state = {
        hello: "world"
    }

    const $state = $.asNode(state)
    t.ok($state.state === state)
    t.equal($state.path, "/")
    t.deepEqual($state.pathParts, [])
    t.equal($state.isRoot, true)
    t.equal($state.parent, null)


    snapshots.push($state.snapshot)

    t.deepEqual(snapshots, [{
        hello: "world"
    }])

    $state.patchStream(p => patches.push(p))
    $state.subscribe(s => snapshots.push(s))

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

    $.getPath(state, "/")

    $state.restoreSnapshot(snapshots[0])
    t.equal(state.hello, "world")
    $state.applyPatch(patches[0])
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
    state.a.b = { d: 5 }
    state.a.b.d = 6
}, [
    { op: "replace", path: "/a/b/c", value: 4 },
    { op: "replace", path: "/a/b", value: { d: 5} },
    { op: "replace", path: "/a/b/d", value: 6 }
], [
    { a: { b: { c: 4}}},
    { a: { b: { d: 5}}},
    { a: { b: { d: 6}}}
])

test("structural sharing", t => {
    const state = { a: { b: 3 }, c: 4}
    const s = []
    $.asNode(state).subscribe(sn => s.push(sn))

    state.c = 5
    state.c = 6
    state.c = { x: 1}
    state.a.b = 4
    $.asNode(state).applyPatch({ op: "replace", path: "/a", value: 3})
    t.ok(s[0].a === s[1].a)
    t.ok(s[2].c === s[3].c)
    t.ok(s[3].c === s[4].c)
    t.equal(state.a, 3)

    t.end()
})