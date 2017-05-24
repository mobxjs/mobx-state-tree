![MST logo](docs/logo.png)

# mobx-state-tree

_Opinionated, transactional, MobX powered state container combining the best features of the immutable and mutable world for an optimal DX_

[![Build Status](https://travis-ci.org/mobxjs/mobx-state-tree.svg?branch=master)](https://travis-ci.org/mobxjs/mobx-state-tree)
[![Coverage Status](https://coveralls.io/repos/github/mobxjs/mobx-state-tree/badge.svg?branch=master)](https://coveralls.io/github/mobxjs/mobx-state-tree?branch=master)
[![Join the chat at https://gitter.im/mobxjs/mobx](https://badges.gitter.im/mobxjs/mobx.svg)](https://gitter.im/mobxjs/mobx?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**DISCLAIMER: Docs are still being worked on, so if you are confused at any point; we hope to see you back soon, or feel free to open issue or join the gitter channel**

# Contents

* [Installation](#installation)
* [Philosophy & Overview](#philosophy--overview)
* [MST overview for the impatient](#quick-overview-for-the-impatient)
* [Concepts](#concepts)
  * [Trees, types and state](#trees-types-and-state)
  * [Creating models](#construction-models)
  * [Tree semantics in detail](#tree-semantis-in-detail)
  * [Composing trees](#composing-trees)
  * [Actions](#actions)
  * [Snapshots](#snapshots)
  * [Patches](#patches)
  * [References and identifiers](#references-and-identifiers)
  * [Listening to observables, snapshots, patches or actions](#listening-to-observables-snapshots-patches-or-actions)
* [Types overview](#types-overview)
* [Api overview](#api-overview)
* [Tips](#tips)
* [FAQ](#FAQ)
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

Although mutable sounds scary to some, fear not; actions have many interesting properties.
By default trees cannot only be modified by using an action that belongs to the same subtree.
Furthermore, actions are replayable and can be used as means to distribute changes ([example](https://github.com/mobxjs/mobx-state-tree/blob/master/examples/boxes/src/stores/socket.js)).

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

mobx-state-tree "immutable trees" and "graph model" features talk, ["Next Generation State Management"](https://www.youtube.com/watch?v=rwqwwn_46kA) at React Europe 2017. [Slides](http://tree.surge.sh/#1).

# Examples

* [Bookshop](https://github.com/mobxjs/mobx-state-tree/tree/master/examples/bookshop) Example webshop application with references, identifiers, routing, testing etc.
* [Boxes](https://github.com/mobxjs/mobx-state-tree/tree/master/examples/boxes) Example app where on can draw, drag and drop boxes. With time travelling and multi client synchronization over websockets.
* [Redux TodoMVC](https://github.com/mobxjs/mobx-state-tree/tree/master/examples/redux-todomvc) Redux TodoMVC application, except that the reducers are replaced with a MST. Tip: open the Redux devtools; they will work!

# Concepts

With MobX state tree, you build, as the name suggests, trees of models.

### Trees, types and state

Each **node** in the tree is described by two things: Its **type** (the shape of the thing) and its **data** (the state it is currently in).

The simplest tree possible:

```javascript
import {types} from "mobx-state-tree"

// declaring the shape of a node with the type `Todo`
const Todo = types.model({
    title: types.string
})

// creating a tree based on the "Todo" type, with initial data:
const coffeeTodo = Todo.create({
    title: "Get coffee"
})
```

The `types.model` type declaration is used to describe the shape of an object.
Other built-in types include arrays, maps, primitives etc. See the [types overview](#types-overview).
The type information will be used for both


### Creating models

The most important type in MST is `types.model`, which can be used to describe the shape of an object.
An example:

```javascript
const TodoStore = types.model("TodoStore", {      // 1
    loaded: type.boolean                          // 2
    endpoint: "http://localhost",                 // 3
    todos: types.array(Todo),                     // 4
    selectedTodo: types.reference(Todo, "todos"), // 5
    get completedTodos() {                        // 6
        return this.todos.filter(t => t.done)
    },
    findTodosByUser(user) {                       // 7
        return this.todos.filter(t => t.assignee = user)
    }
}, {
    addTodo(title) {
        this.todos.push({
            id: Math.random(),
            title
        })
    }
})
```

When defining a model, it is adviced to give the model a name for debugging purposes (see `// 1`).
A model takes two objects arguments, first all the properties, then the actions.

The _properties_ argument is a key-value set where each key indicates the introduction of a property, and the value it's type. The following types are acceptable as type:

1. A type. This can be a simple primitive type like `types.boolean`, see `// 2`, or a complex, possible earlier defined type (`// 4`)
2. A primitive. Using a primitive as type as type is syntactic sugar for introducing an property with a default value. See `// 3`, `endpoint: "http://localhost"` is the same as `endpoint: types.optional(types.string, "http://localhost")`. The primitive type is inferred from the default value. Properties with a default value can be omitted in snapshots.
3. A [computed property](https://mobx.js.org/refguide/computed-decorator.html), see `// 6`. Computed properties are tracked and memoized by MobX. Computed properties will not be stored in snapshots or emit patch events. It is allowed to provid a setter for a computed property as well. A setter should always invoke an action.
4. A view function (see `// 7`). A view function can, unlike computed properties, take arbitrary arguments. It won't be memoized, but it's value can be tracked by Mobx nonetheless. View functions are not allowed to change the model, but should rather be used to retrieve information from the model.

The _actions_ argument is a key-value set with actions that are available to manage the model. Only actions are allowed to manage models (including any contained objects).

It is also possible to define lifecycle hooks in the _actions_ object, these are actions with a predefined name that are run at a specific moment. See [Lifecycle hooks](#lifecycle-hooks-for-typesmodel).

_Tip: Note that `{ action1() { }, action2() { }}` is ES6 syntax for `{ action1: function() { }, action2: function() { } }`, in other words; it's just an object literal.
For that reason a comma between each member of a model is mandatory, unlike classes which are syntactically a totally different concept._

### Tree semantics in detail

MST trees have very specific semantics. These semantics purposefully constraint what you can do with MST. The reward for that are all kind of generic features out of the box like snapshots, replayability etc. If these constraints don't suit your app, you are probably better of using plain mobx with your own model classes. Which is perfectly fine as well.

1. Each object in a MST tree is concidered a _node_. Each primitive (and frozen) value is considered a _leaf_.
1. MST has only tree types of nodes; _model_, _array_, and _map_.
1. Every _node_ tree in a MST tree is a tree in itself. Any operation that can be invoked on the complete tree, can also be applied to only a sub tree.
1. A node can exists exactly only _once_ in a tree. This ensures it has an unique, identifiable position.
2. It is however possible to refer to another object in the _same_ tree by using _references_
3. There is no limit to the amount of MST trees that live in an application. However, each node can live in exactly only one tree.
4. All _leaves_ in the tree must be serializable; it is not possible to store for example functions in a MST.
6. The only free form type in MST is frozen; with the requirement that frozen values are immutable so that the MST semantics can still be uphold.
7. At any point in the tree it is possible to assign a snapshot to the tree instead of a concrete instance of the expect type. In that case an instance of the correc type, based on the snapshot, will be automatically created for you.
8. Nodes in the MST tree will be reconciled (the exact same instance will be reused) when updating the tree by any means, based on their _identifier_ property. If there is no identifier property, instances won't be reconciled.
9. If a node in the tree is replaced by another node, the original node will die and become unusable. This makes sure you are not accidentally holding on to stale objects anywhere in your application.
10. If you want to create a new node based on an existing node in a tree, you can either `detach` that node, or `clone` it.

### Composing trees

In MST every node in the tree is a tree in itself.
Trees can be composed by composing their types:

```javascript
const TodoStore = types.model({
    todos: types.array(Todo)
})

const storeInstance = TodoStore.create({
    todos: [{
        title: "Get biscuit"
    }]
})
```

The _snapshot_ passed to the `create` method of a type will recursively be turned in MST nodes. So you can safely call:

```javascript
storeInstance.todos[0].setTitle("Chocolate instead plz")
```

Since any node in a tree, is an tree in itself, any built-in method in MST can be invoked on any node in the tree, not just the root.
This makes it possible to get a patch stream of a certain subtree, or to apply middleware to a certain subtree only.

### Actions

By default, nodes can only be modified by one of their actions, or actions higher up in the tree.
Actions can be defined by passing a second object to to `types.model`:

```javascript
const Todo = types.model({
    title: types.string
}, {
    setTitle(newTitle) {
        this.title = newTitle
    }
})
```

Actions are replayable and are therefore constrained in several ways:

- Trying to modify a node without using an action will throw an exception.
- All action arguments should be serializable. Some arguments can be serialized automatically, such as relative paths to other nodes
- Actions can only modify models that belong to the (sub)tree on which they are invoked
- Actions are automatically bound the their instance, so it is save to pass actions around first class without binding or wrapping in arrow functions.

Useful methods:

-   `onAction(model, listener)` listens to any action that is invoked on the model or any of it's descendants. See `onAction` for more details.
-   `addMiddleware(model, middleware)` listens to any action that is invoked on the model or any of it's descendants. See `addMiddleware` for more details.
-   `applyAction(model, action)` invokes an action on the model according to the given action description

#### Action listeners versus middleware

The difference between action listeners and middlewares is: Middleware can intercept the action that is about to be invoked, modify arguments, return types etc. Action listeners cannot intercept, but are only notified. Action listeners receive the action arguments in a serializable format, while middleware receive the raw arguments. (`onAction` is actually just a built-in middleware)

#### Disabling protected mode

If the default protection of mobx-state-tree doesn't fit your use case. For example if you are not interested in replayable actions or hate the effort of writing actions to modify any field; `unprotect(tree)` will disable the protected mode of a tree, allowing anyone to directly modify the tree.

### Snapshots

Snapshots are the immutable serialization in plain objects of a tree at a specific point in time.
Snapshots can be inspected through `getSnapshot(node)`.
Snapshots don't contain any type information and are stripped from all actions etc, so they are perfectly suitable for tranportation.
Requesting a snapshot is cheap, as MST always maintains a snapshot of each node in the background, and uses structural sharing

```javascript
coffeeTodo.setTitle("Tea instead plz")

console.dir(getSnapshot(coffeeTodo))
// prints `{ title: "Tea instead plz" }`
```

Some interesting properties of snapshots:

-   Snapshots are immutable
-   Snapshots can be transported
-   Snapshots can be used to update / restore models to a certain state
-   Snapshots are automatically converted to models when needed. So the two following statements are equivalent: `store.todos.push(Todo.create({ title: "test" }))` and `store.todos.push({ title: "test" })`.
Useful methods:

-   `getSnapshot(model)`: returns a snapshot representing the current state of the model
-   `onSnapshot(model, callback)`: creates a listener that fires whenever a new snapshot is available (but only one per MobX transaction).
-   `applySnapshot(model, snapshot)`: updates the state of the model and all its descendants to the state represented by the snapshot

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

### References and identifiers

References and identifiers are a first class concept in MST.
This makes it possible to declare references and keeping the data normalized in the background, while you interect with it in a denormalized manner.

Example:
```javascript
const Todo = types.model({
    id: types.identifier(),
    title: types.string
})

const TodoStore = types.model({
    todos: types.array(Todo),
    selectedTodo: types.reference(Todo, "todos")
})

// create a store with a normalized snapshot
const storeInstance = TodoStore.create({
    todos: [{
        id: "47",
        title: "Get coffee"
    }],
    selectedTodo: "47"
})

// because `selectedTodo` is declared to be a reference, it returns the actual Todo node with the matching identifier
console.log(storeInstance.selectedTodo.title)
// prints "Get coffee"
```

#### Identifiers

-   Each model can define zero or one `identifier()` properties
-   The identifier property of an object cannot be modified after initialization
-   Identifiers should be unique within their parent collection (`array` or `map`)
-   Identifiers are used to reconcile items inside arrays and maps wherever possible when applying snapshots
-   The `map.put()` method can be used to simplify adding objects to maps that have identifiers


#### References

References can be defined in two ways, generic or namespaces.

Namespaced references can only put to elements of the correct type, at a predefined location (namespace). Namespaced references always use the `identifier()` property of the targeted object.
The above example: `selectedTodo: types.reference(Todo, "todos")` is namespaced, and resolves it's target in the collection on the relative path `"todos"`. (`"../todos"` can be used to identify a namespace one level higher in the tree etc.)

Generic references can point to any element of the correct type in the current tree, and are stored behind the scenes as JSON path. The above example could also have been configured as `selectedTodo: types.reference(Todo)` to create a generic reference.

_Tip: It is recommended to use namespaced references; as those are more stable by since they always use immutable references and a preconfigured namespace._

**Note: The exact semantics of references are still under investigation, and might change before MST 1.0. One of the two forms might be dropped_**

### Listening to observables, snapshots, patches or actions

MST is powered by MobX. This means that it is immediately compatible with `observer` components, or reactions like `autorun`:

```javascript
import { autorun } from "mobx"

autorun(() => {
    console.log(storeInstance.selectedTodo.title)
})
```

But since MST keeps immutable snapshots in te background, it is also possible to be notified when a new snapshot of the tree is available, similar to `.subscribe` on a redux store:

```javascript
onSnapshot(storeInstance, newSnapshot => {
    console.dir("Got new state: ", newSnapshot)
})
```

However, sometimes it is more useful to precisely know what has changed rather than just receiving a complete new snapshot.
For that, MST supports json-patches out of the box

```javascript
onPatch(storeInstance, patch => {
    console.dir("Got change: ", patch)
})

storeInstance.todos[0].setTitle("Add milk")
// prints:
{
    path: "/todos/0",
    op: "replace",
    value: "Add milk"
}
```

Similarly, you can be notified whenever an action is invoked by using `onAction`

```javascript
onAction(storeInstance, call => {
    console.dir("Action was called: ", call)
})

storeInstance.todos[0].setTitle("Add milk")
// prints:
{
    path: "/todos/0",
    name: "setTitle",
    args: ["Add milk"]
}
```

It is even possible to intercept actions before they are applied by adding middleware using `addMiddleware`:

```javascript
addMiddleware(storeInstance, (call, next) => {
    call.args[0] = call.args[0].replace(/tea/gi, "Coffee")
    return next(call)
})
```

Finally, it is not only possible to be notified about snapshots, patches or actions.
It is also possible to re-apply them by respectively `applySnapshot`, `applyPatch` or `applyAction`!

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

| signature | |
| ---- | --- |
| `addDisposer(node, () => void) ` | Function to be invoked whenever the target node is to be destroyed |
| `addMiddleware(node, middleware: (actionDescription, next) => any)` | Attaches middleware to a node. See [actions](#actions). Returns disposer. |
| `applyAction(node, actionDescription)` | Replays an action on the targeted node |
| `applyPatch(node, jsonPatch)` | Applies a JSON patch to a node in the tree |
| `applySnapshot(node, snapshot)` | Updates a node with the given snapshot |
| `asReduxStore(node)` | Wraps a node in a Redux store compatible api |
| `clone(node, keepEnvironment?: true \| false \| newEnvironment)` | Creates a full clone of a certain node. By default preserves the same environment |
| `connectReduxDevtools(removeDevModule, node)` | Connects a node to the redux development tools [example](https://github.com/mobxjs/mobx-state-tree/blob/b01fe97d427ca664f7ecc99349d10e58d08d2d98/examples/redux-todomvc/src/index.js)  |
| `destroy(node)` | Kills a node, making it unusable. Removes it from any parent in the process |
| `detach(node)` | Removes a node from it's current parent, and let's it live on as stand alone tree |
| `getChildType(node, property?)` | Returns the declared type of the given property of a node. For arrays and maps `property` can be omitted as they all have the same type |
| `getEnv(node)` | Returns the environment of the given node, see [environments](#environments) |
| `getParent(node, depth=1)` | Returns the intermediate parent of the given node, or a higher one if `depth > 1` |
| `getPath(node)` | Returns the path of a certain node in the tree |
| `getPathParts(node)` | Returns the path of a certain node in the tree, unescaped as separate parts |
| `getRelativePath(base, target)` | Returns the short path which one could use to walk from node `base` to node `target`, assuming they are in the same tree. Up is represented as `../` |
| `getRoot(node)` | Returns the root element of the tree containing `node` |
| `getSnapshot(node)` | Returns the snapshot of provided node. See [snapshots](#snapshots) |
| `getType(node)` | Returns the type of the given node |
| `hasParent(node, depth=1)` | Returns `true` if the node has a parent at the given `depth` |
| `isAlive(node)` | Returns `true` if the node hasn't died yet |
| `isMST(value)` | Returns `true` if the value is a node of a mobx-state-tree |
| `isProtected(value)` | Returns `true` if the given node is protected, see [actions](#actions) |
| `isRoot(node)` | Returns true if the has no parents  |
| `joinJsonPath(parts)` | Joins and escapes the given path parts into a json path |
| `onAction(node, (actionDescription) => void` | A built-in middleware that calls the provided callback with an action description upon each invocation. Returns disposer |
| `onPatch(node, (patch) => void)` | Attach a JSONPatch listener, that is invoked for each change in the tree. Returns disposer |
| `onSnapshot` | Attach a snapshot listener, that is invoked for each change in the tree. Returns disposer |
| `protect` | Protects an unprotected tree against modifications from outside actions |
| `recordActions(node)` | Creates a recorder that listens to all actions in the node. Call `.stop()` on the recorder to stop this, and `.replay(target)` to replay the recorded actions on another tree  |
| `recordPatches` | Creates a recorder that listens to all patches emitted by the node. Call `.stop()` on the recorder to stop this, and `.replay(target)` to replay the recorded patches on another tree |
| `resolve(node, path)` | Resolves a `path` (json path) relatively to the given `node` |
| `splitJsonPath(path)` | Splits and unescapes the given json path into path parts |
| `tryResolve(node, path)` | Like `resolve`, but just returns `null` if resolving fails at any point in the path |
| `unprotect(node)` | Unprotects a node, making it possible to directly modify any value in the subtree, without actions |
| `walk(startNode, (node) => void)` | Performs a depth-first walk through a tree |

A _disposer_ is a function that cancels the effect it was created for.

# Tips

### `toJSON()` for debugging

For debugging you might want to use `getSnapshot(model)` to print the state of a model. But if you didn't import `getSnapshot` while debugging in some debugger; don't worry, `model.toJSON()` will produce the same snapshot. (For api consistency, this feature is not part of the typed api)

### Handle circular dependencies between files using `late`

On the exporting file:

```javascript
export function LateStore() {
    return types.model({
        title: types.string
    })
}
```

In the importing file
```javascript
import { LateStore } from "./circular-dep"

const Store = types.late(() => LateStore)
```

Thanks to function hoisting in combination with `types.late`, this makes sure you can have circular dependencies between types accross files.

### Simulate inheritance by using type composition

There is no notion of inheritance in MST. The recommended approach is to keep an references to the original configuration of a model to compose it into a new one. (`types.extend` achieves this as well, but it might change or even be removed). So a classical animal inheritance could be expressed using composition as follows:

```javascript
const animalProperties: {
    age: types.number,
    sound: types.string
}

const animalActions = {
    makeSound() {
        console.log(this.sound)
    }
}

const Dog = types.model(
    { ...animalProperties, sound: "woof" },
    animalActions
)

const Cat = types.model(
    { ...animalProperties, sound: "meaow" },
    animalActions
)

const Animal = types.union(Dog, Cat)
```

### Creating enumerations

There is no built-in type for enumerations, but enumarations can simply be constructed by combining unions and literals:

```javascript
const Temperature = types.union(types.literal("Hot"), types.literal("Cold"))
```

Or, fancier:

```javascript
const Temperature = types.union(...["Hot", "Cold"].map(types.literal))
```


# FAQ

### Using mobx and mobx-state-tree together

Yep, perfectly fine. No problem. Go on. `observer`, `autorun` etc will work as expected.

### Should all state of my app be stored in `mobx-state-tree`?
No, or, not necessarily. An application can use both state trees and vanilla MobX observables at the same time.
State trees are primarily designed to store your domain data, as this kind of state is often distributed and not very local.
For, for example, local component state, vanilla MobX observables might often be simpler to use.

### TypeScript & MST

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

### How does MST compare to Redux

So far this might look a lot like an immutable state tree as found for example in Redux apps, but there are a few differences:

-   like Redux, and unlike MobX, MST prescribes a very specific state architecture.
-   mobx-state-tree allow direct modification of any value in the tree, it is not needed to construct a new tree in your actions.
-   mobx-state-tree allows for fine grained and efficient observability on any point in the state tree.
-   mobx-state-tree generates json patches for any modification that is made.
-   mobx-state-tree provides utilties to turn any MST tree into a valid Redux store.
-   having multiple MSTs in a single application is perfectly fine.


## Thanks!

* [Mendix](https://mendix.com) for sponsoring and providing the opportunity to work on exploratory projects like MST.
* [Dan Abramov](https://twitter.com/dan_abramov)'s work on [Redux](http://redux.js.org) has strongly influenced the idea of snapshots and transactional actions in MST.
* [Giulio Canti](https://twitter.com/GiulioCanti)'s work on [tcomb](http://github.com/gcanti/tcomb) and type systems in general has strongly influenced the type system of MST.
* All the early adopters encouraging to pursue this whole idea and proving it is something feasible.
