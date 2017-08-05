"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
var ts = require("typescript")
var fs = require("fs")
// given an import, returns if it imports the given module.
function createModuleImportMatcher(moduleName) {
    return function(node) {
        return (
            ts.isImportDeclaration(node) &&
            ts.isStringLiteral(node.moduleSpecifier) &&
            node.moduleSpecifier.text === moduleName
        )
    }
}
// given a node, a module name and an imported property, try to see if you are importing that property somehow and returnes a predicate that matches it
function createModulePropertyImportMatcher(moduleName, propertyName) {
    // matches only the correct module
    var isCorrectModuleImport = createModuleImportMatcher(moduleName)
    return function(node) {
        // are we importing the correct module?
        if (!isCorrectModuleImport(node)) return undefined
        var importNode = node
        // import mst from "mobx-state-tree"
        if (!importNode.importClause.namedBindings) {
            return function(node) {
                if (!ts.isPropertyAccessExpression(node)) return false
                if (!ts.isIdentifier(node.name)) return false
                if (node.name.text !== propertyName) return false
                if (!ts.isIdentifier(node.expression)) return false
                if (node.expression.text !== importNode.importClause.name.text) return false
                return true
            }
        } else if (ts.isNamespaceImport(importNode.importClause.namedBindings)) {
            // import * as mst from "mobx-state-tree"
            var namespaceImport_1 = importNode.importClause.namedBindings
            return function(node) {
                if (!ts.isPropertyAccessExpression(node)) return false
                if (!ts.isIdentifier(node.name)) return false
                if (node.name.text !== propertyName) return false
                if (!ts.isIdentifier(node.expression)) return false
                if (node.expression.text !== namespaceImport_1.name.text) return false
                return true
            }
        } else if (ts.isNamedImports(importNode.importClause.namedBindings)) {
            // import {types as t} from "mobx-state-tree"
            var namedImports = importNode.importClause.namedBindings
            var _loop_1 = function(i) {
                var nameNode = namedImports.elements[i].propertyName
                    ? namedImports.elements[i].propertyName
                    : namedImports.elements[i].name
                var realNameNode = namedImports.elements[i].name
                if (nameNode.text === propertyName) {
                    return {
                        value: function(node) {
                            if (!ts.isIdentifier(node)) return false
                            if (node.text !== realNameNode.text) return false
                            return true
                        }
                    }
                }
            }
            for (var i = 0; i < namedImports.elements.length; i++) {
                var state_1 = _loop_1(i)
                if (typeof state_1 === "object") return state_1.value
            }
        }
        return undefined
    }
}
// given two matchers, combine them and matches if any passes
function combineMatchers(a, b) {
    return function(node) {
        return a(node) || b(node)
    }
}
// is a property access?
function createPropertyAccessMatcher(expressionMatcher, propertyName) {
    return function(node) {
        return (
            ts.isPropertyAccessExpression(node) &&
            expressionMatcher(node.expression) &&
            ts.isIdentifier(node.name) &&
            node.name.text === propertyName
        )
    }
}
// create a visitor that replace the this. with an identifier.
function createReplaceThisWithIdentifierVisitor(replacement, context) {
    return function self(node) {
        if (node.kind === ts.SyntaxKind.ThisKeyword) {
            return replacement
        }
        return ts.visitEachChild(node, self, context)
    }
}
// create a visitor that replace the this.action with its name.
function createReplaceThisActionWithIdentifierVisitor(actionNames, context) {
    return function self(node) {
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
function createParenthesizedExpression(expression) {
    var node = ts.createNode(ts.SyntaxKind.ParenthesizedExpression)
    node.expression = expression
    return node
}
// change the actual types.model signature
function modTypesModelCall(node, context) {
    // a place for all the nodes
    var nameNode = null
    var propertiesNode = null
    var stateNode = null
    var actionsNode = null
    for (var i = 0; i < node.arguments.length; i++) {
        var j = node.arguments[i]
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
    var newCall = ts.createCall(node.expression, undefined, nameNode ? [nameNode] : [])
    // new properties node distinct between views and properties
    newCall.arguments.push(
        ts.createObjectLiteral(
            propertiesNode.properties.filter(function(property) {
                return ts.isPropertyAssignment(property)
            }),
            true
        )
    )
    // are there views?
    if (propertiesNode) {
        var viewsNodes = propertiesNode.properties.filter(function(property) {
            return !ts.isPropertyAssignment(property)
        })
        if (viewsNodes.length > 0) {
            // new syntax uses self => {get computedProperty(){ }} instead of {get computedProperty(){}}
            // and this becomes self
            var computedGetNodes = propertiesNode.properties
                .map(function(node) {
                    return ts.isGetAccessorDeclaration(node) ? node : null
                })
                .filter(function(node) {
                    return node !== null
                })
            var viewsNodes_1 = propertiesNode.properties
                .map(function(node) {
                    return ts.isMethodDeclaration(node) ? node : null
                })
                .filter(function(node) {
                    return node !== null
                })
            // now all will point to self
            var selfParam = ts.createIdentifier("self")
            // replace this with self in either views and gets
            var replaceThisVisitor_1 = createReplaceThisWithIdentifierVisitor(selfParam, context)
            var newComputeds = computedGetNodes.map(function(node) {
                return ts.visitNode(node, replaceThisVisitor_1)
            })
            var newViews = viewsNodes_1.map(function(node) {
                return ts.visitNode(node, replaceThisVisitor_1)
            })
            // TODO: eventually handle circular dependencies
            var newObject = ts.createObjectLiteral([].concat(newComputeds).concat(newViews), true)
            var arrowFunction = ts.createArrowFunction(
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
        var actions = actionsNode.properties
            .map(function(node) {
                return ts.isMethodDeclaration(node) ? node : null
            })
            .filter(function(node) {
                return node !== null
            })
        if (actions.length > 0) {
            // now all will point to self
            var selfParam = ts.createIdentifier("self")
            var stateVars = null
            var givenActionNodes = actions
            // is there a state on the model?
            if (stateNode) {
                var stateProps = stateNode.properties
                    .map(function(node) {
                        return ts.isPropertyAssignment(node) ? node : null
                    })
                    .filter(function(node) {
                        return node !== null
                    })
                if (stateProps.length > 0) {
                    stateVars = ts.createVariableDeclarationList(
                        stateProps.map(function(node) {
                            return ts.createVariableDeclaration(
                                ts.isIdentifier(node.name)
                                    ? node.name
                                    : ts.createIdentifier("UNKNOWN"),
                                undefined,
                                node.initializer
                            )
                        })
                    )
                }
                // replace this.helloState with just "helloState"
                var knownStateNames = stateProps
                    .map(function(node) {
                        return ts.isIdentifier(node.name) ? node.name.text : null
                    })
                    .filter(function(node) {
                        return node !== null
                    })
                var removeThisStateVisitor_1 = createReplaceThisActionWithIdentifierVisitor(
                    knownStateNames,
                    context
                )
                givenActionNodes = givenActionNodes.map(function(node) {
                    return ts.visitNode(node, removeThisStateVisitor_1)
                })
            }
            // get all known method names
            var knownMethodsNames = actions
                .map(function(node) {
                    return ts.isIdentifier(node.name) ? node.name : null
                })
                .filter(function(node) {
                    return node !== null
                })
                .map(function(node) {
                    return node.text
                })
            // replace this.methodName(...args) with just methodName(...args)
            var removeThisActionVisitor_1 = createReplaceThisActionWithIdentifierVisitor(
                knownMethodsNames,
                context
            )
            var actionsWithoutThisDotAction = givenActionNodes.map(function(node) {
                return ts.visitNode(node, removeThisActionVisitor_1)
            })
            // remove any this reference
            var replaceThisVisitor_2 = createReplaceThisWithIdentifierVisitor(selfParam, context)
            var actionsWithoutThis = actionsWithoutThisDotAction.map(function(node) {
                return ts.visitNode(node, replaceThisVisitor_2)
            })
            // transform method declaration to a function
            var actionsAsFunctions = actionsWithoutThis.map(function(node) {
                return ts.createFunctionDeclaration(
                    node.decorators,
                    node.modifiers,
                    node.asteriskToken,
                    ts.isIdentifier(node.name) ? node.name.text : ts.createIdentifier("UNKNOWN"),
                    node.typeParameters,
                    node.parameters,
                    node.type,
                    node.body
                )
            })
            // create the return object
            var returnObjectProperties = actionsAsFunctions.map(function(node) {
                return ts.createShorthandPropertyAssignment(node.name)
            })
            var returnObject = ts.createReturn(ts.createObjectLiteral(returnObjectProperties, true))
            // create the new function body
            var fnBody = ts.createBlock(
                (stateVars ? [stateVars] : []).concat(actionsAsFunctions, [returnObject]),
                true
            )
            // create the return arrow function self => ({actions})
            var arrowFunction = ts.createArrowFunction(
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
function runCodemod(fileNames, options) {
    var createMobxStateTreeMatcher = createModulePropertyImportMatcher("../src", "types")
    var transformer = function(context) {
        return function(rootNode) {
            // store the current sourceFile MST types matcher
            var isTypesNode = function() {
                return false
            }
            var isTypesModelNode = function() {
                return false
            }
            function visit(node) {
                // is a MST types import?
                var typesMatcher = createMobxStateTreeMatcher(node)
                if (typesMatcher) {
                    isTypesNode = combineMatchers(isTypesNode, typesMatcher)
                    isTypesModelNode = createPropertyAccessMatcher(isTypesNode, "model")
                }
                // is this a types.model call?
                if (ts.isCallExpression(node)) {
                    // ensure that we are using .model over the types
                    var typesModel = node.expression
                    if (isTypesModelNode(typesModel)) {
                        // ok, this is a types.model call! W00T!
                        return modTypesModelCall(node, context)
                    }
                }
                return ts.visitEachChild(node, visit, context)
            }
            return ts.visitNode(rootNode, visit)
        }
    }
    // run for each file
    for (var _i = 0, fileNames_1 = fileNames; _i < fileNames_1.length; _i++) {
        var fileName = fileNames_1[_i]
        // create the file source
        var sourceFile = ts.createSourceFile(
            fileName,
            fs.readFileSync(fileName).toString(),
            ts.ScriptTarget.Latest
        )
        // make the AST transforms
        var transformed = ts.transform(sourceFile, [transformer])
        // output the code
        var printer = ts.createPrinter({
            newLine: ts.NewLineKind.LineFeed
        })
        var result = printer.printNode(
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
