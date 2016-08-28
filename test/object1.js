"use strict"

const mobx = require("mobx")
const test = require("tape")
const $ = require("../")

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