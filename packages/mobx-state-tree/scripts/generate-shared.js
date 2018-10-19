const alfa = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

function getTemplateVar(templateVar, argNumber) {
    return `${templateVar}${alfa[argNumber]}`
}

function getTemplateVars(templateVars, argNumber) {
    return templateVars.map(tv => getTemplateVar(tv, argNumber))
}

exports.getDeclaration = function getDeclaration(
    funcName,
    type,
    templateVars,
    args,
    preParam,
    operationChar,
    outType = type,
    allReturnTypesTransform = x => x
) {
    let str = "// prettier-ignore\n"

    let allTemplateVars = []
    for (let i = 0; i < args; i++) {
        allTemplateVars = allTemplateVars.concat(getTemplateVars(templateVars, i))
    }
    allTemplateVars = allTemplateVars.map(
        tv => (tv.startsWith("P") ? `${tv} extends ModelProperties` : tv)
    )
    str += `export function ${funcName}<${allTemplateVars.join(", ")}>(`

    if (preParam) {
        str += preParam
    }

    const allParams = []
    for (let i = 0; i < args; i++) {
        allParams.push(`${alfa[i]}: ${type}<${getTemplateVars(templateVars, i).join(", ")}>`)
    }
    str += `${allParams.join(", ")}`
    str += ")"

    let allReturnTypes = []
    for (const templateVar of templateVars) {
        let union = []
        for (let i = 0; i < args; i++) {
            union.push(getTemplateVar(templateVar, i))
        }
        allReturnTypes.push(union)
    }
    allReturnTypes = allReturnTypesTransform(allReturnTypes)
    str += `: ${outType}<${allReturnTypes.map(u => u.join(` ${operationChar} `)).join(", ")}>`

    return str + "\n"
}
