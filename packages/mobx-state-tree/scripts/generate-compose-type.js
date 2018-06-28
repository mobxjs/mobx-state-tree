let all = `// generated with ${__filename}\n`

for (let i = 2; i < 10; i++) {
    let s = "// prettier-ignore\nexport function compose<"
    for (let j = 1; j <= i; j++) s += `T${j} extends ModelProperties, S${j}, `
    s = drop(s, 2)
    s += ">("
    for (let j = 1; j <= i; j++) s += `t${j}: IModelType<T${j}, S${j}>, `
    s = drop(s, 2)
    s += "): IModelType<"
    for (let j = 1; j <= i; j++) s += `T${j} & `
    s = drop(s, 3)
    s += ", "
    for (let j = 1; j <= i; j++) s += `S${j} & `
    s = drop(s, 3)
    s += ">\n"
    all += s
}

function drop(str, nr) {
    return str.substr(0, str.length - nr)
}

console.log(all)
