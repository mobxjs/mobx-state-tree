import { resolve } from "path"
import { repositoryDirectory } from "./compiler"

// Model layering follows the existing #2230 regression, with multiple separate
// models to measure how compiler work grows as an application's model set grows.
export function layeredModels(count: number) {
    const file = resolve(__dirname, "generated-models.ts")
    let source = 'import { types, type Instance } from "../../src"\n'
    for (let model = 0; model < count; model++) {
        source += `const M${model} = types.model({ value: 0 })\n`
        for (let layer = 0; layer < 10; layer++) {
            source += `.props({ p${layer}: "", n${layer}: 0, b${layer}: false })\n`
        }
        source += `.volatile(() => ({ temporary: 0 }))\n`
        source += `.views(self => ({ get label() { return self.p0 + self.value } }))\n`
        source += `.actions(self => ({ setValue(value: number) { self.value = value } }))\n`
        source += `interface I${model} extends Instance<typeof M${model}> {}\n`
        source += `const v${model}: I${model} = M${model}.create({})\n`
        source += `M${model}.create(v${model})\n`
        source += `const label${model}: string = v${model}.label\n`
    }
    return { entryPoints: [file], files: { [file]: source } }
}

export const deepInference = {
    entryPoints: [resolve(repositoryDirectory, "__tests__/core/2230.test.ts")]
}
