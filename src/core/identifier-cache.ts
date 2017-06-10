import { fail } from "../utils"
import { observable, IObservableArray } from "mobx"
import { IType } from "../types/type"
import { Node } from "./node"

export class IdentifierCache {
    private cache: { [id: string]: IObservableArray<Node> } = {}

    register(node: Node) {
        if (node.identifier === null)
            return

        const identifier = node.identifier
        if (identifier) {
            const set = this.cache[identifier] || (this.cache[identifier] = observable.shallowArray<Node>())
            if (set.indexOf(node) !== -1)
                fail(`Already registered`)
            set.forEach(otherNode => {
                if (otherNode.type.isAssignableFrom(node.type))
                    fail(`An object with identifier '${identifier}' of a similar type is already part of this state tree. Wanted to add '${node.path}', which conflicts with '${otherNode.path}'`)
            })
            set.push(node)
        }

        // TODO: all items in node's cache should become part of this cache as well
    }

    unregister(node: Node) {
        if (node.identifier === null)
            return
        if (node.identifier) {
            const set = this.cache[node.identifier]
            if (set)
                set.remove(node)
        }
        // TODO: all cached items which have node as parent should not be dropped from the cache as well, and moved to the cache of node
    }

    // TOOD: expose a public api for this in mst-operations
    resolve(type: IType<any, any>, identifier: string): Node | null {
        const set = this.cache[identifier]
        if (!set)
            return null
        const matches = set.filter(candidate => type.isAssignableFrom(candidate.type))
        switch (matches.length) {
            case 0: return null
            case 1: return matches[0]
            default:
                return fail(`Cannot resolve a reference to type '${type.name}' with id: '${identifier}' unambigously, there are multiple candidates: ${matches.map(n => n.path).join(", ")}`)
        }
    }
}
