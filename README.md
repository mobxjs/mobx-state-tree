# mobx-state-tree

_Opinionated, transactional, MobX powered state container combining the best features of the immutable and mutable world for an optimal DX_

[![Build Status](https://travis-ci.org/mobxjs/mobx-state-tree.svg?branch=master)](https://travis-ci.org/mobxjs/mobx-state-tree)
[![Coverage Status](https://coveralls.io/repos/github/mobxjs/mobx-state-tree/badge.svg?branch=master)](https://coveralls.io/github/mobxjs/mobx-state-tree?branch=master)
[![Join the chat at https://gitter.im/mobxjs/mobx](https://badges.gitter.im/mobxjs/mobx.svg)](https://gitter.im/mobxjs/mobx?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Contents

* [Philosophy & Overview](#philosophy_&_overview)
* [Short types overview](#types_overview)
* [Short api overview](#api_overview)
* [Full Api Docs](API.md)
* [Changelog](changelog.md)

# Installation

* NPM: `npm install mobx-state-tree --save`
* Yarn: `yarn add mobx-state-tree`
* CDN: https://unpkg.com/mobx-state-tree/mobx-state-tree.umd.js (exposed as `window.mobxStateTree`)
* JSBin [playground](http://jsbin.com/petoxeheta/edit?html,js,console) (without UI)

# Philosophy & Overview

`mobx-state-tree` is a state container that combines the _simplicity and ease of mutable data_ with the _traceability of immutable data_ and the _reactiveness and performance of observable data_.

Simply put, mobx-state-tree tries to combine the best features of both immutability (transactionality, traceability and composition) and mutability (discoverability, co-location and encapsulation) based approaches to state management; everything to provide the best developer experience possible.
Unlike MobX itself, mobx-state-tree is very opinionated on how data should be structured and updated.
This makes it possible to solve many common problems out of the box.

Central in MST (mobx-state-tree) is the concept of a *living tree*. The tree consists of mutable, but strictly protected objects enriched with _runtime type information_. In other words; each tree has a _shape_ (type information) and _state_ (data).
From this living tree, immutable, structurally shared, snapshots are generated automatically.

```javascript
import { types, onSnapshot } from "mobx-state-tree"

const Todo = types.model("Todo", {
    title: types.string,
    done: false
}, {
    toggle() {
        this.done = !this.done
    }
})

const Store = types.model("Store", {
    todos: types.array(Todo)
})

// create an instance from a snapshot
const store = Store.create({ todos: [{
    title: "Get coffee"
}]})

// listen to new snapshots
onSnapshot(store, (snapshot) => {
    console.dir(snapshot)
})

// invoke action that modifies the tree
store.todos[0].toggle()
// prints: `{ todos: [{ title: "Get coffee", done: true }]}`
```

By using the type information available; snapshots can be converted to living trees and vice versa with zero effort.
Because of this, [time travelling](https://github.com/mobxjs/mobx-state-tree/blob/master/examples/boxes/src/stores/time.js) is supported out of the box, and tools like HMR are trivial to support [example](https://github.com/mobxjs/mobx-state-tree/blob/4c2b19ec4a6a8d74064e4b8a87c0f8b46e97e621/examples/boxes/src/stores/domain-state.js#L94).

The type information is designed in such a way that it is used both at design- and run-time to verify type correctness (Design time type checking is TypeScript only atm, Flow PR's are welcome!)

```
[mobx-state-tree] Value '{\"todos\":[{\"turtle\":\"Get tea\"}]}' is not assignable to type: Store, expected an instance of Store or a snapshot like '{ todos: { title: string; done: boolean }[] }' instead.
```

_Runtime type error_

![typescript error](docs/tserror.png)

_Designtime type error_

Because state trees are living, mutable models actions are straight-forward to write; just modify local instance properties where appropiate. See `toggleTodo()` above or the examples below. It is not needed to produce a new state tree yourself, MST's snapshot functionality will derive one for you automatically.

Although mutable sounds scare to some, fear not; actions have many interesting properties.
By default trees cannot only be modified by using an action that belongs to the same subtree.
Furthermore actions are replayable and can be used as means to distribute changes ([example](https://github.com/mobxjs/mobx-state-tree/blob/master/examples/boxes/src/stores/socket.js)).

Moreover; since changes can be detected on a fine grained level. JSON patches are supported out of the box.
Simply subscribing to the patch stream of a tree is another way to sync diffs with for example back-end servers or other clients ([example](https://github.com/mobxjs/mobx-state-tree/blob/master/examples/boxes/src/stores/socket.js)).

(screenshot of patches being emitted)

Since MST uses MobX behind the scenes, it integrates seamlessly with [mobx](https://mobx.js.org) and [mobx-react](github.com/mobxjs/mobx-react).
But even cooler; because it supports snapshots, middleware and replayable actions out of the box, it is even possible to replace a Redux store and reducer with a MobX state tree.
This makes it even possible to connect the Redux devtools to MST. See the [Redux / MST TodoMVC example](https://github.com/mobxjs/mobx-state-tree/blob/4c2b19ec4a6a8d74064e4b8a87c0f8b46e97e621/examples/redux-todomvc/src/index.js#L6).

(screenshot)

Finally, MST has built-in support for references, identifiers, dependency injection, change recording and circular type definitions (even across files).
Even fancier; it analyses liveleness of objects, failing early when you try to access accidentally cached information! (More on that later)

A pretty unique feature of MST is that it offers livelyness guarantees; it will throw when reading or writing from objects that are for whatever reason
no longer part of a state tree. This protects you against accidental stale reads of objects still referred by, for example, a closure.

const oldTodo = store.todos[0]
store.removeTodo(0)

```javascript
function logTodo(todo) {
    setTimeout(
        () => console.log(todo.title),
        1000
    )
)

logTodo(store.todos[0])
store.removeTodo(0)
// throws exception in one second for using an stale object!
```


Despite all that, you will see that the [API](api.md) is pretty straight forward!

---

Another way to look at mobx-state-tree is to consider it, as argued by Daniel Earwicker, to be ["React, but for data"](http://danielearwicker.github.io/json_mobx_Like_React_but_for_Data_Part_2_.html).
Like React, MST consists of composable components, called *models*, which capture a small piece of state. They are instantiated from props (snapshots) and after that manage and protect their own internal state (using actions). Moreover, when applying snapshots, tree nodes are reconciled as much as possible. There is even a context-like mechanism, called environments, to pass information to deep descendants.

An introduction to the philosophy can be watched [here](https://youtu.be/ta8QKmNRXZM?t=21m52s). [Slides](https://immer-mutable-state.surge.sh/). Or, as [markdown](https://github.com/mweststrate/reactive2016-slides/blob/master/slides.md) to read it quickly.

TODO: react europe talk

# Examples

TODO: move https://github.com/mweststrate/react-mobx-shop/tree/mobx-state-tree to this repo

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

TODO: properties & operations

Example:

```javascript
import { types } from "mobx-state-tree"
import uuid from "uuid"

const Box = types.model("Box",{
    // props
    id: types.identifier(),
    name: "",
    x: 0,
    y: 0,

    // computed prop / views
    get width() {
        return this.name.length * 15
    }
}, {
    // actions
    move(dx, dy) {
        this.x += dx
        this.y += dy
    }
})

const BoxStore = types.model("BoxStore",{
    boxes: types.map(Box),
    selection: types.reference("boxes/name")
}, {
    addBox(name, x, y) {
        const box = Box.create({ id: uuid(), name, x, y })
        this.boxes.put(box)
        return box
    }
})

const boxStore = BoxStore.create({
    "boxes": {},
    "selection": ""
});
const box = boxStore.addBox("test",100,100)
box.move(7, 3)
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

## (Un) protecting state tree

`afterCreate() { unprotect(this) }`

## Views

TODO

Views versus actions

Exception: `"Invariant failed: Side effects like changing state are not allowed at this point."` indicates that a view function tries to modifies a model. This is only allowed in actions.

## Protecting the state tree

By default it is allowed to both directly modify a model or through an action.
However, in some cases you want to guarantee that the state tree is only modified through actions.
So that replaying action will reflect everything that can possible have happened to your objects, or that every mutation passes through your action middleware etc.
To disable modifying data in the tree without action, simple call `protect(model)`. Protect protects the passed model an all it's children

```javascript
const Todo = types.model({
    done: false
}, {
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

TODO: document


# Types overview

These are the types available in MST. All types can be found in the `types` namespace, e.g. `types.string`. See [Api Docs](API.md) for examples.

## Complex types

* `types.model(properties, actions)` Defines a "class like" type, with properties and actions to operate on the object.
* `types.array(type)` Declares an array of the specified type
* `types.map(type)` Declares an map of the specified type

## Primitive types

* `types.string`
* `types.number`
* `types.boolean`
* `types.Date`

## Utility types

* `types.union(dispatcher?, types...)` create a union of multiple types. If the correct type cannot be inferred unambigously from a snapshot, provide a dispatcher function.
* `types.optional(type, defaultValue)` marks an value as being optional (in e.g. a model). If a value is not provided the `defaultValue` will be used instead. If `defaultValue` is a function, it will be evaluated. This can be used to generate for example id's or timestamps upon creation.
* `types.literal(value)` can be used to create a literal type, a type which only possible value is specifically that value, very powerful in combination with `union`s. E.g. `temperature: types.union(types.literal("hot"), types.literal("cold"))`.
* `types.refinement(baseType, (snapshot) => boolean)` creates a type that is more specific then the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.
* `types.maybe(type)` makes a type optional and nullable, shorthand for `types.optional(types.union(type, types.literal(null)), null)`.
* `types.late(() => type)` can be used to create recursive or circular types, or types that are spread over files in such a way that circular dependencies between files would be an issue otherwise.
* `types.frozen` Accepts any kind of serializable value (both primitive and complex), but assumes that the value itself is immutable.

## Property types

Property types can only be used as direct member of a `types.model` type and not further composed (for now).
* `types.identifier(subType?)` Only one such member can exist in a `types.model` and should uniquely identify the object. See [identifiers](#identifiers) for more details. `subType` should be either `types.string` or `types.number`, defaulting to the first if not specified.
* `types.reference(targetType, basePath?)` creates a property that is a reference to another item of the given `targetType` somewhere in the same tree. See [references](#references) for more details.

## LifeCycle hooks for `types.model`

| Hook            | Meaning                                                                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterCreate`   | Immediately after an instance is created and initial values are applied. Children will fire this event before parents                                     |
| `afterAttach`   | As soon as the _direct_ parent is assigned (this node is attached to an other node)                                                                       |
| `beforeDetach`  | As soon as the node is removed from the _direct_ parent, but only if the node is _not_ destroyed. In other words, when `detach(node)` is used             |
| `beforeDestroy` | Before the node is destroyed as a result of calling `destroy` or removing or replacing the node from the tree. Child destructors will fire before parents |

# Api overview



## Single or multiple state

## Using mobx and mobx-state-tree together

## Integrations

# Examples

# Environments

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

TypeScript support is best effort, as not all patterns can be expressed in TypeScript. But except for assigning snapshots to properties we got pretty close! As MST uses the latest fancy typescript features it is recommended to use TypeScript 2.3 or higher, with `noImplicitThis` and `strictNullChecks` enabled.

When using models, you write interface along with it's property types that will be used to perform type checks at runtime.
What about compile time? You can use TypeScript interfaces indeed to perform those checks, but that would require writing again all the properties and their actions!

Good news? You don't need to write it twice! Using the `typeof` operator of TypeScript over the `.Type` property of a MST Type, will result in a valid TypeScript Type!

```typescript
const Todo = types.model({
    title: types.string
}, {
    setTitle(v: string) {
        this.title = v
    }
})
type ITodo = typeof Todo.Type // => ITodo is now a valid TypeScript type with { title: string; setTitle: (v: string) => void }
```


## Circular dependencies:

`types.late(() => require("./OtherType"))`