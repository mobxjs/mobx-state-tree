import { t } from "../../src"
import { Hook, NodeLifeCycle } from "../../src/internal"
import { describe, it, expect, test } from "bun:test"

describe("types.bigint", () => {
    describe("methods", () => {
        describe("create", () => {
            describe("with no arguments", () => {
                if (process.env.NODE_ENV !== "production") {
                    it("should throw an error in development", () => {
                        expect(() => {
                            t.bigint.create()
                        }).toThrow()
                    })
                }
            })
            describe("with a bigint argument", () => {
                it("should return a bigint", () => {
                    const n = t.bigint.create(BigInt(1))
                    expect(typeof n).toBe("bigint")
                })
            })
            describe("with a number argument", () => {
                it("should return a bigint", () => {
                    const n = t.bigint.create(1)
                    expect(typeof n).toBe("bigint")
                    expect(n).toBe(BigInt(1))
                })
            })
            describe("with a string argument", () => {
                it("should return a bigint", () => {
                    const n = t.bigint.create("2")
                    expect(typeof n).toBe("bigint")
                    expect(n).toBe(BigInt(2))
                })
            })
            describe("with argument of different types", () => {
                const testCases = [
                    null,
                    undefined,
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
                                t.bigint.create(testCase as any)
                            }).toThrow()
                        })
                    })
                }
            })
        })
        describe("describe", () => {
            it("should return the value 'bigint'", () => {
                const description = t.bigint.describe()
                expect(description).toBe("bigint")
            })
        })
        describe("getSnapshot", () => {
            it("should return the value as string (JSON-safe)", () => {
                const n = t.bigint.instantiate(null, "", {}, BigInt(1))
                const snapshot = t.bigint.getSnapshot(n)
                expect(snapshot).toBe("1")
                expect(typeof snapshot).toBe("string")
            })
        })
        describe("getSubtype", () => {
            it("should return null", () => {
                const subtype = t.bigint.getSubTypes()
                expect(subtype).toBe(null)
            })
        })
        describe("instantiate", () => {
            if (process.env.NODE_ENV !== "production") {
                describe("with invalid arguments", () => {
                    it("should throw when passed undefined", () => {
                        expect(() => {
                            t.bigint.instantiate(null, "", {}, undefined as any)
                        }).toThrow()
                    })
                })
            }
            describe("with a bigint argument", () => {
                it("should return an object", () => {
                    const n = t.bigint.instantiate(null, "", {}, BigInt(1))
                    expect(typeof n).toBe("object")
                })
            })
        })
        describe("is", () => {
            describe("with a bigint argument", () => {
                it("should return true", () => {
                    const result = t.bigint.is(BigInt(1))
                    expect(result).toBe(true)
                })
            })
            describe("with argument of different types", () => {
                const testCases = [
                    null,
                    undefined,
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
                        const result = t.bigint.is(testCase as any)
                        expect(result).toBe(false)
                    })
                })
            })
            describe("with a string argument", () => {
                it("should return true (string is valid snapshot input)", () => {
                    expect(t.bigint.is("1")).toBe(true)
                })
            })
            describe("with a number argument", () => {
                it("should return true (number is valid snapshot input)", () => {
                    expect(t.bigint.is(1)).toBe(true)
                })
            })
        })
        describe("isAssignableFrom", () => {
            describe("with a bigint argument", () => {
                it("should return true", () => {
                    const result = t.bigint.isAssignableFrom(t.bigint)
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
                        const result = t.bigint.isAssignableFrom(testCase as any)
                        expect(result).toBe(false)
                    })
                })
            })
        })
        describe("validate", () => {
            describe("with a bigint, string or number argument", () => {
                it("should return with no validation errors for bigint", () => {
                    const result = t.bigint.validate(BigInt(1), [])
                    expect(result).toEqual([])
                })
                it("should return with no validation errors for string", () => {
                    const result = t.bigint.validate("1", [])
                    expect(result).toEqual([])
                })
                it("should return with no validation errors for number", () => {
                    const result = t.bigint.validate(1, [])
                    expect(result).toEqual([])
                })
            })
            describe("with argument of different types", () => {
                const testCases = [
                    null,
                    undefined,
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
                        const result = t.bigint.validate(testCase as any, [])
                        expect(result).toEqual([
                            {
                                context: [],
                                message: "Value is not a bigint",
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
                const flags = t.bigint.flags
                expect(flags).toBe(1 << 23)
            })
        })
        describe("identifierAttribute", () => {
            test("returns undefined", () => {
                const identifierAttribute = t.bigint.identifierAttribute
                expect(identifierAttribute).toBeUndefined()
            })
        })
        describe("isType", () => {
            test("returns true", () => {
                const isType = t.bigint.isType
                expect(isType).toBe(true)
            })
        })
        describe("name", () => {
            test('returns "bigint"', () => {
                const name = t.bigint.name
                expect(name).toBe("bigint")
            })
        })
    })
    describe("instance", () => {
        describe("methods", () => {
            describe("aboutToDie", () => {
                it("calls the beforeDetach hook", () => {
                    const n = t.bigint.instantiate(null, "", {}, BigInt(1))
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
                    const n = t.bigint.instantiate(null, "", {}, BigInt(1))
                    n.die()
                    expect(n.isAlive).toBe(false)
                })
                it("should mark the node as dead", () => {
                    const n = t.bigint.instantiate(null, "", {}, BigInt(1))
                    n.die()
                    expect(n.state).toBe(NodeLifeCycle.DEAD)
                })
            })
            describe("finalizeCreation", () => {
                it("should mark the node as finalized", () => {
                    const n = t.bigint.instantiate(null, "", {}, BigInt(1))
                    n.finalizeCreation()
                    expect(n.state).toBe(NodeLifeCycle.FINALIZED)
                })
            })
            describe("finalizeDeath", () => {
                it("should mark the node as dead", () => {
                    const n = t.bigint.instantiate(null, "", {}, BigInt(1))
                    n.finalizeDeath()
                    expect(n.state).toBe(NodeLifeCycle.DEAD)
                })
            })
            describe("getReconciliationType", () => {
                it("should return the correct type", () => {
                    const n = t.bigint.instantiate(null, "", {}, BigInt(1))
                    const type = n.getReconciliationType()
                    expect(type).toBe(t.bigint)
                })
            })
            describe("getSnapshot", () => {
                it("should return the value as string (JSON-safe)", () => {
                    const n = t.bigint.instantiate(null, "", {}, BigInt(1))
                    const snapshot = n.getSnapshot()
                    expect(snapshot).toBe("1")
                    expect(typeof snapshot).toBe("string")
                })
            })
            describe("registerHook", () => {
                it("should register a hook and call it", () => {
                    const n = t.bigint.instantiate(null, "", {}, BigInt(1))
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
                            const n = t.bigint.instantiate(null, "", {}, BigInt(1))
                            expect(() => {
                                n.setParent(null, "foo")
                            }).toThrow()
                        })
                    })
                    describe("with a parent object", () => {
                        it("should throw an error", () => {
                            const Parent = t.model({
                                child: t.bigint
                            })

                            const parent = Parent.create({ child: BigInt(1) })

                            const n = t.bigint.instantiate(null, "", {}, BigInt(1))

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
