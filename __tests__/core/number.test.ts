import { t } from "../../src"
import { Hook, NodeLifeCycle } from "../../src/internal"
import { describe, it, expect, test } from "bun:test"

describe("types.number", () => {
    describe("methods", () => {
        describe("create", () => {
            describe("with no arguments", () => {
                if (process.env.NODE_ENV !== "production") {
                    it("should throw an error in development", () => {
                        expect(() => {
                            t.number.create()
                        }).toThrow()
                    })
                }
            })
            describe("with a number argument", () => {
                it("should return a number", () => {
                    const n = t.number.create(1)
                    expect(typeof n).toBe("number")
                })
            })
            describe("with argument of different types", () => {
                // Keep in mind, Infinity and NaN are treated as numbers in JavaScript, so we won't test for them here.
                const testCases = [
                    null,
                    undefined,
                    "string",
                    true,
                    [],
                    function () {},
                    new Date(),
                    /a/,
                    new Map(),
                    new Set(),
                    Symbol(),
                    new Error()
                ]

                if (process.env.NODE_ENV !== "production") {
                    testCases.forEach(testCase => {
                        it(`should throw an error when passed ${JSON.stringify(testCase)}`, () => {
                            expect(() => {
                                t.number.create(testCase as any)
                            }).toThrow()
                        })
                    })
                }
            })
        })
        describe("describe", () => {
            it("should return the value 'number'", () => {
                const description = t.number.describe()
                expect(description).toBe("number")
            })
        })
        describe("getSnapshot", () => {
            it("should return the value passed in", () => {
                const n = t.number.instantiate(null, "", {}, 1)
                const snapshot = t.number.getSnapshot(n)
                expect(snapshot).toBe(1)
            })
        })
        describe("getSubtype", () => {
            it("should return null", () => {
                const subtype = t.number.getSubTypes()
                expect(subtype).toBe(null)
            })
        })
        describe("instantiate", () => {
            if (process.env.NODE_ENV !== "production") {
                describe("with invalid arguments", () => {
                    it("should not throw an error", () => {
                        expect(() => {
                            // @ts-ignore
                            t.number.instantiate()
                        }).not.toThrow()
                    })
                })
            }
            describe("with a number argument", () => {
                it("should return an object", () => {
                    const n = t.number.instantiate(null, "", {}, 1)
                    expect(typeof n).toBe("object")
                })
            })
        })
        describe("is", () => {
            describe("with a number argument", () => {
                it("should return true", () => {
                    const result = t.number.is(1)
                    expect(result).toBe(true)
                })
            })
            describe("with argument of different types", () => {
                // Keep in mind, Infinity and NaN are treated as numbers in JavaScript, so we won't test for them here.
                const testCases = [
                    null,
                    undefined,
                    "string",
                    true,
                    [],
                    function () {},
                    new Date(),
                    /a/,
                    new Map(),
                    new Set(),
                    Symbol(),
                    new Error()
                ]

                testCases.forEach(testCase => {
                    it(`should return false when passed ${JSON.stringify(testCase)}`, () => {
                        const result = t.number.is(testCase as any)
                        expect(result).toBe(false)
                    })
                })
            })
        })
        describe("isAssignableFrom", () => {
            describe("with a number argument", () => {
                it("should return true", () => {
                    const result = t.number.isAssignableFrom(t.number)
                    expect(result).toBe(true)
                })
            })
            describe("with argument of different types", () => {
                const testCases = [
                    t.Date,
                    t.boolean,
                    t.finite,
                    t.float,
                    t.identifier,
                    t.identifierNumber,
                    t.integer,
                    t.null,
                    t.string,
                    t.undefined
                ]

                testCases.forEach(testCase => {
                    it(`should return false when passed ${JSON.stringify(testCase)}`, () => {
                        const result = t.number.isAssignableFrom(testCase as any)
                        expect(result).toBe(false)
                    })
                })
            })
        })
        // TODO: we need to test this, but to be honest I'm not sure what the expected behavior is on single number nodes.
        describe.skip("reconcile", () => {})
        describe("validate", () => {
            describe("with a number argument", () => {
                it("should return with no validation errors", () => {
                    const result = t.number.validate(1, [])
                    expect(result).toEqual([])
                })
            })
            describe("with argument of different types", () => {
                // Keep in mind, Infinity and NaN are treated as numbers in JavaScript, so we won't test for them here.
                const testCases = [
                    null,
                    undefined,
                    "string",
                    true,
                    [],
                    function () {},
                    new Date(),
                    /a/,
                    new Map(),
                    new Set(),
                    Symbol(),
                    new Error()
                ]

                testCases.forEach(testCase => {
                    it(`should return with a validation error when passed ${JSON.stringify(
                        testCase
                    )}`, () => {
                        const result = t.number.validate(testCase as any, [])
                        expect(result).toEqual([
                            {
                                context: [],
                                message: "Value is not a number",
                                value: testCase
                            }
                        ])
                    })
                })
            })
        })
    })
    describe("properties", () => {
        describe("flags", () => {
            test("return the correct value", () => {
                const flags = t.number.flags
                expect(flags).toBe(2)
            })
        })
        describe("identifierAttribute", () => {
            // We don't have a way to set the identifierAttribute on a primitive type, so this should return undefined.
            test("returns undefined", () => {
                const identifierAttribute = t.number.identifierAttribute
                // @ts-expect-error this is a test to make sure the value is undefined, we expect this
                expect(identifierAttribute).toBe(undefined)
            })
        })
        describe("isType", () => {
            test("returns true", () => {
                const isType = t.number.isType
                expect(isType).toBe(true)
            })
        })
        describe("name", () => {
            test('returns "number"', () => {
                const name = t.number.name
                expect(name).toBe("number")
            })
        })
    })
    describe("instance", () => {
        describe("methods", () => {
            describe("aboutToDie", () => {
                it("calls the beforeDetach hook", () => {
                    const n = t.number.instantiate(null, "", {}, 1)
                    let called = false
                    n.registerHook(Hook.beforeDestroy, () => {
                        called = true
                    })
                    n.aboutToDie()
                    expect(called).toBe(true)
                })
            })
            describe("die", () => {
                it("kills the node", () => {
                    const n = t.number.instantiate(null, "", {}, 1)
                    n.die()
                    expect(n.isAlive).toBe(false)
                })
                it("should mark the node as dead", () => {
                    const n = t.number.instantiate(null, "", {}, 1)
                    n.die()
                    expect(n.state).toBe(NodeLifeCycle.DEAD)
                })
            })
            describe("finalizeCreation", () => {
                it("should mark the node as finalized", () => {
                    const n = t.number.instantiate(null, "", {}, 1)
                    n.finalizeCreation()
                    expect(n.state).toBe(NodeLifeCycle.FINALIZED)
                })
            })
            describe("finalizeDeath", () => {
                it("should mark the node as dead", () => {
                    const n = t.number.instantiate(null, "", {}, 1)
                    n.finalizeDeath()
                    expect(n.state).toBe(NodeLifeCycle.DEAD)
                })
            })
            describe("getReconciliationType", () => {
                it("should return the correct type", () => {
                    const n = t.number.instantiate(null, "", {}, 1)
                    const type = n.getReconciliationType()
                    expect(type).toBe(t.number)
                })
            })
            describe("getSnapshot", () => {
                it("should return the value passed in", () => {
                    const n = t.number.instantiate(null, "", {}, 1)
                    const snapshot = n.getSnapshot()
                    expect(snapshot).toBe(1)
                })
            })
            describe("registerHook", () => {
                it("should register a hook and call it", () => {
                    const n = t.number.instantiate(null, "", {}, 1)
                    let called = false
                    n.registerHook(Hook.beforeDestroy, () => {
                        called = true
                    })

                    n.die()

                    expect(called).toBe(true)
                })
            })
            describe("setParent", () => {
                if (process.env.NODE_ENV !== "production") {
                    describe("with null", () => {
                        it("should throw an error", () => {
                            const n = t.number.instantiate(null, "", {}, 1)
                            expect(() => {
                                n.setParent(null, "foo")
                            }).toThrow()
                        })
                    })
                    describe("with a parent object", () => {
                        it("should throw an error", () => {
                            const Parent = t.model({
                                child: t.number
                            })

                            const parent = Parent.create({ child: 1 })

                            const n = t.number.instantiate(null, "", {}, 1)

                            expect(() => {
                                // @ts-ignore
                                n.setParent(parent, "bar")
                            }).toThrow(
                                "[mobx-state-tree] assertion failed: scalar nodes cannot change their parent"
                            )
                        })
                    })
                }
            })
        })
    })
})
