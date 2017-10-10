import { test } from "ava"
import atomic from "../src/atomic"
import { types, addMiddleware, process } from "mobx-state-tree"

function delay(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

const TestModel = types
    .model({
        z: 1
    })
    .actions(self => {
        addMiddleware(self, atomic)
        return {
            inc(x) {
                self.z += x
                return self.z
            },
            throwingFn(x) {
                self.z += x
                throw "Oops"
            },
            incProcess: process(function*(x) {
                yield delay(2)
                self.z += x
                yield delay(2)
                self.z += x
                return self.z
            }),
            throwingProcess: process(function*(x) {
                yield delay(2)
                self.z += x
                yield delay(2)
                self.z += x
                throw "Oops"
            })
        }
    })

test("should run action normally", t => {
    const m = TestModel.create()
    t.is(m.inc(3), 4)
    t.is(m.z, 4)
})

test("should rollback on action failure", t => {
    const m = TestModel.create()
    t.throws(() => m.throwingFn(3), /Oops/)
    t.is(m.z, 1)
})

test("should run async action normally on action failure", async t => {
    const m = TestModel.create()
    const value = await m.incProcess(3)
    t.is(value, 7)
    t.is(m.z, 7)
})

test("should rollback on async action failure", async t => {
    const m = TestModel.create()
    try {
        await m.throwingProcess(3)
    } catch (e) {
        t.is(e, "Oops")
        t.is(m.z, 1)
    }
})
