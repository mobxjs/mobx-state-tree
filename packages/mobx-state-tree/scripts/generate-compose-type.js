const { getDeclaration } = require("./generate-shared")

let str = `// generated with ${__filename}\n`

const minArgs = 2
const maxArgs = 10
const preParam = "name: string, "

const returnTypeTransform = rt => {
    // [['PA', 'PB', 'PC'], ['OA', 'OB', 'OC'], ['FCA', 'FCB', 'FCC'], ['FSA', 'FSB', 'FSC']]
    // ->
    // [['PA', 'PB', 'PC'], no change
    //  ['OA', 'OB', 'OC'], no change
    //  ['FixedJoin<FCA, FixedJoin<FCB, FCC>>']
    //  ['FixedJoin<FSA, FixedJoin<FSB, FSC>>']]

    const [props, others, fixedC, fixedS] = rt

    function fixJoin(left) {
        if (left.length === 1) {
            return left[0]
        }
        const [a, ...rest] = left
        return `FixedJoin<${a}, ${fixJoin(rest)}>`
    }

    return [props, others, [fixJoin(fixedC)], [fixJoin(fixedS)]]
}

for (let i = minArgs; i < maxArgs; i++) {
    str += getDeclaration(
        "compose",
        "IModelType",
        ["P", "O", "FC", "FS"],
        i,
        preParam,
        "&",
        "IModelType",
        returnTypeTransform
    )
    str += getDeclaration(
        "compose",
        "IModelType",
        ["P", "O", "FC", "FS"],
        i,
        null,
        "&",
        "IModelType",
        returnTypeTransform
    )
}

console.log(str)
