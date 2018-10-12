const { getDeclaration } = require("./generate-shared")

let str = `// generated with ${__filename}\n`

const minArgs = 2
const maxArgs = 10
const preParam = "options: UnionOptions, "
const returnTypeTransform = rt => {
    // [[PA, PB], [OA, OB]]
    // -> [[ModelCreationType<PA>, ModelCreationType<PB>], [ModelSnapshotType<PA>, ModelSnapshotType<PB>], [ModelInstanceType<PA, OA>, ModelInstanceType<PB, OB]]
    const props = rt[0]
    const others = rt[1]

    const c = [],
        s = [],
        t = []
    for (let i = 0; i < props.length; i++) {
        const p = props[i]
        const o = others[i]

        c.push(`ModelCreationType<${p}>`)
        s.push(`ModelSnapshotType<${p}>`)
        t.push(`ModelInstanceType<${p}, ${o}>`)
    }
    return [c, s, t]
}
for (let i = minArgs; i < maxArgs; i++) {
    str += getDeclaration(
        "union",
        "IModelType",
        ["P", "O"],
        i,
        null,
        "|",
        "IComplexType",
        returnTypeTransform
    )
    str += getDeclaration(
        "union",
        "IModelType",
        ["P", "O"],
        i,
        preParam,
        "|",
        "IComplexType",
        returnTypeTransform
    )
}
for (let i = minArgs; i < maxArgs; i++) {
    str += getDeclaration("union", "IComplexType", ["C", "S", "T"], i, null, "|")
    str += getDeclaration("union", "IComplexType", ["C", "S", "T"], i, preParam, "|")
}
for (let i = minArgs; i < maxArgs; i++) {
    str += getDeclaration("union", "IType", ["C", "S", "T"], i, null, "|")
    str += getDeclaration("union", "IType", ["C", "S", "T"], i, preParam, "|")
}

console.log(str)
