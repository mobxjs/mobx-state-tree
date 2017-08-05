import * as ts from "typescript"
import * as fs from "fs"

// given an import, returns if it imports the given module.
function createModuleImportMatcher(moduleName: string) {
    return (node: ts.Node): node is ts.ImportDeclaration =>
        ts.isImportDeclaration(node) &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        node.moduleSpecifier.text === moduleName
}

// given a node, a module name and an imported property, try to see if you are importing that property somehow and returnes a predicate that matches it
function createModulePropertyImportMatcher(moduleName: string, propertyName: string) {
    // matches only the correct module
    const isCorrectModuleImport = createModuleImportMatcher(moduleName)

    return (node: ts.Node): undefined | ((node: ts.Node) => boolean) => {
        // are we importing the correct module?
        if (!isCorrectModuleImport(node)) return undefined
        const importNode = node

        // import mst from "mobx-state-tree"
        if (!importNode.importClause.namedBindings) {
            return (node: ts.Node) => {
                if (!ts.isPropertyAccessExpression(node)) return false
                if (!ts.isIdentifier(node.name)) return false
                if (node.name.text !== propertyName) return false
                if (!ts.isIdentifier(node.expression)) return false
                if (node.expression.text !== importNode.importClause.name.text) return false
                return true
            }
        } else if (ts.isNamespaceImport(importNode.importClause.namedBindings)) {
            // import * as mst from "mobx-state-tree"
            const namespaceImport = <ts.NamespaceImport>importNode.importClause.namedBindings
            return (node: ts.Node) => {
                if (!ts.isPropertyAccessExpression(node)) return false
                if (!ts.isIdentifier(node.name)) return false
                if (node.name.text !== propertyName) return false
                if (!ts.isIdentifier(node.expression)) return false
                if (node.expression.text !== namespaceImport.name.text) return false
                return true
            }
        } else if (ts.isNamedImports(importNode.importClause.namedBindings)) {
            // import {types as t} from "mobx-state-tree"
            const namedImports = <ts.NamedImports>importNode.importClause.namedBindings
            for (let i = 0; i < namedImports.elements.length; i++) {
                const nameNode = namedImports.elements[i].propertyName
                    ? namedImports.elements[i].propertyName
                    : namedImports.elements[i].name
                const realNameNode = namedImports.elements[i].name
                if (nameNode.text === propertyName) {
                    return (node: ts.Node) => {
                        if (!ts.isIdentifier(node)) return false
                        if (node.text !== realNameNode.text) return false
                        return true
                    }
                }
            }
        }

        return undefined
    }
}

// given two matchers, combine them and matches if any passes
function combineMatchers(a: (node: ts.Node) => boolean, b: (node: ts.Node) => boolean) {
    return (node: ts.Node) => a(node) || b(node)
}

// is a property access?
function createPropertyAccessMatcher(
    expressionMatcher: (node: ts.Node) => boolean,
    propertyName: string
) {
    return (node: ts.Node) =>
        ts.isPropertyAccessExpression(node) &&
        expressionMatcher(node.expression) &&
        ts.isIdentifier(node.name) &&
        node.name.text === propertyName
}

// create a visitor that replace the this. with an identifier.
function createReplaceThisWithIdentifierVisitor(
    replacement: ts.Identifier,
    context: ts.TransformationContext
) {
    return function self(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.ThisKeyword) {
            return replacement
        }
        return ts.visitEachChild(node, self, context)
    }
}

// create a visitor that replace the this.action with its name.
function createReplaceThisActionWithIdentifierVisitor(
    actionNames: string[],
    context: ts.TransformationContext
) {
    return function self(node: ts.Node) {
        if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.name)) {
            if (
                actionNames.indexOf(node.name.text) > -1 &&
                node.expression.kind === ts.SyntaxKind.ThisKeyword
            ) {
                return node.name
            }
        }
        return ts.visitEachChild(node, self, context)
    }
}

// create a ParenthesizedExpression since TS doesn't have it! D:
function createParenthesizedExpression(expression: ts.Expression) {
    const node = <ts.ParenthesizedExpression>ts.createNode(ts.SyntaxKind.ParenthesizedExpression)
    node.expression = expression
    return node
}

