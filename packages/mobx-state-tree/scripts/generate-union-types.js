const { getDeclaration } = require("./generate-shared")

let str = `// generated with ${__filename}\n`

const minArgs = 2
const maxArgs = 10
const preParam = "options: UnionOptions, "
for (let i = minArgs; i < maxArgs; i++) {
    str += getDeclaration("union", "IModelType", ["P", "O", "C", "S", "T"], i, null, "|")
    str += getDeclaration("union", "IModelType", ["P", "O", "C", "S", "T"], i, preParam, "|")
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
