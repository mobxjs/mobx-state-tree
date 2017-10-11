"use strict"
var __awaiter =
    (this && this.__awaiter) ||
    function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value))
                } catch (e) {
                    reject(e)
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : new P(function(resolve) {
                          resolve(result.value)
                      }).then(fulfilled, rejected)
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next())
        })
    }
Object.defineProperty(exports, "__esModule", { value: true })
const ava_1 = require("ava")
const atomic_1 = require("../src/atomic")
const mobx_state_tree_1 = require("mobx-state-tree")
function delay(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}
const TestModel = mobx_state_tree_1.types
    .model({
        z: 1
    })
    .actions(self => {
        mobx_state_tree_1.addMiddleware(self, atomic_1.default)
        return {
            inc(x) {
                self.z += x
                return self.z
            },
            throwingFn(x) {
                self.z += x
                throw "Oops"
            },
            incProcess: mobx_state_tree_1.process(function*(x) {
                yield delay(2)
                self.z += x
                yield delay(2)
                self.z += x
                return self.z
            }),
            throwingProcess: mobx_state_tree_1.process(function*(x) {
                yield delay(2)
                self.z += x
                yield delay(2)
                self.z += x
                throw "Oops"
            })
        }
    })
ava_1.test("should run action normally", t => {
    const m = TestModel.create()
    t.is(m.inc(3), 4)
    t.is(m.z, 4)
})
ava_1.test("should rollback on action failure", t => {
    const m = TestModel.create()
    t.throws(() => m.throwingFn(3), /Oops/)
    t.is(m.z, 1)
})
ava_1.test("should run async action normally on action failure", t =>
    __awaiter(this, void 0, void 0, function*() {
        const m = TestModel.create()
        const value = yield m.incProcess(3)
        t.is(value, 7)
        t.is(m.z, 7)
    })
)
ava_1.test("should rollback on async action failure", t =>
    __awaiter(this, void 0, void 0, function*() {
        const m = TestModel.create()
        try {
            yield m.throwingProcess(3)
        } catch (e) {
            t.is(e, "Oops")
            t.is(m.z, 1)
        }
    })
)