// change the actual types.model signature
function modTypesModelCall(node: ts.CallExpression, context: ts.TransformationContext) {
    // a place for all the nodes
    let nameNode: null | ts.StringLiteral = null
    let propertiesNode: null | ts.ObjectLiteralExpression = null
    let stateNode: null | ts.ObjectLiteralExpression = null
    let actionsNode: null | ts.ObjectLiteralExpression = null

    for (let i = 0; i < node.arguments.length; i++) {
        const j = node.arguments[i]

        // is a model name?
        if (i === 0 && ts.isStringLiteral(j)) {
            nameNode = j
            continue
        }
        // is a properties node?
        if (!propertiesNode && ts.isObjectLiteralExpression(j)) {
            propertiesNode = j
            continue
        }
        // last is actions
        if (!actionsNode && i === node.arguments.length - 1 && ts.isObjectLiteralExpression(j)) {
            actionsNode = j
            continue
        }
        // any other is local state
        if (ts.isObjectLiteralExpression(j)) {
            stateNode = j
        }
    }

    // create the call
    let newCall = ts.createCall(node.expression, undefined, nameNode ? [nameNode] : [])

    // new properties node distinct between views and properties
    newCall.arguments.push(
        ts.createObjectLiteral(
            propertiesNode.properties.filter(property => ts.isPropertyAssignment(property)),
            true
        )
    )

    // are there views?
    if (propertiesNode) {
        const viewsNodes = propertiesNode.properties.filter(
            property => !ts.isPropertyAssignment(property)
        )
        if (viewsNodes.length > 0) {
            // new syntax uses self => {get computedProperty(){ }} instead of {get computedProperty(){}}
            // and this becomes self
            const computedGetNodes = propertiesNode.properties
                .map(node => (ts.isGetAccessorDeclaration(node) ? node : null))
                .filter(node => node !== null)
            const viewsNodes = propertiesNode.properties
                .map(node => (ts.isMethodDeclaration(node) ? node : null))
                .filter(node => node !== null)

            // now all will point to self
            const selfParam = ts.createIdentifier("self")

            // replace this with self in either views and gets
            const replaceThisVisitor = createReplaceThisWithIdentifierVisitor(selfParam, context)
            const newComputeds = computedGetNodes.map(node =>
                ts.visitNode(node, replaceThisVisitor)
            )
            const newViews = viewsNodes.map(node => ts.visitNode(node, replaceThisVisitor))

            // TODO: eventually handle circular dependencies
            const newObject = ts.createObjectLiteral([].concat(newComputeds).concat(newViews), true)
            const arrowFunction = ts.createArrowFunction(
                undefined,
                undefined,
                [ts.createParameter(undefined, undefined, undefined, selfParam)],
                undefined,
                undefined,
                createParenthesizedExpression(newObject)
            )
            newCall = ts.createCall(
                ts.createPropertyAccess(newCall, ts.createIdentifier("views")),
                undefined,
                [arrowFunction]
            )
        }
    }

    // are there any actions?
    if (actionsNode) {
        const actions = actionsNode.properties
            .map(node => (ts.isMethodDeclaration(node) ? node : null))
            .filter(node => node !== null)
        if (actions.length > 0) {
            // now all will point to self
            const selfParam = ts.createIdentifier("self")
            let stateVars: ts.VariableDeclarationList = null
            let givenActionNodes = actions

            // is there a state on the model?
            if (stateNode) {
                const stateProps = stateNode.properties
                    .map(node => (ts.isPropertyAssignment(node) ? node : null))
                    .filter(node => node !== null)
                if (stateProps.length > 0) {
                    stateVars = ts.createVariableDeclarationList(
                        stateProps.map(node =>
                            ts.createVariableDeclaration(
                                ts.isIdentifier(node.name)
                                    ? node.name
                                    : ts.createIdentifier("UNKNOWN"),
                                undefined,
                                node.initializer
                            )
                        )
                    )
                }

                // replace this.helloState with just "helloState"
                const knownStateNames = stateProps
                    .map(node => (ts.isIdentifier(node.name) ? node.name.text : null))
                    .filter(node => node !== null)
                const removeThisStateVisitor = createReplaceThisActionWithIdentifierVisitor(
                    knownStateNames,
                    context
                )
                givenActionNodes = givenActionNodes.map(node =>
                    ts.visitNode(node, removeThisStateVisitor)
                )
            }

            // get all known method names
            const knownMethodsNames = actions
                .map(node => (ts.isIdentifier(node.name) ? node.name : null))
                .filter(node => node !== null)
                .map(node => node.text)

            // replace this.methodName(...args) with just methodName(...args)
            const removeThisActionVisitor = createReplaceThisActionWithIdentifierVisitor(
                knownMethodsNames,
                context
            )
            const actionsWithoutThisDotAction = givenActionNodes.map(node =>
                ts.visitNode(node, removeThisActionVisitor)
            )

            // remove any this reference
            const replaceThisVisitor = createReplaceThisWithIdentifierVisitor(selfParam, context)
            const actionsWithoutThis = actionsWithoutThisDotAction.map(node =>
                ts.visitNode(node, replaceThisVisitor)
            )

            // transform method declaration to a function
            const actionsAsFunctions = actionsWithoutThis.map(node =>
                ts.createFunctionDeclaration(
                    node.decorators,
                    node.modifiers,
                    node.asteriskToken,
                    ts.isIdentifier(node.name) ? node.name.text : ts.createIdentifier("UNKNOWN"),
                    node.typeParameters,
                    node.parameters,
                    node.type,
                    node.body
                )
            )

            // create the return object
            const returnObjectProperties = actionsAsFunctions.map(node =>
                ts.createShorthandPropertyAssignment(node.name)
            )
            const returnObject = ts.createReturn(
                ts.createObjectLiteral(returnObjectProperties, true)
            )

            // create the new function body
            const fnBody = ts.createBlock(
                [...(stateVars ? [stateVars] : [] as any), ...actionsAsFunctions, returnObject],
                true
            )

            // create the return arrow function self => ({actions})
            const arrowFunction = ts.createArrowFunction(
                undefined,
                undefined,
                [ts.createParameter(undefined, undefined, undefined, selfParam)],
                undefined,
                undefined,
                fnBody
            )
            newCall = ts.createCall(
                ts.createPropertyAccess(newCall, ts.createIdentifier("actions")),
                undefined,
                [arrowFunction]
            )
        }
    }

    return newCall
}

