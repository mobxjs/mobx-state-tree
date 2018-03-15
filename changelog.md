# 2.0.0

**Breaking changes**

* MobX-state-tree now requires MobX 4.0 or higher
* Identifiers are now internally always normalized to strings. This also means that adding an object with an number identifier to an observable map, it should still be requested back as string. In general, we recommend to always use string based identifiers to avoid confusion.

# 1.4.0

**Features**

* It is now possible to create [custom primitive(like) types](https://github.com/mobxjs/mobx-state-tree/blob/master/API.md#typescustom)! Implements [#673](https://github.com/mobxjs/mobx-state-tree/issues/673) through [#689](https://github.com/mobxjs/mobx-state-tree/pull/689)
* [`getIdentifier`](https://github.com/mobxjs/mobx-state-tree/blob/master/API.md#getidentifier) is now exposed as function, to get the identifier of a model instance (if any). Fixes [#674](https://github.com/mobxjs/mobx-state-tree/issues/674) through [#678](https://github.com/mobxjs/mobx-state-tree/pull/678) by TimHollies
* Writing [middleware](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/middleware.md) has slightly changed, to make it less error prone and more explicit whether a middleware chain should be aborted. For details, see [#675](https://github.com/mobxjs/mobx-state-tree/pull/675) by Robin Fehr
* It is now possible to configure whether [attached middleware](https://github.com/mobxjs/mobx-state-tree/blob/master/API.md#addmiddleware) should be triggered for the built-in hooks / operations. [#653](https://github.com/mobxjs/mobx-state-tree/pull/653) by Robin Fehr
* We exposed an [api](https://github.com/mobxjs/mobx-state-tree/blob/master/API.md#getmembers) to perform reflection on model instances. [#649](https://github.com/mobxjs/mobx-state-tree/pull/649) by Robin Fehr

**Fixes**

* Fixed a bug where items in maps where not properly reconciled when the `put` operation was used. Fixed [#683](https://github.com/mobxjs/mobx-state-tree/issues/683) and [#672](https://github.com/mobxjs/mobx-state-tree/issues/672) through [#693](https://github.com/mobxjs/mobx-state-tree/pull/693)
* Fixed issue where trying to resolve a path would throw exceptions. Fixed [#686](https://github.com/mobxjs/mobx-state-tree/issues/686) through [#692](https://github.com/mobxjs/mobx-state-tree/pull/692)
* In non production builds actions and views on models can now be replaced, to simplify mocking. Fixes [#646](https://github.com/mobxjs/mobx-state-tree/issues/646) through [#690](https://github.com/mobxjs/mobx-state-tree/pull/690)
* Fixed bug where `tryResolve` could leave a node in a corrupt state. [#668](https://github.com/mobxjs/mobx-state-tree/pull/668) by dnakov
* Fixed typings for TypeScript 2.7, through [#667](https://github.com/mobxjs/mobx-state-tree/pull/667) by Javier Gonzalez
* Several improvements to error messages

# 1.3.1

* Fixed bug where `flows` didn't properly batch their next ticks properly in actions, significantly slowing processes down. Fixes [#563]([#563](https://github.com/mobxjs/mobx-state-tree/issues/563))

# 1.3.0

* Significantly improved the undo/redo manager. The undo manager now supports groups. See [#504](https://github.com/mobxjs/mobx-state-tree/pull/504) by @robinfehr! See the [updated docs](https://github.com/mobxjs/mobx-state-tree/blob/master/packages/mst-middlewares/README.md#undomanager) for more details.
* Significantly improved performance, improvements of 20% could be expected, but changes of course per case. See [#553](https://github.com/mobxjs/mobx-state-tree/pull/553)
* Implemented `actionLogger` middleware, which logs most events for async actions
* Slightly changed the order in which life cycle hooks are fired. `afterAttach` will no fire first on the parent, then on the children. So, unlike `afterCreate`, in `afterAttach` one can assume in `afterAttach that the parent has completely initialized.

# 1.2.1

* 1.2.0 didn't seem to be released correctly...

# 1.2.0

* Introduced customizable reference types. See the [reference and identifiers](https://github.com/mobxjs/mobx-state-tree#references-and-identifiers) section.
* Introduced `model.volatile` to more easily declare and reuse volatile instance state. Volatile state can contain arbitrary data, is shallowly observable and, like props, cannot be modified without actions. See [`model.volatile`](https://github.com/mobxjs/mobx-state-tree#model-volatile) for more details.

# 1.1.1

### Improvements

* Fixed an issue where nodes where not always created correctly, see #534. Should fix #513 and #531.
* All tests are now run in both PROD and non PROD configurations, after running into some bugs that only occurred in production builds.
* Some internal optimizations have been applied (and many more will follow). Like having internal leaner node for immutable data. See #474
* A lot of minor improvements on the docs

# 1.1.0

### Improvements

* The concept of process (asynchronous actions) has been renamed to flows. (Mainly to avoid issues with bundlers)
* We changed to a lerna setup which allows separately distributing middleware and testing examples with more ease
* Every MST middleware is now shipped in a separate package named `mst-middlewares`. They are now written in TypeScript and fully transpiled to ES5 to avoid problems with uglifyjs in create-react-app bundling.
* Introduced `createActionTrackingMiddleware`, this significantly simplifies writing middleware for common scenarios. Especially middleware that deals with asynchronous actions (flows)
* Renamed `process` to `flow`. Deprecated `process`.
* **BREAKING** As a result some middleware event names have also been changed. If you have custom middlewares this change might affect you. Rename middleware event type prefixes starting with `process` to now start with `flow`.

### Fixes

* Fixed nested maps + environments not working correctly, [#447](https://github.com/mobxjs/mobx-state-tree/pull/447) by @xaviergonz
* Improved typescript typings for enumerations, up to 50 values are now supported [#424](https://github.com/mobxjs/mobx-state-tree/pull/447) by @danielduwaer


# 1.0.2

* Introduced `modelType.extend` which allows creating views and actions with shared state.

# 1.0.1


### Features

* Added the middlewares `atomic` and types `TimeTraveller`, `UndoManager`. Check out the [docs](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/middleware.md)!
* Introduced `createActionTrackingMiddleware` to simplify the creation of middleware that support complex async processes
* exposed `typecheck(type, value)` as public api (will ignore environment flags)

### Improvements

* `getEnv` will return an empty object instead of throwing when a tree was initialized without environment
* Fixed issue where patches generated for nested maps were incorrect (#396)
* Fixed the escaping of (back)slashes in JSON paths (#405)
* Improved the algorithm that reconcile items in an array (#384)
* Assigning a node that has an environment to a parent is now allowed, as long as the environment is strictly the same (#387)
* Many minor documentation improvements. Thanks everybody who created a PR!

# 1.0.0

No changes

# 0.12.0

* **BREAKING** The redux utilities are no longer part of the core package, but need to be imported from `mobx-state-tree/middleware/redux`.

# 0.11.0

### Breaking changes

* **BREAKING** `onAction` middleware no longer throws when encountering unserializable arguments. Rather, it serializes a struct like `{ $MST_UNSERIALIZABLE: true, type: "someType" }`. MST Nodes are no longer automatically serialized. Rather, one should either pass 1: an id, 2: a (relative) path, 3: a snapshot
* **BREAKING** `revertPatch` has been dropped. `IReversableJsonPatch` is no longer exposed, instead use the inverse patches generated by `onPatch`
* **BREAKING** some middleware events have been renamed: `process_yield` -> `process_resume`, `process_yield_error` -> `process_resume_error`, to make it less confusing how these events relate to `yield` statements.
* **BREAKING** patchRecorder's field `patches` has been renamed to `rawPatches, `cleanPatches` to `patches`, and `inversePatches` was added.

### New features

* Introduced `decorate(middleware, action)` to easily attach middleware to a specific action
* Handlers passed to `onPatch(handler: (patch, inversePatch) => void)` now receive as second argument the inverse patch of the emitted patch
* `onAction` lister now supports an `attachAfter` parameter
* Middleware events now also contain `parentId` (id of the causing action, `0` if none) and `tree` (the root of context)

### Fixes

* ReduxDevTools connection is no longer one step behind [#287](https://github.com/mobxjs/mobx-state-tree/issues/287)
* Middleware is no longer run as part of the transaction of the targeted action
* Fixed representation of `union` types in error messages

# 0.10.3

* **BREAKISH** Redefining lifecycle hooks will now automatically compose them, implements [#252](https://github.com/mobxjs/mobx-state-tree/issues/252)
* Added dev-only checks, typecheck will be performed only in dev-mode and top-level API-calls will be checked.
* The internal types `IMiddleWareEvent`, `IMiddlewareEventType`, `ISerializedActionCall` are now exposed (fixes [#315](https://github.com/mobxjs/mobx-state-tree/issues/315))

# 0.10.2

* Object model instances no longer share a prototype.

# 0.10.1

* Removed accidental dependency on the codemod

# 0.10.0

* **BREAKING** the syntax to define model types has been updated. See the [updated docs](https://github.com/mobxjs/mobx-state-tree#creating-models) or the original proposal:[#282](https://github.com/mobxjs/mobx-state-tree/pull/286), but no worries, theres a codemod! :D
* **BREAKING** `preProcessSnapshot` hook is no longer a normal hook that can be defined as action. Instead, it should be defined on the type using `types.model(...).preProcessSnapshot(value => value)`
* **BREAKING** Asynchronous process should now be defined using `process`. See this [example](https://github.com/mobxjs/mobx-state-tree/blob/adba1943af263898678fe148a80d3d2b9f8dbe63/examples/bookshop/src/stores/BookStore.js#L25) or the [asynchronous action docs](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/async-actions.md).

**How to run the codemod?**

The codemod is provided as npm package command line tool. It has been written using the TypeScript parser, so it will succefully support either TS or regular JavaScript source files.

To run the codemod, you need to first install it globally by `npm install -g mst-codemod-to-0.10`.
After that, the `mst-codemod-to-0.10` command will be available in your command line.

To perform the codemod, you need to call in your command line `mst-codemod-to-0.10` followed by the filename you want to codemod. A `.bak` file with the original source will be created for backup purposes, and the file you provided will be updated to the new syntax! Have fun!

PS: You could also use `npx` instead of installing the codemod globally! :)

# 0.9.5

* Asynchronous actions are now a first class concept in mobx-state-tree. See the [docs](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/async-actions.md)

# 0.9.4

* Introduced `types.null` and `types.undefined`
* Introduced `types.enumeration(name?, options)`

# 0.9.3

* Fix `note that a snapshot is compatible` when assigning a type to an optional version of itself
* Fix error when deleting a non existing item from a map [#255](https://github.com/mobxjs/mobx-state-tree/issues/255)
* Now all required TypeScript interfaces are exported in the main mobx-state-tree package [#256](https://github.com/mobxjs/mobx-state-tree/issues/256)

# 0.9.2

Introduced the concept of reverse patches, see [#231](https://github.com/mobxjs/mobx-state-tree/pull/231/)
* Introduced the `revertPatch` operation, that takes a patch or list of patches, and reverse applies it to the target.
* `onPatch` now takes a second argument, `includeOldValue`, defaulting to `false`, which, if set to true, includes in the patch any value that is being overwritten as result of the patch. Setting this option to true produces patches that can be used with `revertPatch`
* `patchRecorder` now introduces additional fields / methods to be able to reverse apply changes: `patchRecorder.cleanPatches`, `patchRecorder.undo`

# 0.9.1

* Applying a snapshot or patches will now emit an action as well. The name of the emitted action will be `@APPLY_PATCHES`resp `@APPLY_SNAPSHOT`. See [#107](https://github.com/mobxjs/mobx-state-tree/issues/107)
* Fixed issue where same Date instance could'nt be used two times in the same state tree [#229](https://github.com/mobxjs/mobx-state-tree/issues/229)
* Fixed issue with reapplying snapshots to Date field resulting in snapshot typecheck error[#233](https://github.com/mobxjs/mobx-state-tree/issues/233)
* Declaring `types.maybe(types.frozen)` will now result into an error [#224](https://github.com/mobxjs/mobx-state-tree/issues/224)
* Added support for Mobx observable arrays in type checks [#221](https://github.com/mobxjs/mobx-state-tree/issues/221) (from [alessioscalici](https://github.com/alessioscalici))

# 0.9.0

* **BREAKING** Removed `applyPatches` and `applyActions`. Use `applyPatch` resp. `applyAction`, as both will now also accept an array as argument
* **BREAKING** `unprotect` and `protect` can only be applied at root nodes to avoid confusing scenarios Fixed [#180](https://github.com/mobxjs/mobx-state-tree/issues/180)
* Fixed [#141](https://github.com/mobxjs/mobx-state-tree/issues/141), actions / views are no longer wrapped in dynamically generated functions for a better debugging experience
* Small improvements to typings, fixed compilation issues with TypeScript 2.4.1.
* Fixed issues where `compose` couldn't overwrite getters. [#209](https://github.com/mobxjs/mobx-state-tree/issues/209), by @homura
* Fixed CDN links in readme
* Added TodoMVC to the examples section

# 0.8.2

* Fixed issue in rollup module bundle

# 0.8.1

* Fixed issue in release script, rendering 0.8.0 useless

# 0.8.0

* **BREAKING** Dropped `types.extend` in favor of `types.compose`. See [#192](https://github.com/mobxjs/mobx-state-tree/issues/192)
* Introduced the lifecycle hooks `preProcessSnapshot` and `postProcessSnapshot`. See [#203](https://github.com/mobxjs/mobx-state-tree/pull/203) / [#100](https://github.com/mobxjs/mobx-state-tree/issues/100)
* Use rollup as bundler [#196](https://github.com/mobxjs/mobx-state-tree/pull/196)

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
