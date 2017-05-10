# 0.6.0

* **BREAKING** Array and map types can no longer be left out of snapshots by default. Use `optional` to make them optional in the snapshot
* **BREAKING** Literals no longer have a default value by default (use optional + literal instead)
* Improved identifier support, they are no properly propageted through utility types like `maybe`, `union` etc
* Fixed issue where fields where not referted back to default when a partial snapshot was provided
* **BREAKING** Disabled inlining type.model definitions as introduced in 0.5.1; to many subtle issues
* **BREAKING** `types.withDefault` has been renamed to `types.optional`

// NOTE: Also, can we name all the functions in types directly with their final name? (optional instead of createOptionalFactory...etc.)

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