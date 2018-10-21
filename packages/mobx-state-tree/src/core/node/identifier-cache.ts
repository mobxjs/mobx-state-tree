import { IObservableArray, values, observable } from "mobx"
import { fail, ObjectNode, mobxShallow, IAnyType } from "../../internal"

/**
 * @internal
 * @private
 */
export class IdentifierCache {
    // n.b. in cache all identifiers are normalized to strings
    private cache = observable.map<string, IObservableArray<ObjectNode>>()
    private lastCacheModificationPerId = observable.map<string, number>()

    constructor() {}

    private updateLastCacheModificationPerId(identifier: string) {
        const lcm = this.lastCacheModificationPerId.get(identifier)
        // we start at 1 since 0 means no node was ever added
        this.lastCacheModificationPerId.set(identifier, lcm === undefined ? 1 : lcm + 1)
    }

    getLastCacheModificationPerId(identifier: string) {
        return this.lastCacheModificationPerId.get(identifier) || 0
    }

    addNodeToCache(node: ObjectNode) {
        if (node.identifierAttribute) {
            const identifier = node.identifier!
            if (!this.cache.has(identifier)) {
                this.cache.set(identifier, observable.array<ObjectNode>([], mobxShallow))
            }
            const set = this.cache.get(identifier)!
            if (set.indexOf(node) !== -1) fail(`Already registered`)
            set.push(node)
            this.updateLastCacheModificationPerId(identifier)
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
            if (set) {
                set.remove(node)
                this.updateLastCacheModificationPerId(node.identifier!)
            }
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
                // make sure we instantiate all nodes up to the root (if available and if not done before)
                // fixes #993
                const matched = matches[0]
                if (matched) {
                    // array with parent chain from parent to child
                    const parentChain = []

                    let parent = matched.parent
                    // for performance reasons we never go back further than the most direct
                    // uninitialized parent
                    // this is done to avoid traversing the whole tree to the root when using
                    // the same reference again
                    while (parent && !parent.isObservableInstanceCreated) {
                        parentChain.unshift(parent)
                        parent = parent.parent
                    }

                    // initialize the uninitialized parent chain from parent to child
                    for (const p of parentChain) {
                        p.createObservableInstanceIfNeeded()
                    }
                }
                return matched
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
