# mobx-state-tree

## _This package is work in progress, stay tuned_

_Opinionated, transactional, MobX powered state container_

[![Build Status](https://travis-ci.org/mobxjs/mobx-state-tree.svg?branch=master)](https://travis-ci.org/mobxjs/mobx-state-tree)
[![Coverage Status](https://coveralls.io/repos/github/mobxjs/mobx-state-tree/badge.svg?branch=master)](https://coveralls.io/github/mobxjs/mobx-state-tree?branch=master)
[![Join the chat at https://gitter.im/mobxjs/mobx](https://badges.gitter.im/mobxjs/mobx.svg)](https://gitter.im/mobxjs/mobx?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

An introduction to the philosophy can be watched [here](https://youtu.be/etnPDw5PKqg?t=32m15s). [Slides](https://immer-mutable-state.surge.sh/). Or, as [markdown](https://github.com/mweststrate/reactive2016-slides/blob/master/slides.md) to read it quickly.

# Installation

NPM:

npm install mobx-state-tree --save-dev

CDN:

<https://unpkg.com/mobx-state-tree/mobx-state-tree.umd.js>

# Philosophy

`mobx-state-tree` is a state container that combines the _simplicity and ease of mutable data_ with the _traceability of immutable data_ and the _reactiveness and performance of observable data_.

It is an opt-in state container that can be used in MobX, but also Redux based applications.

TODO: slides / reactive conf talk

If MobX is like a spreadsheet mechanism for javascript, then mobx-state-tree is like storing your spreadsheet in git.

Unlike MobX itself, mobx-state-tree is quite opinionated on how you structure your data.
This makes it possible to solve many problems generically and out of the box, like:

-   (De-) serialization
-   Snapshotting state
-   Replaying actions
-   Time travelling
-   Emitting and applying JSON patches
-   Protecting state against uncontrolled mutations
-   Using middleware
-   Using dependency injection
-   Maintaining invariants

`mobx-state-tree` tries to take the best features from both object oriented (discoverability, co-location and encapsulation), and immutable based state management approaches (transactionality, sharing functionality through composition).

# Concepts

1.  The state is represented as a _tree_ of _models_.
2.  _models_ are created using _factories_.
3.  A _factory_ basically takes a _snapshot_ and a clone of a base _model_ and copies the two into a fresh _model_ instance.
4.  A _snapshot_ is the immutable representation of the _state_ of a _model_. In other words, a one-time copy of the internal state of a model at a certain point in time.
5.  _snapshots_ use structural sharing. So a snapshot of a node in the tree is composed of the snapshots of it's children, where unmodified snapshots are always shared
6.  `mobx-state-tree` supports JSON patches, replayable actions, listeners for patches, actions and snapshots. References, maps, arrays. Just read on :)

## Models

Models are at the heart of `mobx-state-tree`. They simply store your data.

-   Models are self-contained.
-   Models have fields. Either primitive or complex objects like maps, arrays or other models. In short, these are MobX observables. Fields can only be modified by actions.
-   Models have derived fields. Based on the `mobx` concept of `computed` values.
-   Models have actions. Only actions are allowed to change fields. Fields cannot be changed directly. This ensures replayability of the application state.
-   Models can contain other models. However, models are not allowed to form a graph (using direct references) but must always have a tree shape. This enables many feature like standardized serialization and cloning.
-   Models can be snapshotted at any time
-   Models can be created using factories, that take copy a base model and combine it with a (partial) snapshot

Example:

```javascript
import {createFactory, action, mapOf, referenceTo} from "mobx-state-tree"

const Box = createFactory({
    // props
    name: "",
    x: 0,
    y: 0,

    // computed prop
    get width() {
        return this.name.length * 15
    },

    // action
    move: action(function(dx, dy) {
        this.x += dx
        this.y += dy
    })
})

const BoxStore = createFactory({
    boxes: mapOf(Box),
    selection: referenceTo("boxes/name"),
    addBox: action(function(name) {
        this.boxes.set(name, Box({ name, x: 100, y: 100}))
    })
})

const boxStore = BoxStore()
boxStore.addBox("test")
boxStore.boxes.get("test").move(7, 3)
```

Useful methods:

-   `createFactory(exampleModel)`: creates a new factory
-   `clone(model)`: constructs a deep clone of the given model instance

## Snapshots

A snapshot is a representation of a model. Snapshots are immutable and use structural sharing (sinces model can contain models, snapshots can contain other snapshots).
This means that any mutation of a model results in a new snapshot (using structural sharing) of the entire state tree.
This enables compatibility with any library that is based on immutable state trees.

-   Snapshots are immutable
-   Snapshots can be transported
-   Snapshots can be used to update / restore models to a certain state
-   Snapshots use structural sharing
-   It is posible to subscribe to models and be notified of each new snapshot
-   Snapshots are automatically converted to models when needed. So assignments like `boxStore.boxes.set("test", Box({ name: "test" }))` and `boxStore.boxes.set("test", { name: "test" })` are both valid.

Useful methods:

-   `getSnapshot(model)`: returns a snapshot representing the current state of the model
-   `onSnapshot(model, callback)`: creates a listener that fires whenever a new snapshot is available (but only one per MobX transaction).
-   `applySnapshot(model, snapshot)`: updates the state of the model and all its descendants to the state represented by the snapshot

## Actions

Actions modify models. Actions are replayable and are therefore constrained in several ways:

-   Actions can be invoked directly as method on a model
-   All action arguments must be serializable. Some arguments can be serialized automatically, such as relative paths to other nodes
-   Actions are serializable and replayable
-   It is possible to subscribe to the stream of actions that is invoked on a model
-   Actions can only modify models that belong to the tree on which they are invoked
-   Actions are automatically bound the their instance, so it is save to pass actions around first class without binding or wrapping in arrow functions.

A serialized action call looks like:

    {
       name: "setAge"
       path: "/user",
       args: [17]
    }

Useful methods:

-   `action(fn)` constructs
-   `onAction(model, middleware)` listens to any action that is invoked on the model or any of it's descendants. See `onAction` for more details.
-   `applyAction(model, action)` invokes an action on the model according to the given action description

## Utility methods

-   No restriction in arguments and return types
-   Cannot modify data except though actions

## Patches

Modifying a model does not only result in a new snapshot, but also in a stream of [JSON-patches](http://jsonpatch.com/) describing which modifications are made.
Patches have the following signature:

    export interface IJsonPatch {
        op: "replace" | "add" | "remove"
        path: string
        value?: any
    }

-   Patches are constructed according to JSON-Patch, RFC 6902
-   Patches are emitted immediately when a mutation is made, and don't respect transaction boundaries (like snapshots)
-   Patch listeners can be used to achieve deep observing
-   The `path` attribute of a patch considers the relative path of the event from the place where the event listener is attached
-   A single mutation can result in multiple patches, for example when splicing an array

Useful methods:

-   `onPatch(model, listener)` attaches a patch listener  to the provided model, which will be invoked whenever the model or any of it's descendants is mutated
-   `applyPatch(model, patch)` applies a patch to the provided model

## Working with references

## Be careful with direct references to items in the tree

See [#10](https://github.com/mobxjs/mobx-state-tree/issues/10)

## Factory composition

## Single or multiple state

## Using mobx and mobx-state-tree together

## Integrations

# Examples

# API

## escapeJsonPath

[lib/core/json-patch.js:10-12](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/core/json-patch.js#L10-L12 "Source code on GitHub")

escape slashes and backslashes
<http://tools.ietf.org/html/rfc6901>

**Parameters**

-   `str`

## unescapeJsonPath

[lib/core/json-patch.js:17-19](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/core/json-patch.js#L17-L19 "Source code on GitHub")

unescape slashes and backslashes

**Parameters**

-   `str`

## map

[lib/types/index.js:24-27](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/types/index.js#L24-L27 "Source code on GitHub")

**Parameters**

-   `subFactory` **\[ModelFactory]**  (optional, default `primitiveFactory`)

## array

[lib/types/index.js:36-39](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/types/index.js#L36-L39 "Source code on GitHub")

**Parameters**

-   `subFactory` **\[ModelFactory]**  (optional, default `primitiveFactory`)

## onAction

[lib/top-level-api.js:47-49](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L47-L49 "Source code on GitHub")

Registers middleware on a model instance that is invoked whenever one of it's actions is called, or an action on one of it's children.
Will only be invoked on 'root' actions, not on actions called from existing actions.

The callback receives two parameter: the `action` parameter describes the action being invoked. The `next()` function can be used
to kick off the next middleware in the chain. Not invoking `next()` prevents the action from actually being executed!

Action calls have the following signature:

    export type IActionCall = {
       name: string;
       path?: string;
       args?: any[];
    }

Example of a logging middleware:

    function logger(action, next) {
      console.dir(action)
      return next()
    }

    onAction(myStore, logger)

    myStore.user.setAge(17)

    // emits:
    {
       name: "setAge"
       path: "/user",
       args: [17]
    }

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** model to intercept actions on
-   `callback`

Returns **IDisposer** function to remove the middleware

## onPatch

[lib/top-level-api.js:61-63](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L61-L63 "Source code on GitHub")

Registers a function that will be invoked for each that as made to the provided model instance, or any of it's children.
See 'patches' for more details. onPatch events are emitted immediately and will not await the end of a transaction.
Patches can be used to deep observe a model tree.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the model instance from which to receive patches
-   `callback`

Returns **IDisposer** function to remove the listener

## onSnapshot

[lib/top-level-api.js:74-76](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L74-L76 "Source code on GitHub")

Registeres a function that is invoked whenever a new snapshot for the given model instance is available.
The listener will only be fire at the and a MobX (trans)action

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**
-   `callback`

Returns **IDisposer**

## applyPatch

[lib/top-level-api.js:86-88](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L86-L88 "Source code on GitHub")

Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**
-   `patch` **IJsonPatch**

## applyPatches

[lib/top-level-api.js:97-102](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L97-L102 "Source code on GitHub")

Applies a number of JSON patches in a single MobX transaction

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**
-   `patches` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;IJsonPatch>**

## applyAction

[lib/top-level-api.js:128-130](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L128-L130 "Source code on GitHub")

Dispatches an Action on a model instance. All middlewares will be triggered.
Returns the value of the last actoin

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**
-   `action` **IActionCall**
-   `options` **\[IActionCallOptions]**

## applyActions

[lib/top-level-api.js:142-147](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L142-L147 "Source code on GitHub")

Applies a series of actions in a single MobX transaction.

Does not return any value

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**
-   `actions` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;IActionCall>**
-   `options` **\[IActionCallOptions]**

## applySnapshot

[lib/top-level-api.js:172-174](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L172-L174 "Source code on GitHub")

Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**
-   `snapshot` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**

## getSnapshot

[lib/top-level-api.js:184-186](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L184-L186 "Source code on GitHub")

Calculates a snapshot from the given model instance. The snapshot will always reflect the latest state but use
structural sharing where possible. Doesn't require MobX transactions to be completed.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**

Returns **Any**

## hasParent

[lib/top-level-api.js:196-199](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L196-L199 "Source code on GitHub")

Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**
-   `strict` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]**  (optional, default `false`)

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

## getParent

[lib/top-level-api.js:221-228](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L221-L228 "Source code on GitHub")

TODO:
Given a model instance, returns `true` if the object has same parent, which is a model object, that is, not an
map or array.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**
-   `strict`

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

## getParent

[lib/top-level-api.js:221-228](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L221-L228 "Source code on GitHub")

Returns the immediate parent of this object, or null. Parent can be either an object, map or array
TODO:? strict mode?

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**
-   `strict` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]**  (optional, default `false`)

Returns **Any**

## getRoot

[lib/top-level-api.js:250-252](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L250-L252 "Source code on GitHub")

TODO:
Returns the closest parent that is a model instance, but which isn't an array or map.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**

Returns **Any**

## getRoot

[lib/top-level-api.js:250-252](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L250-L252 "Source code on GitHub")

Given an object in a model tree, returns the root object of that tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**

Returns **Any**

## getPath

[lib/top-level-api.js:261-263](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L261-L263 "Source code on GitHub")

Returns the path of the given object in the model tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

## getPathParts

[lib/top-level-api.js:272-274](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L272-L274 "Source code on GitHub")

Returns the path of the given object as unescaped string array

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>**

## isRoot

[lib/top-level-api.js:283-285](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L283-L285 "Source code on GitHub")

Returns true if the given object is the root of a model tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

## resolve

[lib/top-level-api.js:295-298](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L295-L298 "Source code on GitHub")

Resolves a path relatively to a given object.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** escaped json path

Returns **Any**

## tryResolve

[lib/top-level-api.js:308-313](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L308-L313 "Source code on GitHub")

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**

Returns **Any**

## getFromEnvironment

[lib/top-level-api.js:322-324](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L322-L324 "Source code on GitHub")

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**
-   `key`

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)**

## clone

[lib/top-level-api.js:335-338](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L335-L338 "Source code on GitHub")

**Parameters**

-   `source` **T**
-   `customEnvironment` **\[Any]**

Returns **T**

## \_getNode

[lib/top-level-api.js:350-352](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L350-L352 "Source code on GitHub")

Internal function, use with care!

**Parameters**

-   `thing`

## \_getNode

[lib/top-level-api.js:350-352](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/top-level-api.js#L350-L352 "Source code on GitHub")

**Parameters**

-   `thing` **any**

Returns **Any**

## get

[lib/core/node.js:67-69](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/core/node.js#L67-L69 "Source code on GitHub")

Returnes (escaped) path representation as string

## maybeNode

[lib/core/node.js:314-326](https://github.com/mweststrate/mobx-state-tree/blob/3391ff9979f9625b326ebfe64ce4d6fbbfc96cfc/lib/core/node.js#L314-L326 "Source code on GitHub")

Tries to convert a value to a TreeNode. If possible or already done,
the first callback is invoked, otherwise the second.
The result of this function is the return value of the callbacks

**Parameters**

-   `value`
-   `asNodeCb`
-   `asPrimitiveCb`

# FAQ

**Should all state of my app be stored in `mobx-state-tree`?**
No, or, not necessarily. An application can use both state trees and vanilla MobX observables at the same time.
State trees are primarily designed to store your domain data, as this kind of state is often distributed and not very local.
For, for example, local component state, vanilla MobX observables might often be simpler to use.

**No constructors?**

Neh, replayability. Use utilities instead

**No inheritance?**

No use composition or unions instead.

## Constraints

Some model constructions which are supported by mobx are not supported by mobx-state-tree

-   Data graphs are not supported, only data trees
-   This means that each object needs to uniquely contained
-   Only containment relations are allowed. Associations need to be expressed with 'foreign keys'; strings identifying other objects. However there is a standard pattern enabling using real objects as references with a little boilerplate, see [working with associations](#working-with-associations).
-   `mobx-state-tree` does currently not support inheritance / subtyping. This could be changed by popular demand, but not supporting inheritance avoids the need to serialize type information or keeping a (global) type registery

## Features

-   Provides immutable, structurally shared snapshots which can be used as serialization or for time travelling. Snapshots consists entirely of plain objects.
-   Provides [JSON patch](https://tools.ietf.org/html/rfc6902) streams for easy remote synchronization or easy diffing.
-   Each object is uniquely contained and has an explicit path like in a file system. This enables using relative references and is very useful for debugging.
-   State trees are composable
-   There can be many state trees in a single app.

## Comparison with immutable state trees

So far this might look a lot like an immutable state tree as found for example in Redux apps, but there are a few differences:

-   mobx-state-tree allow direct modification of any value in the tree, it is not needed to construct a new tree in your actions
-   mobx-state-tree allows for fine grained and efficient observability on any point in the state tree
-   mobx-state-tree generates json patches for any modification that is made
-   (?) mobx-state-tree is a valid redux store, providing the same api (TODO)

# Working with assocations

```javascript
import { resolve } from "mobx-state-tree"

class Message {
    @observable _author = "103"

    @computed get author() {
        return resolve(this, `/users`, this._author)
    }
    set author(author: User) {
        this._author = author ? author.id : null
    }
}
```
