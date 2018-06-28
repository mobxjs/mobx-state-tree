let str = `// generated with ${__filename}\n`

const alfa = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

function withChars(amount, fn) {
    return alfa
        .substr(0, amount)
        .split("")
        .map(fn)
}
function getNames(char) {
    return `C${char}, S${char}, T${char}`
}
for (let i = 2; i < 10; i++) {
    str += `// prettier-ignore\nexport function union<${withChars(i, getNames).join(
        ", "
    )}>(dispatch: ITypeDispatcher, ${withChars(i, char => `${char}: IType<${getNames(char)}>`).join(
        ","
    )}): IType<${withChars(i, char => "C" + char).join(" | ")}, ${withChars(
        i,
        char => "S" + char
    ).join(" | ")}, ${withChars(i, char => "T" + char).join(
        " | "
    )}>\n// prettier-ignore\nexport function union<${withChars(i, getNames).join(
        ", "
    )}>(    ${withChars(i, char => `${char}: IType<${getNames(char)}>`).join(
        ","
    )}): IType<${withChars(i, char => "C" + char).join(" | ")}, ${withChars(
        i,
        char => "S" + char
    ).join(" | ")}, ${withChars(i, char => "T" + char).join(" | ")}>\n`
}
console.log(str)
