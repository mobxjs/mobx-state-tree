import { fail } from "../utils"
import { observable, IObservableArray } from "mobx"
import { IType } from "../types/type"
import { Node } from "./node"

export class IdentifierCache {
    private cache = observable.map<IObservableArray<Node>>()

    constructor() {}

    addNodeToCache(node: Node) {
        if (node.identifierAttribute) {
            const identifier = node.identifier!
            if (!this.cache.has(identifier)) {
                this.cache.set(identifier, observable.shallowArray<Node>())
            }
            const set = this.cache.get(identifier)!
            if (set.indexOf(node) !== -1) fail(`Already registered`)
            set.push(node)
        }
        return this
    }

    mergeCache(node: Node) {
        node.identifierCache!.cache.values().forEach(nodes =>
            nodes.forEach(child => {
                this.addNodeToCache(child)
            })
        )
    }

    notifyDied(node: Node) {
        if (node.identifierAttribute) {
            const set = this.cache.get(node.identifier!)
            if (set) set.remove(node)
        }
    }

    splitCache(node: Node): IdentifierCache {
        const res = new IdentifierCache()
        const basePath = node.path
        this.cache.values().forEach(nodes => {
            for (let i = nodes.length - 1; i >= 0; i--) {
                if (nodes[i].path.indexOf(basePath) === 0) {
                    res.addNodeToCache(nodes[i])
                    nodes.splice(i, 1)
                }
            }
        })
        return res
    }

    resolve(type: IType<any, any>, identifier: string): Node | null {
        const set = this.cache.get(identifier)
        if (!set) return null
        const matches = set.filter(candidate => type.isAssignableFrom(candidate.type))
        switch (matches.length) {
            case 0:
                return null
            case 1:
                return matches[0]
            default:
                return fail(
                    `Cannot resolve a reference to type '${type.name}' with id: '${identifier}' unambigously, there are multiple candidates: ${matches
                        .map(n => n.path)
                        .join(", ")}`
                )
        }
    }
}
