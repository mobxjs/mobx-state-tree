const { getDeclaration } = require("./generate-shared")

let str = `// generated with ${__filename}\n`

const minArgs = 2
const maxArgs = 10
const preParam = "name: string, "

const returnTypeTransform = (rt) => {
  // [['PA', 'PB', 'PC'], ['OA', 'OB', 'OC'], ['FCA', 'FCB', 'FCC'], ['FSA', 'FSB', 'FSC']]
  // ->
  // [['PA', 'PB', 'PC'], no change
  //  ['OA', 'OB', 'OC'], no change
  //  ['_CustomJoin<FCA, _CustomJoin<FCB, FCC>>']
  //  ['_CustomJoin<FSA, _CustomJoin<FSB, FSC>>']]

  const [props, others, fixedC, fixedS] = rt

  function customJoin(left) {
    if (left.length === 1) {
      return left[0]
    }
    const [a, ...rest] = left
    return `_CustomJoin<${a}, ${customJoin(rest)}>`
  }

  return [props, others, [customJoin(fixedC)], [customJoin(fixedS)]]
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
