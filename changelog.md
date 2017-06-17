# Next

* **BREAKING** Dropped types.extend in favor of types.compoase

# 0.7.3

* Introduced the concept of volatile / local state in models. See [#168](https://github.com/mobxjs/mobx-state-tree/issues/168), or [docs](https://github.com/mobxjs/mobx-state-tree/tree/master#volatile-state)
* Fixed issue with types.map() with types.identifier(types.number) [#191](https://github.com/mobxjs/mobx-state-tree/issues/191) reported by @boatkorachal
* Fixed issue with reconciler that affected types.map when node already existed at that key reported by @boatkorachal [#191](https://github.com/mobxjs/mobx-state-tree/issues/191)

# 0.7.2

* Fixed `cannot read property resolve of undefined` thanks to @cpunion for reporting, now value of dead nodes will be undefined. [#186](https://github.com/mobxjs/mobx-state-tree/issues/186)
* Fixed `[LateType] is not defined` thanks to @amir-arad for reporting, when using late as model property type [#187](https://github.com/mobxjs/mobx-state-tree/issues/187)
* Fixed `Object.freeze can only be called on Object` thanks to @ds300 for reporting, when using MST on a ReactNative environment [#189](https://github.com/mobxjs/mobx-state-tree/issues/189)
* Now the entire codebase is prettier! :D [#187](https://github.com/mobxjs/mobx-state-tree/issues/187)

# 0.7.1

* Fixed `array.remove` not working

# 0.7.0

The type system and internal administration has been refactoring, making the internals both simpler and more flexible.
Things like references and identifiers are now first class types, making them much better composable. [#152](https://github.com/mobxjs/mobx-state-tree/issues/152)

* **BREAKING** References with a predefined lookup path are no longer supported. Instead of that, identifiers are now looked up in the entire tree. For that reasons identifiers now have to be unique in the entire tree, per type.
* **BREAKING** `resolve` is renamed to `resolvePath`
* Introduced `resolveIdentifier(type, tree, identifier)` to find objects by identifier
* **BREAKING** `types.reference` is by default non-nullable. For nullable identifiers, use `types.maybe(types.reference(X))`
* Many, many improvements. Related open issues will be updated.
* **BREAKING** `isMST` is renamed to `isStateTreeNode`

# 0.6.3

* Fixed issue with array/maps of union types @abruzzihraig [#151](https://github.com/mobxjs/mobx-state-tree/issues/151)
* Make types.extend support computed attributes @cpunion [#169](https://github.com/mobxjs/mobx-state-tree/issues/169)
* Fixed issue with map of primitive types and applySnapshot @pioh [#155](https://github.com/mobxjs/mobx-state-tree/issues/155)
* Better type declarations for union, up to 10 supported types

# 0.6.2

* Fixed issue where arrays where not properly serialized as action argument

# 0.6.1

* Improved reporting of Type.is(), now it returns a fine grained report of why the provided value is not applicable.
```
[mobx-state-tree] Error while converting [{}] to AnonymousModel[]:
at path "/name" snapshot undefined is not assignable to type: string.
at path "/quantity" snapshot undefined is not assignable to type: number.
```
* Fixed support for `types.reference` in combination with `types.late`, by @robinfehr

# 0.6.0

* **BREAKING** `types.withDefault` has been renamed to `types.optional`
* **BREAKING** Array and map types can no longer be left out of snapshots by default. Use `optional` to make them optional in the snapshot
* **BREAKING** Literals no longer have a default value by default (use optional + literal instead)
* **BREAKING** Disabled inlining type.model definitions as introduced in 0.5.1; to many subtle issues
* Improved identifier support, they are no properly propageted through utility types like `maybe`, `union` etc
* Fixed issue where fields where not referted back to default when a partial snapshot was provided
* Fixed #122: `types.identifier` now also accepts a subtype to override the default string type; e.g. `types.identifier(types.number)`

# 0.5.1

* Introduced support for lazy evaluating values in `withDefault`, useful to generate UUID's, timestamps or non-primitive default values
* ~~It is now possible to define something like~~ Removed in 0.6.0

```javascript
const Box = types.model({
    point: {
        x: 10,
        y: 10
    }
}
```

Where the type of `point` property is inferred to `point: types.withDefault(types.model({ x: 10, y: 10}), () => ({ x: 10, y: 10 }))`

# 0.5.0

* ** BREAKING ** protection is now enabled by default (#101)
* ** BREAKING ** it is no longer possible to read values from a dead object. Except through `getSnapshot` or `clone` (#102)
* ** BREAKING ** `types.recursive` has been removed in favor of `types.late`
* Introduced `unprotect`, to disable protection mode for a certain instance. Useful in `afterCreate` hooks
* Introduced `types.late`. Usage: `types.late(() => typeDefinition)`. Can be used for circular / recursive type definitions, even across files. See `test/circular(1|2).ts` for an example (#74)

# 0.4.0

**BREAKING** `types.model` no requires 2 parameters to define a model. The first parameter defines the properties, derived values and view functions. The second argment is used to define the actions. For example:

```javascript
const Todo = types.model("Todo", {
    done: types.boolean,
    toggle() {
        this.done = !this.done
    }
})
```

Now should be defined as:

```javascript
const Todo = types.model(
    "Todo",
    {
        done: types.boolean,
    },
    {
        toggle() {
            this.done = !this.done
        }
    }
)
```

It is still possible to define functions on the first object. However, those functions are not considered to be actions, but views. They are not allowed to modify values, but instead should produce a new value themselves.

# 0.3.3

* Introduced lifecycle hooks `afterCreate`, `afterAttach`, `beforeDetach`, `beforeDestroy`, implements #76
* Introduced the convenience method `addDisposer(this, cb)` that can be used to easily destruct reactions etc. which are set up in `afterCreate`. See #76

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
