export {INode} from "./inode"
export * from "./json-patch"
// TODO type with INode instead of Node to external
export {asNode, getNode, getParent, getPath, hasNode} from "./node"

// TODO: createSnapShot(thing -> snapshot)
// TODO: restoreStoreshot(snapshot -> thing)
// TODO: standard integration with local storage for all root trees?
