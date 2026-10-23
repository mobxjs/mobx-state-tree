import { readFileSync } from "fs"
import { join } from "path"
import * as ts from "typescript"
import { expect, test } from "bun:test"

// A node is created for every model instance and every property value. In the published build
// each node should get all of its fields, in the same order, during construction: a field that
// is added later (an atom, a listener, a cached value) gives V8 another hidden class, and code
// that reads nodes of many shapes gets slower. Bun transpiles src/ itself and ignores
// `useDefineForClassFields`, so this test compiles the node classes with the project's options.
const root = join(__dirname, "../..")
const tsconfig = ts.readConfigFile(join(root, "tsconfig.json"), ts.sys.readFile)
const { options } = ts.convertCompilerOptionsFromJson(tsconfig.config.compilerOptions, root)

function parseClass(file: string, text: string, name: string) {
    const source = ts.createSourceFile(file, text, options.target!, true)
    return source.statements.find(
        (s): s is ts.ClassDeclaration => ts.isClassDeclaration(s) && s.name?.text === name
    )!
}

// the names of `this.x = ...` and `this.x(...)` statements in a constructor or method body
function thisStatements(body: ts.Block | undefined) {
    const assigned: string[] = []
    const called: string[] = []
    for (const s of body?.statements ?? []) {
        if (!ts.isExpressionStatement(s)) continue
        const e = s.expression
        const name = (target: ts.Expression) =>
            ts.isPropertyAccessExpression(target) &&
            target.expression.kind === ts.SyntaxKind.ThisKeyword
                ? [target.name.text]
                : []
        if (ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.EqualsToken)
            assigned.push(...name(e.left))
        if (ts.isCallExpression(e)) called.push(...name(e.expression))
    }
    return { assigned, called }
}

test.each([
    ["src/core/node/BaseNode.ts", "BaseNode"],
    ["src/core/node/object-node.ts", "ObjectNode"]
])("%s: the %s constructor assigns every field it declares", (file, className) => {
    const text = readFileSync(join(root, file), "utf8")
    const declared = parseClass(file, text, className)
        .members.filter(ts.isPropertyDeclaration)
        .filter(m => !ts.getModifiers(m)?.some(mod => mod.kind === ts.SyntaxKind.DeclareKeyword))
        .map(m => m.name.getText())

    const output = ts.transpileModule(text, { compilerOptions: options, fileName: file }).outputText
    const members = parseClass(file, output, className).members
    const ctor = thisStatements(members.find(ts.isConstructorDeclaration)!.body)
    // also count the methods that the constructor calls, such as BaseNode.baseSetParent
    const assigned = ctor.assigned.concat(
        ...ctor.called.map(
            method =>
                thisStatements(
                    members.find(
                        (m): m is ts.MethodDeclaration =>
                            ts.isMethodDeclaration(m) && m.name.getText() === method
                    )?.body
                ).assigned
        )
    )

    expect(declared.filter(name => !assigned.includes(name))).toEqual([])
})
