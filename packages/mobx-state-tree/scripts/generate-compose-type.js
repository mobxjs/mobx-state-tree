const { getDeclaration } = require("./generate-shared")

let str = `// generated with ${__filename}\n`

const minArgs = 2
const maxArgs = 10
const preParam = "name: string, "
for (let i = minArgs; i < maxArgs; i++) {
    str += getDeclaration("compose", "IModelType", ["P", "O"], i, preParam, "&")
    str += getDeclaration("compose", "IModelType", ["P", "O"], i, null, "&")
}

console.log(str)
