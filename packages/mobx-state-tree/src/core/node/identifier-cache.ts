import { IObservableArray, values, observable } from "mobx"
import { fail, IType, ObjectNode, mobxShallow, IAnyType } from "../../internal"

export class IdentifierCache {
    // n.b. in cache all identifiers are normalized to strings
    private cache = observable.map<string, IObservableArray<ObjectNode>>()

    constructor() {}

    addNodeToCache(node: ObjectNode) {
        if (node.identifierAttribute) {
            const identifier = node.identifier!
            if (!this.cache.has(identifier)) {
                this.cache.set(identifier, observable.array<ObjectNode>([], mobxShallow))
            }
            const set = this.cache.get(identifier)!
            if (set.indexOf(node) !== -1) fail(`Already registered`)
            set.push(node)
        }
        return this
    }

    mergeCache(node: ObjectNode) {
        values(node.identifierCache!.cache).forEach(nodes =>
            nodes.forEach(child => {
                this.addNodeToCache(child)
            })
        )
    }

    notifyDied(node: ObjectNode) {
        if (node.identifierAttribute) {
            const set = this.cache.get(node.identifier!)
            if (set) set.remove(node)
        }
    }

    splitCache(node: ObjectNode): IdentifierCache {
        const res = new IdentifierCache()
        const basePath = node.path
        values(this.cache).forEach(nodes => {
            for (let i = nodes.length - 1; i >= 0; i--) {
                if (nodes[i].path.indexOf(basePath) === 0) {
                    res.addNodeToCache(nodes[i])
                    nodes.splice(i, 1)
                }
            }
        })
        return res
    }

    resolve(type: IAnyType, identifier: string): ObjectNode | null {
        const set = this.cache.get("" + identifier)
        if (!set) return null
        const matches = set.filter(candidate => type.isAssignableFrom(candidate.type))
        switch (matches.length) {
            case 0:
                return null
            case 1:
                return matches[0]
            default:
                return fail(
                    `Cannot resolve a reference to type '${
                        type.name
                    }' with id: '${identifier}' unambigously, there are multiple candidates: ${matches
                        .map(n => n.path)
                        .join(", ")}`
                )
        }
    }
}
