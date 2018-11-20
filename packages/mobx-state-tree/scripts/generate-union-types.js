const { getDeclaration } = require("./generate-shared")

let str = `// generated with ${__filename}\n`

const minArgs = 2
const maxArgs = 10
const preParam = "options: UnionOptions, "
const modelReturnTypeTransform = rt => {
    // [['PA', 'PB'], ['OA', 'OB'], ['FCA', 'FCB'], ['FSA', 'FSB']]
    // ->
    // [['ModelCreationType2<PA, FCA>', 'ModelCreationType2<PB, FCB>>'],
    //  ['ModelSnapshotType2<PA, FSA>',  'ModelSnapshotType2<PB, FSB>>'],
    //  ['ModelInstanceType<PA, OA, FCA, FSA>', 'ModelInstanceType<PB, OB, FCB, FSB']]
    const [props, others, fixedC, fixedS] = rt

    const c = [],
        s = [],
        t = []
    for (let i = 0; i < props.length; i++) {
        const p = props[i]
        const o = others[i]
        const fc = fixedC[i]
        const fs = fixedS[i]

        c.push(`ModelCreationType2<${p}, ${fc}>`)
        s.push(`ModelSnapshotType2<${p}, ${fs}>`)
        t.push(`ModelInstanceType<${p}, ${o}, ${fc}, ${fs}>`)
    }
    return [c, s, t]
}

for (let i = minArgs; i < maxArgs; i++) {
    str += getDeclaration(
        "union",
        "IModelType",
        ["P", "O", "FC", "FS"],
        i,
        null,
        "|",
        "ITypeUnion",
        modelReturnTypeTransform
    )
    str += getDeclaration(
        "union",
        "IModelType",
        ["P", "O", "FC", "FS"],
        i,
        preParam,
        "|",
        "ITypeUnion",
        modelReturnTypeTransform
    )
}

for (let i = minArgs; i < maxArgs; i++) {
    str += getDeclaration("union", "IType", ["C", "S", "T"], i, null, "|", "ITypeUnion", undefined)
    str += getDeclaration(
        "union",
        "IType",
        ["C", "S", "T"],
        i,
        preParam,
        "|",
        "ITypeUnion",
        undefined
    )
}

console.log(str)
