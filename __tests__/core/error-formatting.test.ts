import { describe, expect, test, beforeEach, afterEach } from "bun:test"
import { types, typecheck, setErrorFormatting, getErrorFormatting } from "../../src"
import { prettyPrintDescription } from "../../src/core/type/type-checker"

// The opt-in error formatting is global state, so snapshot it before each test
// and restore it afterwards to keep tests isolated.
let saved: ReturnType<typeof getErrorFormatting>
beforeEach(() => {
    saved = getErrorFormatting()
})
afterEach(() => {
    setErrorFormatting(saved)
})

// typecheck() always runs (regardless of dev/production), so these tests are
// deterministic in every environment.
function messageOf(fn: () => void): string {
    try {
        fn()
        throw new Error("expected the call to throw, but it did not")
    } catch (e) {
        return (e as Error).message
    }
}

const bigSnapshot = {
    items: Array.from({ length: 25 }).map((_, i) => ({ id: i, label: "item" })),
    note: "x".repeat(400)
}

describe("setErrorFormatting / getErrorFormatting", () => {
    test("is disabled by default with documented defaults", () => {
        expect(getErrorFormatting()).toEqual({
            enabled: false,
            indent: 2,
            maxStringLength: 100,
            maxArrayLength: 10,
            maxPropertyCount: 30,
            maxDepth: 5
        })
    })

    test("merges partial options over the current ones", () => {
        setErrorFormatting({ enabled: true })
        expect(getErrorFormatting().enabled).toBe(true)
        // untouched fields keep their previous values
        expect(getErrorFormatting().indent).toBe(2)

        setErrorFormatting({ maxArrayLength: 2 })
        expect(getErrorFormatting().enabled).toBe(true) // still on
        expect(getErrorFormatting().maxArrayLength).toBe(2)
    })

    test("getErrorFormatting returns a copy, not the internal object", () => {
        const a = getErrorFormatting()
        a.enabled = true
        expect(getErrorFormatting().enabled).toBe(false)
    })
})

describe("default (disabled) formatting is unchanged", () => {
    const Model = types.model("Model", { x: types.number })

    test("small values render compactly on a single line", () => {
        expect(messageOf(() => typecheck(Model, { x: "nope" } as any))).toBe(
            '[mobx-state-tree] Error while converting `{"x":"nope"}` to `Model`:\n\n    at path "/x" value `"nope"` is not assignable to type: `number` (Value is not a number).'
        )
    })

    test("large values stay on one line and keep the 280-char cap", () => {
        const message = messageOf(() => typecheck(Model, bigSnapshot as any))
        const header = message.split("\n")[0]
        // single-line JSON: no pretty-printing newlines in the header value
        expect(header).toContain('Error while converting `{"items":')
        // shortenPrintValue still caps the header value
        expect(header).toContain("......")
        // no truncation markers from the opt-in formatter
        expect(message).not.toContain("more items")
        expect(message).not.toContain("more characters")
    })

    test("type shapes stay on a single line", () => {
        const message = messageOf(() => typecheck(Model, { x: "nope" } as any))
        expect(message).not.toContain("a snapshot like `{\n")
    })
})

describe("enabled formatting (multi-line)", () => {
    const Model = types.model("Model", { x: types.number })

    beforeEach(() => setErrorFormatting({ enabled: true }))

    test("large values are pretty-printed across lines and truncated", () => {
        const message = messageOf(() => typecheck(Model, bigSnapshot as any))
        expect(message).toContain("Error while converting `{\n")
        expect(message).toContain('\n  "items": [')
        // array capped at maxArrayLength (default 10) -> 15 omitted
        expect(message).toContain("… 15 more items")
        // long string clipped at maxStringLength (default 100) -> 300 omitted
        expect(message).toContain("… (300 more characters)")
    })

    test("maxArrayLength is configurable", () => {
        setErrorFormatting({ maxArrayLength: 2 })
        const message = messageOf(() => typecheck(Model, bigSnapshot as any))
        expect(message).toContain("… 23 more items")
    })

    test("indent controls the indentation width", () => {
        setErrorFormatting({ indent: 4 })
        const message = messageOf(() => typecheck(Model, bigSnapshot as any))
        expect(message).toContain('\n    "items": [')
    })
})

