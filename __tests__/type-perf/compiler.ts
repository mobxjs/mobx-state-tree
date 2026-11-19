import { resolve } from "path"
import { performance } from "perf_hooks"
import * as ts from "typescript"

export const fixtureDirectory = resolve(__dirname, "../core/fixtures/circular-type-imports")
export const repositoryDirectory = resolve(__dirname, "../..")

type Declaration = "current" | "legacy" | "snapshot"

// Use the same compiler, options and files for each declaration. Replacing only
// create in memory keeps comparisons independent of Git state or emitted files.
export function compileTypes(
    entryPoints: string[],
    declaration: Declaration = "current",
    files: Record<string, string> = {}
) {
    const configPath = resolve(repositoryDirectory, "__tests__/tsconfig.json")
    const config = ts.readConfigFile(configPath, ts.sys.readFile)
    if (config.error)
        throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"))
    const { options, errors } = ts.parseJsonConfigFileContent(
        config.config,
        ts.sys,
        resolve(repositoryDirectory, "__tests__")
    )
    if (errors.length)
        throw new Error(
            ts.formatDiagnosticsWithColorAndContext(errors, {
                getCurrentDirectory: ts.sys.getCurrentDirectory,
                getCanonicalFileName: file => file,
                getNewLine: () => "\n"
            })
        )

    const typeFile = resolve(repositoryDirectory, "src/core/type/type.ts")
    const host = ts.createCompilerHost(options)
    const readFile = host.readFile.bind(host)
    const fileExists = host.fileExists.bind(host)
    host.fileExists = file =>
        resolve(file) in files || fileExists(file) || fileExists(`${file}.txt`)
    host.readFile = file => {
        let text = files[resolve(file)] ?? readFile(file) ?? readFile(`${file}.txt`)
        if (resolve(file) === typeFile && text && declaration !== "current") {
            const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest)
            const type = source.statements.find(
                (statement): statement is ts.InterfaceDeclaration =>
                    ts.isInterfaceDeclaration(statement) && statement.name.text === "IType"
            )!
            const creates = type.members.filter(member => member.name?.getText(source) === "create")
            const input = declaration === "legacy" ? "C | ExcludeReadonly<T>" : "C"
            text = `${text.slice(0, creates[0].getStart(source))}create(snapshot?: ${input}, env?: any): this["Type"]${text.slice(creates[creates.length - 1].end)}`
            if (declaration === "legacy") {
                text +=
                    '\ntype ExcludeReadonly<T> = T extends {} ? T[import("ts-essentials").WritableKeys<T>] : T\n'
            }
        }
        return text
    }

    const started = performance.now()
    const program = ts.createProgram(entryPoints, options, host)
    const diagnostics = ts.getPreEmitDiagnostics(program)
    return {
        diagnostics: diagnostics.map(diagnostic => ({
            code: diagnostic.code,
            file: diagnostic.file?.fileName,
            line:
                diagnostic.file && diagnostic.start !== undefined
                    ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1
                    : undefined,
            message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
        })),
        types: program.getTypeCount(),
        instantiations: program.getInstantiationCount(),
        elapsedMs: performance.now() - started
    }
}
