<p align="center">
       <img src="docs/logo.png" height="100">
    <h3 align="center">mobx-state-tree</h3>
    <p align="center"><i>Opinionated, transactional, MobX powered state container combining the best features of the immutable and mutable world for an optimal DX</i><p>
</p>

[![npm version](https://badge.fury.io/js/mobx-state-tree.svg)](https://badge.fury.io/js/mobx-state-tree)
[![Build Status](https://travis-ci.org/mobxjs/mobx-state-tree.svg?branch=master)](https://travis-ci.org/mobxjs/mobx-state-tree)
[![Coverage Status](https://coveralls.io/repos/github/mobxjs/mobx-state-tree/badge.svg?branch=master)](https://coveralls.io/github/mobxjs/mobx-state-tree?branch=master)
[![Join the chat at https://gitter.im/mobxjs/mobx-state-tree](https://badges.gitter.im/mobxjs/mobx-state-tree.svg)](https://gitter.im/mobxjs/mobx-state-tree?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


> Mobx and MST are amazing pieces of software, for me it is the missing brick when you build React based apps. Thanks for the great work!

Nicolas Galle [full post](https://medium.com/@nicolasgall/i-started-to-use-react-last-year-and-i-loved-it-1ce8d53fec6a)


Introduction blog post [The curious case of MobX state tree](https://medium.com/@mweststrate/the-curious-case-of-mobx-state-tree-7b4e22d461f)

# Contents

* [Installation](#installation)
* [Getting Started](docs/getting-started.md)
* [Talks & blogs](#talks--blogs)
* [Philosophy & Overview](#philosophy--overview)
* [Examples](#examples)
* [Concepts](#concepts)
  * [Trees, types and state](#trees-types-and-state)
  * [Creating models](#creating-models)
  * [Tree semantics in detail](#tree-semantics-in-detail)
  * [Composing trees](#composing-trees)
  * [Actions](#actions)
  * [Snapshots](#snapshots)
  * [Patches](#patches)
  * [References and identifiers](#references-and-identifiers)
  * [Listening to observables, snapshots, patches or actions](#listening-to-observables-snapshots-patches-or-actions)
  * [Volatile state](#volatile-state)
  * [Dependency injection](#dependency-injection)
* [Types overview](#types-overview)
  * [Lifecycle hooks](#lifecycle-hooks-for-typesmodel)
* [Api overview](#api-overview)
* [Tips](#tips)
* [FAQ](#FAQ)
* [Full Api Docs](API.md)
* [Built-in / example middlewares](middleware/README.md)
* [Changelog](changelog.md)

# Installation

* NPM: `npm install mobx mobx-state-tree --save`
* Yarn: `yarn add mobx mobx-state-tree`
* CDN: https://unpkg.com/mobx-state-tree@0.8.2/dist/mobx-state-tree.umd.js (exposed as `window.mobxStateTree`)
* Playground: [https://mattiamanzati.github.io/mobx-state-tree-playground/](https://mattiamanzati.github.io/mobx-state-tree-playground/) (with React UI, snapshots, patches and actions display)
* CodeSandbox [TodoList demo](https://codesandbox.io/s/nZ26kGMD) fork for testing and bug reporting

Typescript typings are included in the packages. Use `module: "commonjs"` or `moduleResolution: "node"` to make sure they are picked up automatically in any consuming project.

# Getting started

See the [Getting started](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/getting-started.md#getting-started) tutorial.

# Talks & blogs

* Talk React Europe 2017: [Next generation state management](https://www.youtube.com/watch?v=rwqwwn_46kA)
* Talk ReactNext 2017: [React, but for Data](https://www.youtube.com/watch?v=xfC_xEA8Z1M&index=6&list=PLMYVq3z1QxSqq6D7jxVdqttOX7H_Brq8Z) ([slides](http://react-next-2017-slides.surge.sh/#1), [demo](https://codesandbox.io/s/8y4p23j32j))
* Talk ReactJSDay Verona 2017: [Immutable or immutable? Both!]() ([slides](https://mweststrate.github.io/reactjsday2017-presentation/index.html#1), [demo](https://github.com/mweststrate/reatjsday2017-demo))
* Talk React Alicante 2017: [Mutable or Immutable? Let's do both!]() ([slides](https://mattiamanzati.github.io/slides-react-alicante-2017/#2))
* Talk ReactiveConf 2016: [Immer-mutable state management](https://www.youtube.com/watch?v=Ql8KUUUOHNc&list=PLa2ZZ09WYepMCRRGCRPhTYuTCat4TiDlX&index=30)

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
}).actions(self => ({
    toggle() {
        self.done = !self.done
    }
}))

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

By using the type information available, snapshots can be converted to living trees, and vice versa, with zero effort.
Because of this, [time travelling](https://github.com/mobxjs/mobx-state-tree/blob/master/packages/mst-example-boxes/src/stores/time.js) is supported out of the box, and tools like HMR are trivial to support [example](https://github.com/mobxjs/mobx-state-tree/blob/4c2b19ec4a6a8d74064e4b8a87c0f8b46e97e621/examples/boxes/src/stores/domain-state.js#L94).

The type information is designed in such a way that it is used both at design- and run-time to verify type correctness (Design time type checking works in TypeScript only at the moment; Flow PR's are welcome!)

```
[mobx-state-tree] Value '{\"todos\":[{\"turtle\":\"Get tea\"}]}' is not assignable to type: Store, expected an instance of Store or a snapshot like '{ todos: { title: string; done: boolean }[] }' instead.
```

_Runtime type error_

![typescript error](docs/tserror.png)

_Designtime type error_

Because state trees are living, mutable models, actions are straight-forward to write; just modify local instance properties where appropriate. See `toggleTodo()` above or the examples below. It is not necessary to produce a new state tree yourself, MST's snapshot functionality will derive one for you automatically.

Although mutable sounds scary to some, fear not: actions have many interesting properties.
By default trees can only be modified by using an action that belongs to the same subtree.
Furthermore, actions are replayable and can be used to distribute changes ([example](https://github.com/mobxjs/mobx-state-tree/blob/master/packages/mst-example-boxes/src/stores/socket.js)).

Moreover, because changes can be detected on a fine grained level, JSON patches are supported out of the box.
Simply subscribing to the patch stream of a tree is another way to sync diffs with, for example, back-end servers or other clients ([example](https://github.com/mobxjs/mobx-state-tree/blob/master/packages/mst-example-boxes/src/stores/socket.js)).

![patches](docs/patches.png)

Since MST uses MobX behind the scenes, it integrates seamlessly with [mobx](https://mobx.js.org) and [mobx-react](https://github.com/mobxjs/mobx-react).
But even cooler: because it supports snapshots, middleware and replayable actions out of the box, it is even possible to replace a Redux store and reducer with a MobX state tree.
This makes it even possible to connect the Redux devtools to MST. See the [Redux / MST TodoMVC example](https://github.com/mobxjs/mobx-state-tree/blob/4c2b19ec4a6a8d74064e4b8a87c0f8b46e97e621/examples/redux-todomvc/src/index.js#L6).

![devtools](docs/reduxdevtools.png)

Finally, MST has built-in support for references, identifiers, dependency injection, change recording and circular type definitions (even across files).
Even fancier: it analyses liveliness of objects, failing early when you try to access accidentally cached information! (More on that later)

A pretty unique feature of MST is that it offers liveliness guarantees; it will throw when reading or writing from objects that are no longer part of a state tree. This protects you against accidental stale reads of objects still referred by, for example, a closure.

```javascript
const oldTodo = store.todos[0]
store.removeTodo(0)

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


Despite all that, you will see that the [API](API.md) is pretty straightforward!

---

Another way to look at mobx-state-tree is to consider it, as argued by Daniel Earwicker, to be ["React, but for data"](http://danielearwicker.github.io/json_mobx_Like_React_but_for_Data_Part_2_.html).
Like React, MST consists of composable components, called *models*, which captures a small piece of state. They are instantiated from props (snapshots) and after that manage and protect their own internal state (using actions). Moreover, when applying snapshots, tree nodes are reconciled as much as possible. There is even a context-like mechanism, called environments, to pass information to deep descendants.

An introduction to the philosophy can be watched [here](https://youtu.be/ta8QKmNRXZM?t=21m52s). [Slides](https://immer-mutable-state.surge.sh/). Or, as [markdown](https://github.com/mweststrate/reactive2016-slides/blob/master/slides.md) to read it quickly.

mobx-state-tree "immutable trees" and "graph model" features talk, ["Next Generation State Management"](https://www.youtube.com/watch?v=rwqwwn_46kA) at React Europe 2017. [Slides](http://tree.surge.sh/#1).

# Examples

* [Bookshop](https://github.com/mobxjs/mobx-state-tree/tree/master/packages/mst-example-bookshop) Example webshop application with references, identifiers, routing, testing etc.
* [Boxes](https://github.com/mobxjs/mobx-state-tree/tree/master/packages/mst-example-boxes) Example app where one can draw, drag, and drop boxes. With time-travelling and multi-client synchronization over websockets.
* [Redux TodoMVC](https://github.com/mobxjs/mobx-state-tree/tree/master/packages/mst-example-redux-todomvc) Redux TodoMVC application, except that the reducers are replaced with a MST. Tip: open the Redux devtools; they will work!

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
The type information will be used for both.


### Creating models

The most important type in MST is `types.model`, which can be used to describe the shape of an object.
An example:

```javascript
const TodoStore = types
    .model("TodoStore", {                             // 1
        loaded: types.boolean                         // 2
        endpoint: "http://localhost",                 // 3
        todos: types.array(Todo),                     // 4
        selectedTodo: types.reference(Todo)           // 5
    })
    .views(self => {
    	return {
	    get completedTodos() {                    // 6
	        return self.todos.filter(t => t.done)
	    },
	    findTodosByUser(user) {                   // 7
	        return self.todos.filter(t => t.assignee === user)
	    }
	};
    })
    .actions(self => {
        return {
            addTodo(title) {
                self.todos.push({
                    id: Math.random(),
                    title
                })
            }
	};
    })
```

When defining a model, it is advised to give the model a name for debugging purposes (see `// 1`).
A model takes additionally object argument defining the properties.

The _properties_ argument is a key-value set where each key indicates the introduction of a property, and the value its type. The following types are acceptable:

1. A type. This can be a simple primitive type like `types.boolean`, see `// 2`, or a complex, possibly pre-defined type (`// 4`)
2. A primitive. Using a primitive as type is syntactic sugar for introducing a property with a default value. See `// 3`, `endpoint: "http://localhost"` is the same as `endpoint: types.optional(types.string, "http://localhost")`. The primitive type is inferred from the default value. Properties with a default value can be omitted in snapshots.
3. A [computed property](https://mobx.js.org/refguide/computed-decorator.html), see `// 6`. Computed properties are tracked and memoized by MobX. Computed properties will not be stored in snapshots or emit patch events. It is possible to provide a setter for a computed property as well. A setter should always invoke an action.
4. A view function (see `// 7`). A view function can, unlike computed properties, take arbitrary arguments. It won't be memoized, but its value can be tracked by MobX nonetheless. View functions are not allowed to change the model, but should rather be used to retrieve information from the model.

_Tip: `(self) => ({ action1() { }, action2() { }})` is ES6 syntax for `function (self) { return { action1: function() { }, action2: function() { } }}`, in other words; it's short way of directly returning an object literal.
For that reason a comma between each member of a model is mandatory, unlike classes which are syntactically a totally different concept._

`types.model` creates a chainable model type, where each chained method produces a new type:
* `.named(name)` clones the current type, but gives it a new name
* `.props(props)` produces a new type, based on the current one, and adds / overrides the specified properties
* `.actions(self => object literal with actions)` produces a new type, based on the current one, and adds / overrides the specified actions
* `.views(self => object literal with view functions)` produces a new type, based on the current one, and adds / overrides the specified view functions
* `.preProcessSnapshot(snapshot => snapshot)` can be used to pre-process the raw JSON before instantiating a new model. See [Lifecycle hooks](#lifecycle-hooks-for-typesmodel)

Note that `views` and `actions` don't define actions and views directly, but rather they should be given a function.
The function will be invoked when a new model instance is created. The instance will be passed in as the first and only argument. Typically called `self`.
This has two advantages:
1. All methods will always be bound correctly, and won't suffer from an unbound `this`
2. The closure can be used to store private state or methods of the instance. See also [actions](#actions) and [volatile state](#volatile-state).

Quick example:

```javascript
const TodoStore = types
    .model("TodoStore", { /* props */ })
    .actions(self => {
        const instantiationTime = Date.now()

        function addTodo(title) {
            console.log(`Adding Todo ${title} after ${(Date.now() - instantiationTime) / 1000}s.`)
            self.todos.push({
                id: Math.random(),
                title
            })
        }

        return { addTodo }
    })
```

It is perfectly fine to chain multiple `views`, `props` calls etc in arbitrary order. This can be a great way to structure complex types, mix-in utility functions etc. Each call in the chain creates a new, immutable type which can itself be stored and reused as part of other types, etc.

It is also possible to define lifecycle hooks in the _actions_ object, these are actions with a predefined name that are run at a specific moment. See [Lifecycle hooks](#lifecycle-hooks-for-typesmodel).

### Tree semantics in detail

MST trees have very specific semantics. These semantics purposefully constrain what you can do with MST. The reward for that is all kinds of generic features out of the box like snapshots, replayability, etc... If these constraints don't suit your app, you are probably better of using plain mobx with your own model classes. Which is perfectly fine as well.

1. Each object in a MST tree is considered a _node_. Each primitive (and frozen) value is considered a _leaf_.
1. MST has only three types of nodes; _model_, _array_, and _map_.
1. Every _node_ tree in a MST tree is a tree in itself. Any operation that can be invoked on the complete tree can also be applied to a sub tree.
1. A node can only exist exactly _once_ in a tree. This ensures it has a unique, identifiable position.
2. It is however possible to refer to another object in the _same_ tree by using _references_
3. There is no limit to the amount of MST trees that live in an application. However, each node can only live in exactly one tree.
4. All _leaves_ in the tree must be serializable; it is not possible to store, for example, functions in a MST.
6. The only free-form type in MST is frozen; with the requirement that frozen values are immutable so that the MST semantics can still be upheld.
7. At any point in the tree it is possible to assign a snapshot to the tree instead of a concrete instance of the expected type. In that case an instance of the correct type, based on the snapshot, will be automatically created for you.
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

Because any node in a tree is an tree in itself, any built-in method in MST can be invoked on any node in the tree, not just the root.
This makes it possible to get a patch stream of a certain subtree, or to apply middleware to a certain subtree only.

### Actions

By default, nodes can only be modified by one of their actions, or by actions higher up in the tree.
Actions can be defined by returning an object from the action initializer function that was passed to `actions`.
The initializer function is executed for each instance, so that `self` is always bound to the current instance.
Also, the closure of that function can be used to store so called _volatile_ state for the instance, or to create private functions that can only
be invoked from the actions, but not from the outside.

```javascript
const Todo = types.model({
        title: types.string
    })
    .actions(self => {
        function setTitle(newTitle) {
            self.title = newTitle
        }

        return {
            setTitle
        }
    })
```

Or, shorter if no local state or private functions are involved:

```javascript
const Todo = types.model({
        title: types.string
    })
    .actions(self => ({ // note the `({`, we are returning an object literal
        setTitle(newTitle) {
            self.title = newTitle
        }
    }))
```

Actions are replayable and are therefore constrained in several ways:

- Trying to modify a node without using an action will throw an exception.
- It's recommended to make sure action arguments are serializable. Some arguments can be serialized automatically, such as relative paths to other nodes
- Actions can only modify models that belong to the (sub)tree on which they are invoked
- You cannot use `this` inside actions, instead, use `self`. This makes it safe to pass actions around without binding them or wrapping them in arrow functions.

Useful methods:

-   [`onAction`](API.md#onaction) listens to any action that is invoked on the model or any of its descendants.
-   [`addMiddleware`](API.md#addmiddleware) listens to any action that is invoked on the model or any of its descendants.
-   [`applyAction`](API.md#applyaction) invokes an action on the model according to the given action description

#### Asynchronous actions

Asynchronous actions have first class support in MST and are described in more detail [here](docs/async-actions.md#asynchronous-actions-and-middleware).
Asynchronous actions are written by using generators and always return a promise. For a real working example see the [bookshop sources](https://github.com/mobxjs/mobx-state-tree/blob/adba1943af263898678fe148a80d3d2b9f8dbe63/examples/bookshop/src/stores/BookStore.js#L25). A quick example to get the gist:

```javascript
import { types, flow } from "mobx-state-tree"

someModel.actions(self => {
    const fetchProjects = flow(function* () { // <- note the star, this a generator function!
        self.state = "pending"
        try {
            // ... yield can be used in async/await style
            self.githubProjects = yield fetchGithubProjectsSomehow()
            self.state = "done"
        } catch (e) {
            // ... including try/catch error handling
            console.error("Failed to fetch projects", error)
            self.state = "error"
        }
        // The action will return a promise that resolves to the returned value
        // (or rejects with anything thrown from the action)
        return self.githubProjects.length
    })

    return { fetchProjects }
})
```

#### Action listeners versus middleware

The difference between action listeners and middleware is: Middleware can intercept the action that is about to be invoked, modify arguments, return types etc. Action listeners cannot intercept, and are only notified. Action listeners receive the action arguments in a serializable format, while middleware receive the raw arguments. (`onAction` is actually just a built-in middleware)

For more details on creating middleware, see the [docs](docs/middleware.md)

#### Disabling protected mode

This may be desired if the default protection of `mobx-state-tree` doesn't fit your use case. For example, if you are not interested in replayable actions, or hate the effort of writing actions to modify any field; `unprotect(tree)` will disable the protected mode of a tree, allowing anyone to directly modify the tree.

### Snapshots

Snapshots are the immutable serialization, in plain objects, of a tree at a specific point in time.
Snapshots can be inspected through `getSnapshot(node)`.
Snapshots don't contain any type information and are stripped from all actions etc, so they are perfectly suitable for transportation.
Requesting a snapshot is cheap, as MST always maintains a snapshot of each node in the background, and uses structural sharing

```javascript
coffeeTodo.setTitle("Tea instead plz")

console.dir(getSnapshot(coffeeTodo))
// prints `{ title: "Tea instead plz" }`
```

Some interesting properties of snapshots:

-   Snapshots are immutable
-   Snapshots can be transported
-   Snapshots can be used to update models or restore them to a particular state
-   Snapshots are automatically converted to models when needed. So the two following statements are equivalent: `store.todos.push(Todo.create({ title: "test" }))` and `store.todos.push({ title: "test" })`.

Useful methods:

-   `getSnapshot(model)`: returns a snapshot representing the current state of the model
-   `onSnapshot(model, callback)`: creates a listener that fires whenever a new snapshot is available (but only one per MobX transaction).
-   `applySnapshot(model, snapshot)`: updates the state of the model and all its descendants to the state represented by the snapshot

## Patches

Modifying a model does not only result in a new snapshot, but also in a stream of [JSON-patches](http://jsonpatch.com/) describing which modifications were made.
Patches have the following signature:

    export interface IJsonPatch {
        op: "replace" | "add" | "remove"
        path: string
        value?: any
    }

-   Patches are constructed according to JSON-Patch, RFC 6902
-   Patches are emitted immediately when a mutation is made, and don't respect transaction boundaries (like snapshots)
-   Patch listeners can be used to achieve deep observing
-   The `path` attribute of a patch contains the path of the event, relative to the place where the event listener is attached
-   A single mutation can result in multiple patches, for example when splicing an array
-   Patches can be reverse applied, which enables many powerful patterns like undo / redo

Useful methods:

-   `onPatch(model, listener)` attaches a patch listener to the provided model, which will be invoked whenever the model or any of its descendants is mutated
-   `applyPatch(model, patch)` applies a patch (or array of patches) to the provided model
-   `revertPatch(model, patch)` reverse applies a patch (or array of patches) to the provided model. This replays the inverse of a set of patches to a model, which can be used to bring it back to its original state

### References and identifiers

References and identifiers are a first-class concept in MST.
This makes it possible to declare references, and keep the data normalized in the background, while you interact with it in a denormalized manner.

Example:
```javascript
const Todo = types.model({
    id: types.identifier(),
    title: types.string
})

const TodoStore = types.model({
    todos: types.array(Todo),
    selectedTodo: types.reference(Todo)
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
-   Each identifiers / type combination should be unique within the entire tree
-   Identifiers are used to reconcile items inside arrays and maps - wherever possible - when applying snapshots
-   The `map.put()` method can be used to simplify adding objects that have identifiers to maps
-   The primary goal of identifiers is not validation, but reconciliation and reference resolving. For this reason identifiers cannot be defined or updated after creation. If you want to check if some value just looks as an identifier, without providing the above semantics; use something like: `types.refinement(types.string, v => v.match(/someregex/))`

_Tip: If you know the format of the identifiers in your application, leverage `types.refinement` to actively check this, for example the following definition enforces that identifiers of `Car` always start with the string `Car_`:_

```javascript
const Car = types.model("Car", {
    id: types.identifier(types.refinement(types.string, identifier => identifier.indexOf("Car_") === 0))
})
```

#### References

References are defined by mentioning the type they should resolve to. The targeted type should have exactly one attribute of the type `identifier()`.
References are looked up through the entire tree, but per type. So identifiers need to be unique in the entire tree.

### Listening to observables, snapshots, patches or actions

MST is powered by MobX. This means that it is immediately compatible with `observer` components, or reactions like `autorun`:

```javascript
import { autorun } from "mobx"

autorun(() => {
    console.log(storeInstance.selectedTodo.title)
})
```

But, because MST keeps immutable snapshots in the background, it is also possible to be notified when a new snapshot of the tree is available. This is similar to `.subscribe` on a redux store:

```javascript
onSnapshot(storeInstance, newSnapshot => {
    console.dir("Got new state: ", newSnapshot)
})
```

However, sometimes it is more useful to precisely know what has changed, rather than just receiving a complete new snapshot.
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

A more extensive middleware example can be found in this [code sandbox](https://codesandbox.io/s/mQrqy8j73).
For more details on creating middleware and the exact specification of middleware events, see the [docs](docs/middleware.md)

Finally, it is not only possible to be notified about snapshots, patches or actions; it is also possible to re-apply them by using `applySnapshot`, `applyPatch` or `applyAction`!

## Volatile state

MST models primarily aid in storing _persistable_ state. State that can be persisted, serialized, transferred, patched, replaced etc.
However, sometimes you need to keep track of temporary, non-persistable state. This is called _volatile_ state in MST. Examples include promises, sockets, DOM elements etc. - state which is needed for local purposes as long as the object is alive.

Volatile state (which is also private) can be introduced by creating variables inside any of the action initializer functions.

Volatile is preserved for the life-time of an object, and not reset when snapshots are applied etc. Note that the life time of an object depends on proper reconciliation, see the [how does reconciliation work?](#how-does-reconciliation-work) section below.

The following is an example of an object with volatile state. Note that volatile state here is used to track a XHR request, and clean up resources when it is disposed. Without volatile state this kind of information would need to be stored in an external WeakMap or something similar.

```javascript
const Store = types.model({
        todos: types.array(Todo),
        state: types.enumeration("State", ["loading", "loaded", "error"])
    })
    .actions(self => {
        const pendingRequest = null // a Promise

        function afterCreate() {
            self.state = "loading"
            pendingRequest = someXhrLib.createRequest("someEndpoint")
        }

        function beforeDestroy() {
            // abort the request, no longer interested
            pendingRequest.abort()
        }

        return {
            afterCreate,
            beforeDestroy
        }
    })
```

Some tips:

1. Note that multiple `actions` calls can be chained. This makes it possible to create multiple closures with their own protected volatile state.
1. Although in the above example the `pendingRequest` could be initialized directly in the action initializer, it is recommended to do this in the `afterCreate` hook, which will only once the entire instance has been set up (there might be many action and property initializers for a single type).

1. The above example doesn't actually use the promise. For how to work with promises / asynchronous flows, see the [asynchronous actions](#asynchronous-actions) section above.

1. It is possible to share volatile state between views and actions by using `extend`. `.extend` works like a combination of `.actions` and `.views` and should return an object with a `actions` and `views` field:

```javascript
const Todo =  types.model({}).extend(self => {
    let localState = 3

    return {
        views: {
            get x() {
                return localState
            }
        },
        actions: {
            setX(value) {
                localState = x
            }
        }
    }
})
```

## Dependency injection

When creating a new state tree it is possible to pass in environment specific data by passing an object as the second argument to a `.create` call.
This object should be (shallowly) immutable and can be accessed by any model in the tree by calling `getEnv(self)`.

This is useful to inject environment, or test-specific utilities like a transport layer, loggers etc. This is a very useful to mock behavior in unit tests or provide instantiated utilities to models without requiring singleton modules.
See also the [bookshop example](https://github.com/mobxjs/mobx-state-tree/blob/a4f25de0c88acf0e239acb85e690e91147a8f0f0/examples/bookshop/src/stores/ShopStore.test.js#L9) for inspiration.

```javascript
import { types, getEnv } from "mobx-state-tree"

const Todo = types.model({
        title: ""
    })
    .actions(self => ({
        setTitle(newTitle) {
            // grab injected logger and log
            getEnv(self).logger.log("Changed title to: " + newTitle)
            self.title = newTitle
        }
    }))

const Store = types.model({
    todos: types.array(Todo)
})

// setup logger and inject it when the store is created
const logger = {
    log(msg) {
        console.log(msg)
    }
}

const store = Store.create({
        todos: [{ title: "Grab tea" }]
    }, {
        logger: logger // inject logger to the tree
    }
)

store.todos[0].setTitle("Grab coffee")
// prints: Changed title to: Grab coffee
```

# Types overview

These are the types available in MST. All types can be found in the `types` namespace, e.g. `types.string`. See [Api Docs](API.md) for examples.

## Complex types

* `types.model(properties, actions)` Defines a "class like" type, with properties and actions to operate on the object.
* `types.array(type)` Declares an array of the specified type.
* `types.map(type)` Declares a map of the specified type.

## Primitive types

* `types.string`
* `types.number`
* `types.boolean`
* `types.Date`

## Utility types

* `types.union(dispatcher?, types...)` create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.
* `types.optional(type, defaultValue)` marks an value as being optional (in e.g. a model). If a value is not provided the `defaultValue` will be used instead. If `defaultValue` is a function, it will be evaluated. This can be used to generate, for example, IDs or timestamps upon creation.
* `types.literal(value)` can be used to create a literal type, where the only possible value is specifically that value. This is very powerful in combination with `union`s. E.g. `temperature: types.union(types.literal("hot"), types.literal("cold"))`.
* `types.enumeration(name?, options: string[])` creates an enumeration. This method is a shorthand for a union of string literals.
* `types.refinement(name?, baseType, (snapshot) => boolean)` creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.
* `types.maybe(type)` makes a type optional and nullable, shorthand for `types.optional(types.union(type, types.literal(null)), null)`.
* `types.null` the type of `null`
* `types.undefined` the type of `undefined`
* `types.late(() => type)` can be used to create recursive or circular types, or types that are spread over files in such a way that circular dependencies between files would be an issue otherwise.
* `types.frozen` Accepts any kind of serializable value (both primitive and complex), but assumes that the value itself is immutable.
* `types.compose(name?, type1...typeX)`, creates a new model type by taking a bunch of existing types and combining them into a new one

## Property types

Property types can only be used as a direct member of a `types.model` type and not further composed (for now).
* `types.identifier(subType?)` Only one such member can exist in a `types.model` and should uniquely identify the object. See [identifiers](#identifiers) for more details. `subType` should be either `types.string` or `types.number`, defaulting to the first if not specified.
* `types.reference(targetType)` creates a property that is a reference to another item of the given `targetType` somewhere in the same tree. See [references](#references) for more details.

## LifeCycle hooks for `types.model`

All of the below hooks can be created by returning an action with the given name, like:

```javascript
const Todo = types
    .model("Todo", { done: true })
    .actions(self => ({
        afterCreate() {
            console.log("Created a new todo!")
        }
    }))
```

The exception to this rule is the `preProcessSnapshot` hook. Because it is needed before instantiating model elements, it needs to be defined on the type itself:

```javascript
types
    .model("Todo", { done: true })
    .preProcessSnapshot(snapshot => ({
        // auto convert strings to booleans as part of preprocessing
        done: snapshot.done === "true" ? true : snapshot.done === "false" ? false : snapshot.done
    }))
    .actions(self => ({
        afterCreate() {
            console.log("Created a new todo!")
        }
    }))
```


| Hook            | Meaning                                                                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preProcessSnapshot` | Before creating an instance or applying a snapshot to an existing instance, this hook is called to give the option to transform the snapshot before it is applied. The hook should be a _pure_ function that returns a new snapshot. This can be useful to do some data conversion, enrichment, property renames etc. This hook is not called for individual property updates. _**Note 1: Unlike the other hooks, this one is _not_ created as part of the `actions` initializer, but directly on the type!**_ _**Note 2: The `preProcessSnapshot` transformation must be pure; it is should not modify its original input argument!**_ |
| `afterCreate`   | Immediately after an instance is created and initial values are applied. Children will fire this event before parents                                     |
| `afterAttach`   | As soon as the _direct_ parent is assigned (this node is attached to an other node)                                                                       |
| `postProcessSnapshot` | This hook is called every time a new snapshot is being generated. Typically it is the inverse function of `preProcessSnapshot`. This function should be a pure function that returns a new snapshot.
| `beforeDetach`  | As soon as the node is removed from the _direct_ parent, but only if the node is _not_ destroyed. In other words, when `detach(node)` is used             |
| `beforeDestroy` | Called before the node is destroyed, as a result of calling `destroy`, or by removing or replacing the node from the tree. Child destructors will fire before parents |

Note, except for `preProcessSnapshot`, all hooks should be defined as actions.

All hooks can be defined multiple times and can be composed automatically.



# Api overview

See the [full API docs](API.md) for more details.

| signature | |
| ---- | --- |
| [`addDisposer(node, () => void)`](API.md#adddisposer) | Function to be invoked whenever the target node is to be destroyed |
| [`addMiddleware(node, middleware: (actionDescription, next) => any)`](API.md#addmiddleware) | Attaches middleware to a node. See [middleware](docs/middleware.md). Returns disposer. |
| [`applyAction(node, actionDescription)`](API.md#applyaction) | Replays an action on the targeted node |
| [`applyPatch(node, jsonPatch)`](API.md#applypatch) | Applies a JSON patch, or array of patches, to a node in the tree |
| [`applySnapshot(node, snapshot)`](API.md#applysnapshot) | Updates a node with the given snapshot |
| [`createActionTrackingMiddleware`](API.md#createactiontrackingmiddleware) | Utility to make writing middleware that track async actions less cumbersome |
| [`clone(node, keepEnvironment?: true \| false \| newEnvironment)`](API.md#clone) | Creates a full clone of the given node. By default preserves the same environment |
| [`decorate(middleware, function)`](API.md#decorate) | Attaches middleware to a specific action (or flow) |
| [`destroy(node)`](API.md#destroy) | Kills `node`, making it unusable. Removes it from any parent in the process |
| [`detach(node)`](API.md#detach) | Removes `node` from its current parent, and lets it live on as standalone tree |
| [`flow(generator)`](API.md#flow) | creates an asynchronous flow based on a generator function |
| [`getChildType(node, property?)`](API.md#getchildtype) | Returns the declared type of the given `property` of `node`. For arrays and maps `property` can be omitted as they all have the same type |
| [`getEnv(node)`](API.md#getenv) | Returns the environment of `node`, see [environments](#environments) |
| [`getParent(node, depth=1)`](API.md#getparent) | Returns the intermediate parent of the `node`, or a higher one if `depth > 1` |
| [`getPath(node)`](API.md#getpath) | Returns the path of `node` in the tree |
| [`getPathParts(node)`](API.md#getpathparts) | Returns the path of `node` in the tree, unescaped as separate parts |
| [`getRelativePath(base, target)`](API.md#getrelativepath) | Returns the short path, which one could use to walk from node `base` to node `target`, assuming they are in the same tree. Up is represented as `../` |
| [`getRoot(node)`](API.md#getroot) | Returns the root element of the tree containing `node` |
| [`getSnapshot(node)`](API.md#getsnapshot) | Returns the snapshot of the `node`. See [snapshots](#snapshots) |
| [`getType(node)`](API.md#gettype) | Returns the type of `node` |
| [`hasParent(node, depth=1)`](API.md#hasparent) | Returns `true` if `node` has a parent at `depth` |
| [`isAlive(node)`](API.md#isalive) | Returns `true` if `node` is alive |
| [`isStateTreeNode(value)`](API.md#isstatetreenode) | Returns `true` if `value` is a node of a mobx-state-tree |
| [`isProtected(value)`](API.md#isprotected) | Returns `true` if the given node is protected, see [actions](#actions) |
| [`isRoot(node)`](API.md#isroot) | Returns true if `node` has no parents  |
| [`joinJsonPath(parts)`](API.md#joinjsonpath) | Joins and escapes the given path `parts` into a JSON path |
| [`onAction(node, (actionDescription) => void)`](API.md#onaction) | A built-in middleware that calls the provided callback with an action description upon each invocation. Returns disposer |
| [`onPatch(node, (patch) => void)`](API.md#onpatch) | Attach a JSONPatch listener, that is invoked for each change in the tree. Returns disposer |
| [`onSnapshot(node, (snapshot, inverseSnapshot) => void)`](API.md#onsnapshot) | Attach a snapshot listener, that is invoked for each change in the tree. Returns disposer |
| [`process(generator)`](API.md#process) | `DEPRECATED` – replaced with [flow](API.md#flow) |
| [`protect(node)`](API.md#protect) | Protects an unprotected tree against modifications from outside actions |
| [`recordActions(node)`](API.md#recordactions) | Creates a recorder that listens to all actions in `node`. Call `.stop()` on the recorder to stop this, and `.replay(target)` to replay the recorded actions on another tree  |
| [`recordPatches(node)`](API.md#recordpatches) | Creates a recorder that listens to all patches emitted by the node. Call `.stop()` on the recorder to stop this, and `.replay(target)` to replay the recorded patches on another tree |
| [`resolve(node, path)`](API.md#resolve) | Resolves a `path` (json path) relatively to the given `node` |
| [`splitJsonPath(path)`](API.md#splitjsonpath) | Splits and unescapes the given JSON `path` into path parts |
| [`typecheck(type, value)`](API.md#typecheck) | Typechecks a value against a type. Throws on errors. Use this if you need typechecks even in a production build. |
| [`tryResolve(node, path)`](API.md#tryresolve) | Like `resolve`, but just returns `null` if resolving fails at any point in the path |
| [`unprotect(node)`](API.md#unprotect) | Unprotects `node`, making it possible to directly modify any value in the subtree, without actions |
| [`walk(startNode, (node) => void)`](API.md#walk) | Performs a depth-first walk through a tree |
| [`escapeJsonPath(path)`](API.md#escapejsonpath) | escape special characters in an identifier, according to http://tools.ietf.org/html/rfc6901 |
| [`unescapeJsonPath(path)`](API.md#unescapejsonpath) | escape special characters in an identifier, according to http://tools.ietf.org/html/rfc6901 |
| [`resolveIdentifier(type, target, identifier)`](API.md#resolveidentifier) | resolves an identifier of a given type in a model tree |
| [`resolvePath(target, path)`](API.md#resolvepath) | resolves a JSON path, starting at the specified target |

A _disposer_ is a function that cancels the effect it was created for.

# Tips

### Building with production environment

MobX-state-tree provides a lot of dev-only checks. They check the correctness of function calls and perform runtime type-checks over your models. It is recommended to disable them in production builds. To do so, you should use webpack's DefinePlugin to set environment as production and remove them. More information could be found in the [official webpack guides](https://webpack.js.org/plugins/environment-plugin/#usage).

### Generate MST models from JSON

The following service can generate MST models based on JSON: https://transform.now.sh/json-to-mobx-state-tree

### `optionals` and default value functions

`types.optional` can take an optional function parameter which will be invoked each time a default value is needed. This is useful to generate timestamps, identifiers or even complex objects, for example:

`createdDate: types.optional(types.Date, () => new Date())`

### `toJSON()` for debugging

For debugging you might want to use `getSnapshot(model)` to print the state of a model. But if you didn't import `getSnapshot` while debugging in some debugger; don't worry, `model.toJSON()` will produce the same snapshot. (For API consistency, this feature is not part of the typed API)

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

const Store = types.late(LateStore)
```

Thanks to function hoisting in combination with `types.late`, this lets you have circular dependencies between types, across files.

### Simulate inheritance by using type composition

There is no notion of inheritance in MST. The recommended approach is to keep references to the original configuration of a model in order to compose it into a new one, for example by using `types.compose` (which combines two types) or producing fresh types using `.props|.views|.actions`. An example of classical inheritance could be expressed using composition as follows:

```javascript
const Square = types
    .model(
        "Square",
        {
            width: types.number
        }
    )
    .views(self => ({
        surface() {
            return self.width * self.width
        }
    }))

// create a new type, based of Square
const Box = Square
    .named("Box")
    .views(self => {
        // save the base implementation of surface
        const superSurface = self.surface

        return {
            // super contrived override example!
            surface() {
                return superSurface() * 1
            },
            volume() {
                return self.surface * self.width
            }
        }
    }))

// no inheritance, but, union types and code reuse
const Shape = types.union(Box, Square)
```

Similarly, compose can be used to simply mixin types:

```javascript
const CreationLogger = types.model().actions(self => ({
    afterCreate() {
        console.log("Instantiated " + getType(self).name)
    }
}))

const BaseSquare = types
    .model({
        width: types.number
    })
    .views(self => ({
        surface() {
            return self.width * self.width
        }
    }))

export const LoggingSquare = types
    .compose(
        // combine a simple square model...
        BaseSquare,
        // ... with the logger type
        CreationLogger
    )
    // ..and give it a nice name
    .named("LoggingSquare")
```

# FAQ

### When not to use MST?

MST makes state management very tangible by offering access to snapshots, patches and by providing interceptable actions.
Also it fixes the `this` problem.
All these features have the downside that they incur a little runtime overhead.
Although in many places the MST core can still be optimized significantly, there will always be a constant overhead.
If you have a performance critical application that handles huge amounts of mutable data, you will probably be better
off by using 'raw' mobx.
Which has predictable and well-known performance characteristics, and has much less overhead.

Likewise, if your application is mainly dealing with stateless information (such as a logging system) MST doesn't add much values.

### How does reconciliation work?

* When applying snapshots, MST will always try to reuse existing object instances for snapshots with the same identifier (see `types.identifier()`).
* If no identifier is specified, but the type of the snapshot is correct, MST will reconcile objects as well if they are stored in a specific model property or under the same map key.
* In arrays, items without an identifier are never reconciled.

If an object is reconciled, the consequence is that localState is preserved and `postCreate` / `attach` life-cycle hooks are not fired because applying a snapshot results just in an existing tree node being updated.

### Creating async flows

See [creating asynchronous flow](docs/async-actions.md).

### Using mobx and mobx-state-tree together

Yep, perfectly fine. No problem. Go on. `observer`, `autorun` etc. will work as expected.

### Should all state of my app be stored in `mobx-state-tree`?
No, or, not necessarily. An application can use both state trees and vanilla MobX observables at the same time.
State trees are primarily designed to store your domain data, as this kind of state is often distributed and not very local.
For local component state, for example, vanilla MobX observables might often be simpler to use.

### Can I use Hot Module Reloading?

Yes, with MST it is pretty straight forward to setup hot reloading for your store definitions, while preserving state. See the [todomvc example](https://github.com/mobxjs/mobx-state-tree/blob/745904101fdaeb51f16f40ebb80cd7fecf742572/packages/mst-example-todomvc/src/index.js#L60-L64)

### TypeScript & MST

TypeScript support is best-effort, as not all patterns can be expressed in TypeScript. But except for assigning snapshots to properties we get pretty close! As MST uses the latest fancy Typescript features it is recommended to use TypeScript 2.3 or higher, with `noImplicitThis` and `strictNullChecks` enabled.

When using models, you write an interface, along with its property types, that will be used to perform type checks at runtime.
What about compile time? You can use TypeScript interfaces to perform those checks, but that would require writing again all the properties and their actions!

Good news! You don't need to write it twice! Using the `typeof` operator of TypeScript over the `.Type` property of a MST Type will result in a valid TypeScript Type!

```typescript
const Todo = types.model({
        title: types.string
    })
    .actions(self => ({
        setTitle(v: string) {
            self.title = v
        }
    }))

type ITodo = typeof Todo.Type // => ITodo is now a valid TypeScript type with { title: string; setTitle: (v: string) => void }
```

Sometimes you'll need to take into account where your typings are available and where they aren't. The code below will not compile: TypeScript will complain that `self.upperProp` is not a known property. Computed properties are only available after `.views` is evaluated.

```typescript
const Example = types
  .model('Example', {
    prop: types.string,
  })
  .views(self => ({
    get upperProp(): string {
      return self.prop.toUpperCase();
    },
    get twiceUpperProp(): string {
      return self.upperProp + self.upperProp;
    },
  }));
```

You can circumvent this situation by decaring the views in two steps:

```typescript
const Example = types
  .model('Example', { prop: types.string })
  .views(self => ({
    get upperProp(): string {
      return self.prop.toUpperCase();
    },
  }))
  .views(self => ({
    get twiceUpperProp(): string {
      return self.upperProp + self.upperProp;
    },
  }));
```

Another approach would be to use helper functions, as demonstrated in the following code. This definition allows for circular references, but is more verbose.

```typescript
const Example = types
  .model('Example', { prop: types.string })
  .views(self => {
    function upperProp(): string {
      return self.prop.toUpperCase();
    }
    function twiceUpperProp(): string {
      return upperProp() + upperProp();
    }

    return {
      get upperProp(): string {
        return upperProp();
      },
      get twiceUpperProp(): string {
        return twiceUpperProp();
      },
    };
  });
```

#### Known Typescript Issue 5938

Theres a known issue with typescript and interfaces as described by: https://github.com/Microsoft/TypeScript/issues/5938

This rears its ugly head if you try to define a model such as:

```typescript
import { types } from "mobx-state-tree"

export const Todo = types.model({
    title: types.string
});

export type ITodo = typeof Todo.Type
```

And you have your tsconfig.json settings set to:

```json
{
  "compilerOptions": {
    ...
    "declaration": true,
    "noUnusedLocals": true
    ...
  }
}
```

Then you will get errors such as:

> error TS4023: Exported variable 'Todo' has or is using name 'IModelType' from external module "..." but cannot be named.

Until Microsoft fixes this issue the solution is to re-export IModelType:

```typescript
import { types, IModelType } from "mobx-state-tree"

export type __IModelType = IModelType<any,any>;

export const Todo = types.model({
    title: types.string
});

export type ITodo = typeof Todo.Type
```

It aint pretty, but it works.

### How does MST compare to Redux

So far this might look a lot like an immutable state tree as found for example in Redux apps, but there are a few differences:

-   Like Redux, and unlike MobX, MST prescribes a very specific state architecture.
-   mobx-state-tree allows direct modification of any value in the tree; it is not necessary to construct a new tree in your actions.
-   mobx-state-tree allows for fine-grained and efficient observation of any point in the state tree.
-   mobx-state-tree generates JSON patches for any modification that is made.
-   mobx-state-tree provides utilities to turn any MST tree into a valid Redux store.
-   Having multiple MSTs in a single application is perfectly fine.


## Thanks!

* [Mendix](https://mendix.com) for sponsoring and providing the opportunity to work on exploratory projects like MST.
* [Dan Abramov](https://twitter.com/dan_abramov)'s work on [Redux](http://redux.js.org) has strongly influenced the idea of snapshots and transactional actions in MST.
* [Giulio Canti](https://twitter.com/GiulioCanti)'s work on [tcomb](http://github.com/gcanti/tcomb) and type systems in general has strongly influenced the type system of MST.
* All the early adopters encouraging to pursue this whole idea and proving it is something feasible.