describe("enabled formatting with indent: 0 (truncate only, no whitespace)", () => {
    const Model = types.model("Model", { x: types.number })

    beforeEach(() => setErrorFormatting({ enabled: true, indent: 0 }))

    test("values are truncated but stay on a single line", () => {
        const message = messageOf(() => typecheck(Model, bigSnapshot as any))
        const header = message.split("\n")[0]
        // truncation happened...
        expect(header).toContain("more items")
        expect(header).toContain("more characters)")
        // ...but no pretty-printing newlines were introduced in the value
        expect(header).toContain('Error while converting `{"items":[')
    })

    test("type shapes stay on a single line too", () => {
        const Outer = types.model("Outer", {
            a: types.number,
            b: types.number,
            c: types.number
        })
        const message = messageOf(() => typecheck(types.maybe(Outer), { wrong: true } as any))
        expect(message).not.toContain("a snapshot like `({\n")
        expect(message).toContain("a: number; b: number; c: number")
    })
})

describe("enabled formatting of the type shape", () => {
    beforeEach(() => setErrorFormatting({ enabled: true }))

    test("long model shapes are re-indented across lines", () => {
        const Inner = types.model("Inner", {
            first: types.number,
            second: types.number
        })
        const Outer = types.model("Outer", {
            min_password_length: types.number,
            max_upload_size: types.number,
            inner: Inner
        })
        const message = messageOf(() => typecheck(types.maybe(Outer), { wrong: true } as any))
        expect(message).toContain("a snapshot like `({\n")
        expect(message).toContain("\n  min_password_length: number;\n")
        // nested model shapes are indented further
        expect(message).toContain("\n  inner: {\n")
    })
})

describe("prettyPrintDescription", () => {
    test("returns the description unchanged when indentSize <= 0", () => {
        expect(prettyPrintDescription("{ a: number; b: string }", 0)).toBe(
            "{ a: number; b: string }"
        )
        expect(prettyPrintDescription("{ a: number; b: string }", -2)).toBe(
            "{ a: number; b: string }"
        )
    })

    test("breaks model shapes onto multiple lines using indentSize", () => {
        expect(prettyPrintDescription("{ a: number; b: string }", 2)).toBe(
            "{\n  a: number;\n  b: string\n}"
        )
        expect(prettyPrintDescription("{ a: number }", 4)).toBe("{\n    a: number\n}")
    })

    test("leaves union and array parts inline", () => {
        expect(prettyPrintDescription("(string | number)", 2)).toBe("(string | number)")
        expect(prettyPrintDescription("number[]", 2)).toBe("number[]")
    })

    test("does not break separators that live inside string literals", () => {
        const output = prettyPrintDescription('{ kind: "a;b;c"; value: number }', 2)
        expect(output).toContain('"a;b;c"')
        expect(output).not.toContain('"a;\n')
    })

    test("never throws and never loses non-whitespace characters", () => {
        const adversarial = [
            "",
            "}}}}", // over-closed: depth would go negative
            "{".repeat(40), // never-closed
            '{ a: "deeply;{}nested"; b: number }',
            '{ a: "ends with backslash\\\\"; b: number }',
            "{ a: 'single quoted; with } brace'; b: number }",
            "(({{[[ unbalanced garbage ]]}}))",
            "\u{1f600}{ a: number; b: number }",
            "{ a: { b: { c: { d: { e: number } } } } }"
        ]
        for (const input of adversarial) {
            let output = ""
            expect(() => (output = prettyPrintDescription(input, 2))).not.toThrow()
            // formatting only adds/removes whitespace, so stripping it is lossless
            expect(output.replace(/\s/g, "")).toBe(input.replace(/\s/g, ""))
        }
    })
})