function runCodemod(fileNames: string[], options: ts.CompilerOptions): void {
    const createMobxStateTreeMatcher = createModulePropertyImportMatcher("../src", "types")

    const transformer = <T extends ts.Node>(context: ts.TransformationContext) => (rootNode: T) => {
        // store the current sourceFile MST types matcher
        let isTypesNode: ((node: ts.Node) => boolean) = () => false
        let isTypesModelNode: ((node: ts.Node) => boolean) = () => false

        function visit(node: ts.Node): ts.Node {
            // is a MST types import?
            const typesMatcher = createMobxStateTreeMatcher(node)
            if (typesMatcher) {
                isTypesNode = combineMatchers(isTypesNode, typesMatcher)
                isTypesModelNode = createPropertyAccessMatcher(isTypesNode, "model")
            }

            // is this a types.model call?
            if (ts.isCallExpression(node)) {
                // ensure that we are using .model over the types
                const typesModel = node.expression
                if (isTypesModelNode(typesModel)) {
                    // ok, this is a types.model call! W00T!
                    return modTypesModelCall(node, context)
                }
            }

            return ts.visitEachChild(node, visit, context)
        }

        return ts.visitNode(rootNode, visit)
    }

    // run for each file
    for (const fileName of fileNames) {
        // create the file source
        const sourceFile = ts.createSourceFile(
            fileName,
            fs.readFileSync(fileName).toString(),
            ts.ScriptTarget.Latest
        )
        // make the AST transforms
        const transformed = ts.transform(sourceFile, [transformer])
        // output the code
        const printer = ts.createPrinter({
            newLine: ts.NewLineKind.LineFeed
        })
        const result = printer.printNode(
            ts.EmitHint.Unspecified,
            transformed.transformed[0],
            sourceFile
        )
        // copy the file to a backup
        fs.writeFileSync(fileName, result)
    }
}

// run from command line as
// node script.js file-to-codemod.js
// a new file with the suffix of .new will be created for you
runCodemod(process.argv.slice(2), { allowJs: true })
