# 0.3.2

* Fix: actions where not bound automatically
* Improved and simplified the reconciliation mechanism, fixed many edge cases
* Improved the reference mechanism, fixed many edge cases
* Improved performance

# 0.3.1

* (re) introduced the concept of environments, which can be passed as second argument to `.create`, and picked up using `getEnv`

# 0.3.0

* Removed `primitive` type, use a more specific type instead
* Improved typescript typings of snapshots
* Added `depth` parameter to `getParent` and `hasParent`
* Separated the concepts of middleware and serializable actions. It is now possible to intercept, modify actions etc through `addMiddleWare`. `onAction` now uses middleware, if it is used, all parameters of actions should be serializable!

# 0.2.2

* Introduced the concept of livelyness; if nodes are removed from the the tree because they are replaced by some other value, they will be marked as "died". This should help to early signal when people hold on to references that are not part of the tree anymore. To explicitly remove an node from a tree, with the intent to spawn a new state tree from it, use `detach`.
* Introduced the convenience method `destroy` to remove a model from it's parent and mark it as dead.
* Introduced the concept of protected trees. If a tree is protected using `protect`, it can only be modified through action, and not by mutating it directly anymore.

# 0.2.1

* Introduced .Type and .SnapshotType to be used with TypeScript to get the type for a model

# 0.2.0

* Renamed `createFactory` to `types.model` (breaking!)
* Renamed `composeFactory` to `types.extend` (breaking!)
* Actions should now be declared as `name(params) { body }`, instead of `name: action(function (params) { body})` (breaking!)
* Models are no longer constructed by invoking the factory as function, but by calling `factory.create` (breaking!)
* Introduced `identifier`
* Introduced / improved `reference`
* Greatly improved typescript support, type inference etc. However there are still limitations as the full typesystem of MST cannot be expressed in TypeScript. Especially concerning the type of snapshots and the possibility to use snapshots as first class value.