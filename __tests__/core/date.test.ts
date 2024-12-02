import { t } from "../../src"
import { Hook, NodeLifeCycle } from "../../src/internal"
import { describe, expect, it, test } from "bun:test"

describe("types.date", () => {
    describe("methods", () => {
        describe("create", () => {
            describe("with no arguments", () => {
                if (process.env.NODE_ENV !== "production") {
                    it("should throw an error in development", () => {
                        expect(() => {
                            t.Date.create()
                        }).toThrow()
                    })
                }
            })
            describe("with a number argument", () => {
                it("should return a Date object", () => {
                    const d = t.Date.create(1701369873059)
                    expect(d instanceof Date).toBe(true)
                })
            })
            describe("with a Date argument", () => {
                it("should return a Date object", () => {
                    const input = new Date()
                    const d = t.Date.create(input)
                    expect(d instanceof Date).toBe(true)
                })
            })
        })
        describe("with argument of different types", () => {
            const testCases = [
                null,
                undefined,
                true,
                [],
                function () {},
                "2022-01-01T00:00:00.000Z",
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
                            t.Date.create(testCase as any)
                        }).toThrow()
                    })
                })
            }
        })
    })
    describe("describe", () => {
        it("should return the value 'Date'", () => {
            const description = t.Date.describe()
            expect(description).toBe("Date")
        })
    })
    describe("getSnapshot", () => {
        it("should return a number from a date", () => {
            const date = new Date("2022-01-01T00:00:00.000Z")
            const d = t.Date.instantiate(null, "", {}, date)
            const snapshot = t.Date.getSnapshot(d)
            expect(snapshot).toBe(1640995200000)
        })
        it("should return a number from a number", () => {
            const d = t.Date.instantiate(null, "", {}, 1701369873059)
            const snapshot = t.Date.getSnapshot(d)
            expect(snapshot).toBe(1701369873059)
        })
    })
    describe("getSubtype", () => {
        it("should return null", () => {
            const subtype = t.Date.getSubTypes()
            expect(subtype).toBe(null)
        })
    })
    describe("instantiate", () => {
        if (process.env.NODE_ENV !== "production") {
            describe("with invalid arguments", () => {
                it("should not throw an error", () => {
                    expect(() => {
                        // @ts-ignore
                        t.Date.instantiate()
                    }).not.toThrow()
                })
            })
        }
        describe("with a Date argument", () => {
            it("should return an object", () => {
                const s = t.Date.instantiate(null, "", {}, new Date())
                expect(typeof s).toBe("object")
            })
        })
        describe("with a number argument", () => {
            it("should return an object", () => {
                const s = t.Date.instantiate(null, "", {}, 1701369873059)
                expect(typeof s).toBe("object")
            })
        })
    })
    describe("is", () => {
        describe("with a Date argument", () => {
            it("should return true", () => {
                const result = t.Date.is(new Date())
                expect(result).toBe(true)
            })
        })
        describe("with a number argument", () => {
            it("should return true", () => {
                const result = t.Date.is(1701369873059)
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
                "2022-01-01T00:00:00.000Z",
                /a/,
                new Map(),
                new Set(),
                Symbol(),
                new Error()
            ]

            testCases.forEach(testCase => {
                it(`should return false when passed ${JSON.stringify(testCase)}`, () => {
                    const result = t.Date.is(testCase as any)
                    expect(result).toBe(false)
                })
            })
        })
    })
    describe("isAssignableFrom", () => {
        describe("with a Date argument", () => {
            it("should return true", () => {
                const result = t.Date.isAssignableFrom(t.Date)
                expect(result).toBe(true)
            })
        })
        describe("with argument of different types", () => {
            const testCases = [
                t.string,
                t.boolean,
                t.finite,
                t.float,
                t.identifier,
                t.identifierNumber,
                t.integer,
                t.null,
                t.number,
                t.undefined
            ]

            testCases.forEach(testCase => {
                it(`should return false when passed ${JSON.stringify(testCase)}`, () => {
                    const result = t.Date.isAssignableFrom(testCase as any)
                    expect(result).toBe(false)
                })
            })
        })

        // TODO: we need to test this, but to be honest I'm not sure what the expected behavior is on single date nodes.
        describe.skip("reconcile", () => {})
        describe("validate", () => {
            describe("with a Date argument", () => {
                it("should return with no validation errors", () => {
                    const result = t.Date.validate(new Date(), [])
                    expect(result).toEqual([])
                })
            })
            describe("with a number argument", () => {
                it("should return with no validation errors", () => {
                    const result = t.Date.validate(1701369873059, [])
                    expect(result).toEqual([])
                })
            })
            describe("with argument of different types", () => {
                const testCases = [
                    null,
                    undefined,
                    "2022-01-01T00:00:00.000Z",
                    true,
                    [],
                    function () {},
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
                        const result = t.Date.validate(testCase as any, [])
                        expect(result).toEqual([
                            {
                                context: [],
                                message: "Value is not a Date or a unix milliseconds timestamp",
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
                const flags = t.Date.flags
                expect(flags).toBe(8)
            })
        })

        describe("identifierAttribute", () => {
            // We don't have a way to set the identifierAttribute on a primitive type, so this should return undefined.
            test("returns undefined", () => {
                const identifierAttribute = t.Date.identifierAttribute
                // @ts-expect-error - we're testing the value of identifierAttribute and expect undefined here
                expect(identifierAttribute).toBe(undefined)
            })
        })
        describe("isType", () => {
            test("returns true", () => {
                const isType = t.Date.isType
                expect(isType).toBe(true)
            })
        })
        describe("name", () => {
            test('returns "Date"', () => {
                const name = t.Date.name
                expect(name).toBe("Date")
            })
        })
    })
    describe("instance", () => {
        describe("methods", () => {
            describe("aboutToDie", () => {
                it("calls the beforeDetach hook", () => {
                    const d = t.Date.instantiate(null, "", {}, new Date())
                    let called = false
                    d.registerHook(Hook.beforeDestroy, () => {
                        called = true
                    })
                    d.aboutToDie()
                    expect(called).toBe(true)
                })
            })
            describe("die", () => {
                it("kills the node", () => {
                    const d = t.Date.instantiate(null, "", {}, new Date())
                    d.die()
                    expect(d.isAlive).toBe(false)
                })
                it("should mark the node as dead", () => {
                    const d = t.Date.instantiate(null, "", {}, new Date())
                    d.die()
                    expect(d.state).toBe(NodeLifeCycle.DEAD)
                })
            })
            describe("finalizeCreation", () => {
                it("should mark the node as finalized", () => {
                    const d = t.Date.instantiate(null, "", {}, new Date())
                    d.finalizeCreation()
                    expect(d.state).toBe(NodeLifeCycle.FINALIZED)
                })
            })
            describe("finalizeDeath", () => {
                it("should mark the node as dead", () => {
                    const d = t.Date.instantiate(null, "", {}, new Date())
                    d.finalizeDeath()
                    expect(d.state).toBe(NodeLifeCycle.DEAD)
                })
            })
            describe("getReconciliationType", () => {
                it("should return the correct type", () => {
                    const d = t.Date.instantiate(null, "", {}, new Date())
                    const type = d.getReconciliationType()
                    expect(type).toBe(t.Date)
                })
            })
            describe("getSnapshot", () => {
                it("should return the value passed in with a number", () => {
                    const d = t.Date.instantiate(null, "", {}, 1701373349399)
                    const snapshot = d.getSnapshot()
                    expect(snapshot).toBe(1701373349399)
                })

                it("should return the correct date getTime value with a date object", () => {
                    const date = new Date("2022-01-01T00:00:00.000Z")
                    const d = t.Date.instantiate(null, "", {}, date)
                    const snapshot = d.getSnapshot()
                    const expected = date.getTime()
                    expect(snapshot).toBe(expected)
                })
            })
            describe("registerHook", () => {
                it("should register a hook and call it", () => {
                    const d = t.Date.instantiate(null, "", {}, new Date())
                    let called = false
                    d.registerHook(Hook.beforeDestroy, () => {
                        called = true
                    })

                    d.die()

                    expect(called).toBe(true)
                })
            })
            describe("setParent", () => {
                if (process.env.NODE_ENV !== "production") {
                    describe("with null", () => {
                        it("should throw an error", () => {
                            const d = t.Date.instantiate(null, "", {}, new Date())
                            expect(() => {
                                d.setParent(null, "foo")
                            }).toThrow()
                        })
                    })
                    describe("with a parent object", () => {
                        it("should throw an error", () => {
                            const Parent = t.model({
                                child: t.Date
                            })

                            const parent = Parent.create({ child: new Date() })

                            const d = t.Date.instantiate(null, "", {}, new Date())

                            expect(() => {
                                // @ts-ignore
                                d.setParent(parent, "bar")
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
