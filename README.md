# mobx-state-tree

## _This package is work in progress, stay tuned_

_Opinionated, transactional, MobX powered state container_

[![Build Status](https://travis-ci.org/mobxjs/mobx-state-tree.svg?branch=master)](https://travis-ci.org/mobxjs/mobx-state-tree)
[![Coverage Status](https://coveralls.io/repos/github/mobxjs/mobx-state-tree/badge.svg?branch=master)](https://coveralls.io/github/mobxjs/mobx-state-tree?branch=master)
[![Join the chat at https://gitter.im/mobxjs/mobx](https://badges.gitter.im/mobxjs/mobx.svg)](https://gitter.im/mobxjs/mobx?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

An introduction to the philosophy can be watched [here](https://youtu.be/ta8QKmNRXZM?t=21m52s). [Slides](https://immer-mutable-state.surge.sh/). Or, as [markdown](https://github.com/mweststrate/reactive2016-slides/blob/master/slides.md) to read it quickly.

# Installation

NPM:

npm install mobx-state-tree --save-dev

CDN:

<https://unpkg.com/mobx-state-tree/mobx-state-tree.umd.js>

# Philosophy

`mobx-state-tree` is a state container that combines the _simplicity and ease of mutable data_ with the _traceability of immutable data_ and the _reactiveness and performance of observable data_.

It is an opt-in state container that can be used in MobX, but also Redux based applications.

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
import {types, action, mapOf, referenceTo} from "mobx-state-tree"

const Box = types.model({
    // props
    name: "",
    x: 0,
    y: 0,

    // computed prop
    get width() {
        return this.name.length * 15
    },

    // action
    move(dx, dy) {
        this.x += dx
        this.y += dy
    }
})

const BoxStore = types.model({
    boxes: types.map(Box),
    selection: types.reference("boxes/name"),
    addBox: action(function(name) {
        this.boxes.set(name, Box({ name, x: 100, y: 100}))
    })
})

const boxStore = BoxStore.create()
boxStore.addBox("test")
boxStore.boxes.get("test").move(7, 3)
```

Useful methods:

-   `types.model(exampleModel)`: creates a new factory
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

-   Use `name: function(/* args */) { /* body */ }` (ES5) or `name (/* args */) { /* body */ }` (ES6) to construct actions
-   `onAction(model, middleware)` listens to any action that is invoked on the model or any of it's descendants. See `onAction` for more details.
-   `applyAction(model, action)` invokes an action on the model according to the given action description

It is not necessary to express all logic around models as actions. For example it is not possible to define constructors on models. Rather, it is recommended to create stateless utility methods that operate on your models. It is recommended to keep models self-contained and to do orchestration around models in utilities around it.

## Protecting the state tree

By default it is allowed to both directly modify a model or through an action.
However, in some cases you want to guarantee that the state tree is only modified through actions.
So that replaying action will reflect everything that can possible have happened to your objects, or that every mutation passes through your action middleware etc.
To disable modifying data in the tree without action, simple call `protect(model)`. Protect protects the passed model an all it's children

```javascript
const Todo = types.model({
    done: false,
    toggle() {
        this.done = !this.done
    }
})

const todo = new Todo()
todo.done = true // OK
protect(todo)
todo.done = false // throws!
todo.toggle() // OK
```

## Identifiers

Identifiers and references are two powerful abstraction that work well together.

-   Each model can define zero or one `identifier()` properties
-   The identifier property of an object cannot be modified after initialization
-   Identifiers should be unique within their parent collection (`array` or `map`)
-   Identifiers are used to reconcile items inside arrays and maps wherever possible when applying snapshots
-   The `map.put()` method can be used to simplify adding objects to maps that have identifiers

Example:

```javascript
const Todo = types.model({
    id: types.identifier(),
    title: "",
    done: false
})

const todo1 = Todo.create() // not ok, identifier is required
const todo1 = Todo.create({ id: "1" }) // ok
applySnapshot(todo1, { id: "2", done: false}) // not ok; cannot modify the identifier of an object

const store = types.map(Todo)
store.put(todo1) // short-hand for store.set(todo1.id, todo)
```

## References

References can be used to refer to link to an arbitrarily different object in the tree transparently.
This makes it possible to use the tree as graph, while behind the scenes the graph is still properly serialized as tree

Example:

```javascript
const Store = types.model({
    selectedTodo: types.reference(Todo),
    todos: types.array(Todo)
})

const store = Store({ todos: [ /* some todos */ ]})

store.selectedTodo = store.todos[0] // ok
store.selectedTodo === store.todos[0] // true
getSnapshot(store) // serializes properly as tree: { selectedTodo: { $ref: "../todos/0" }, todos: /* */ }

store.selectedTodo = Todo() // not ok; have to refer to something already in the same tree
```

By default references can point to any arbitrary object in the same tree (as long as it has the proper type).

## References with predefined resolve paths

It is also possible to specifiy in which collection the reference should resolve by passing a second argument, the resolve path (this can be relative):

```javascript
const Store = types.model({
    selectedTodo: types.reference(Todo, "/todos/"),
    todos: types.array(Todo)
})
```

If a resolve path is provided, `reference` no longer stores a json pointer, but pinpoints the exact object that is being referred to by it's _identifier_. Assuming that `Todo` specified an `identifier()` property:

```javascript
getSnapshot(store) // serializes tree: { selectedTodo: "17" /* the identifier of the todo */, todos: /* */ }
```

The advantage of this approach is that paths are less fragile, where default references serialize the path by for example using array indices, an identifier with a resolve path will find the object by using it's identifier.

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

## Be careful with direct references to items in the tree

See [#10](https://github.com/mobxjs/mobx-state-tree/issues/10)

## Factory composition

## Tree semantics

## Single or multiple state

## Using mobx and mobx-state-tree together

## Integrations

# Examples

# API

## ComplexType

[lib/core/complex-type.js:17-40](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/core/complex-type.js#L17-L40 "Source code on GitHub")

A complex type produces a MST node (Node in the state tree)

## maybeMST

[lib/core/mst-node.js:32-44](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/core/mst-node.js#L32-L44 "Source code on GitHub")

Tries to convert a value to a TreeNode. If possible or already done,
the first callback is invoked, otherwise the second.
The result of this function is the return value of the callbacks

**Parameters**

-   `value`  
-   `asNodeCb`  
-   `asPrimitiveCb`  

## get

[lib/core/mst-node-administration.js:63-66](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/core/mst-node-administration.js#L63-L66 "Source code on GitHub")

Returnes (escaped) path representation as string

## escapeJsonPath

[lib/core/json-patch.js:8-10](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/core/json-patch.js#L8-L10 "Source code on GitHub")

escape slashes and backslashes
<http://tools.ietf.org/html/rfc6901>

**Parameters**

-   `str`  

## unescapeJsonPath

[lib/core/json-patch.js:15-17](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/core/json-patch.js#L15-L17 "Source code on GitHub")

unescape slashes and backslashes

**Parameters**

-   `str`  

## map

[lib/types/index.js:25-28](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/types/index.js#L25-L28 "Source code on GitHub")

**Parameters**

-   `subFactory` **\[ModelFactory]**  (optional, default `primitiveFactory`)

## array

[lib/types/index.js:37-40](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/types/index.js#L37-L40 "Source code on GitHub")

**Parameters**

-   `subFactory` **\[ModelFactory]**  (optional, default `primitiveFactory`)

## props

[lib/types/object.js:41-41](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/types/object.js#L41-L41 "Source code on GitHub")

Parsed description of all properties

## onAction

[lib/top-level-api.js:47-52](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L47-L52 "Source code on GitHub")

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

[lib/top-level-api.js:64-66](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L64-L66 "Source code on GitHub")

Registers a function that will be invoked for each that as made to the provided model instance, or any of it's children.
See 'patches' for more details. onPatch events are emitted immediately and will not await the end of a transaction.
Patches can be used to deep observe a model tree.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the model instance from which to receive patches
-   `callback`  

Returns **IDisposer** function to remove the listener

## onSnapshot

[lib/top-level-api.js:77-79](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L77-L79 "Source code on GitHub")

Registeres a function that is invoked whenever a new snapshot for the given model instance is available.
The listener will only be fire at the and a MobX (trans)action

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `callback`  

Returns **IDisposer** 

## applyPatch

[lib/top-level-api.js:89-91](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L89-L91 "Source code on GitHub")

Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `patch` **IJsonPatch** 

## applyPatches

[lib/top-level-api.js:100-105](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L100-L105 "Source code on GitHub")

Applies a number of JSON patches in a single MobX transaction

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `patches` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;IJsonPatch>** 

## applyAction

[lib/top-level-api.js:131-133](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L131-L133 "Source code on GitHub")

Dispatches an Action on a model instance. All middlewares will be triggered.
Returns the value of the last actoin

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `action` **IActionCall** 
-   `options` **\[IActionCallOptions]** 

## applyActions

[lib/top-level-api.js:145-150](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L145-L150 "Source code on GitHub")

Applies a series of actions in a single MobX transaction.

Does not return any value

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `actions` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;IActionCall>** 
-   `options` **\[IActionCallOptions]** 

## protect

[lib/top-level-api.js:187-189](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L187-L189 "Source code on GitHub")

By default it is allowed to both directly modify a model or through an action.
However, in some cases you want to guarantee that the state tree is only modified through actions.
So that replaying action will reflect everything that can possible have happened to your objects, or that every mutation passes through your action middleware etc.
To disable modifying data in the tree without action, simple call `protect(model)`. Protect protects the passed model an all it's children

**Parameters**

-   `target`  

**Examples**

```javascript
const Todo = types.model({
    done: false,
    toggle() {
        this.done = !this.done
    }
})

const todo = new Todo()
todo.done = true // OK
protect(todo)
todo.done = false // throws!
todo.toggle() // OK
```

## isProtected

[lib/top-level-api.js:194-196](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L194-L196 "Source code on GitHub")

Returns true if the object is in protected mode, @see protect

**Parameters**

-   `target`  

## applySnapshot

[lib/top-level-api.js:206-208](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L206-L208 "Source code on GitHub")

Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `snapshot` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## getSnapshot

[lib/top-level-api.js:218-220](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L218-L220 "Source code on GitHub")

Calculates a snapshot from the given model instance. The snapshot will always reflect the latest state but use
structural sharing where possible. Doesn't require MobX transactions to be completed.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **Any** 

## hasParent

[lib/top-level-api.js:230-233](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L230-L233 "Source code on GitHub")

Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `strict` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]**  (optional, default `false`)

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## getParent

[lib/top-level-api.js:255-262](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L255-L262 "Source code on GitHub")

TODO:
Given a model instance, returns `true` if the object has same parent, which is a model object, that is, not an
map or array.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `strict`  

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## getParent

[lib/top-level-api.js:255-262](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L255-L262 "Source code on GitHub")

Returns the immediate parent of this object, or null. Parent can be either an object, map or array
TODO:? strict mode?

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `strict` **\[[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)]**  (optional, default `false`)

Returns **Any** 

## getRoot

[lib/top-level-api.js:284-286](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L284-L286 "Source code on GitHub")

TODO:
Returns the closest parent that is a model instance, but which isn't an array or map.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **Any** 

## getRoot

[lib/top-level-api.js:284-286](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L284-L286 "Source code on GitHub")

Given an object in a model tree, returns the root object of that tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **Any** 

## getPath

[lib/top-level-api.js:295-297](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L295-L297 "Source code on GitHub")

Returns the path of the given object in the model tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

## getPathParts

[lib/top-level-api.js:306-308](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L306-L308 "Source code on GitHub")

Returns the path of the given object as unescaped string array

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

## isRoot

[lib/top-level-api.js:317-319](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L317-L319 "Source code on GitHub")

Returns true if the given object is the root of a model tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## resolve

[lib/top-level-api.js:329-332](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L329-L332 "Source code on GitHub")

Resolves a path relatively to a given object.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** escaped json path

Returns **Any** 

## tryResolve

[lib/top-level-api.js:342-347](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L342-L347 "Source code on GitHub")

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **Any** 

## clone

[lib/top-level-api.js:357-360](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L357-L360 "Source code on GitHub")

**Parameters**

-   `source` **T** 

Returns **T** 

## \_getNode

[lib/top-level-api.js:372-374](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L372-L374 "Source code on GitHub")

Internal function, use with care!

**Parameters**

-   `thing`  

## \_getNode

[lib/top-level-api.js:372-374](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L372-L374 "Source code on GitHub")

**Parameters**

-   `thing` **any** 

Returns **Any** 

## detach

[lib/top-level-api.js:379-382](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L379-L382 "Source code on GitHub")

Removes a model element from the state tree, and let it live on as a new state tree

**Parameters**

-   `thing`  

## destroy

[lib/top-level-api.js:387-391](https://github.com/mweststrate/mobx-state-tree/blob/992c4594af2120a86bc6e4bb7fbd645b645c8775/lib/top-level-api.js#L387-L391 "Source code on GitHub")

Removes a model element from the state tree, and mark it as end-of-life; the element should not be used anymore

**Parameters**

-   `thing`  

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

## TypeScript & MST

When using models, you write interface along with it's property types that will be used to perform type checks at runtime.
What about compile time? You can use TypeScript interfaces indeed to perform those checks, but that would require writing again all the properties and their actions!
Good news? You don't need to write it twice! Using the `typeof` operator of TypeScript over the `.Type` property of a MST Type, will result in a valid TypeScript Type!

```typescript
const Todo = types.model({
    title: types.string,
    setTitle(v: string) {
        this.title = v
    }
})
type ITodo = typeof Todo.Type // => ITodo is now a valid TypeScript type with { title: string; setTitle: (v: string) => void }
```
