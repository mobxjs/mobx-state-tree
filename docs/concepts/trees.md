---
id: trees
title: Types, models, trees & state
---

<div id="codefund"></div>

### tree = type + state

Each **node** in the tree is described by two things: Its **type** (the shape of the thing) and its **data** (the state it is currently in).

The simplest tree possible:

```javascript
import { types } from "mobx-state-tree"

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
Other built-in types include arrays, maps, primitives, etc. See the [types overview](/overview/types).


### Creating models

<details>
    <summary style="color: white; background:#ff7000;padding:5px;margin:5px;border-radius:2px">egghead.io lesson 1: Describe Your Application Domain Using mobx-state-tree(MST) Models</summary>
    <br>
    <div style="padding:5px;">
        <iframe style="border: none;" width=760 height=427  src="https://egghead.io/lessons/react-describe-your-application-domain-using-mobx-state-tree-mst-models/embed" ></iframe>
    </div>
    <a style="font-style:italic;padding:5px;margin:5px;"  href="https://egghead.io/lessons/react-describe-your-application-domain-using-mobx-state-tree-mst-models">Hosted on egghead.io</a>
</details>

The most important type in MST is `types.model`, which can be used to describe the shape of an object.
An example:

```javascript
const TodoStore = types
    // 1
    .model("TodoStore", {
        loaded: types.boolean, // 2
        endpoint: "http://localhost", // 3
        todos: types.array(Todo), // 4
        selectedTodo: types.reference(Todo) // 5
    })
    .views(self => {
        return {
            // 6
            get completedTodos() {
                return self.todos.filter(t => t.done)
            },
            // 7
            findTodosByUser(user) {
                return self.todos.filter(t => t.assignee === user)
            }
        }
    })
    .actions(self => {
        return {
            addTodo(title) {
                self.todos.push({
                    id: Math.random(),
                    title
                })
            }
        }
    })
```

When defining a model, it is advised to give the model a name for debugging purposes (see `// 1`).
A model takes additionally object argument defining the properties.

The _properties_ argument is a key-value set where each key indicates the introduction of a property, and the value its type. The following types are acceptable:

1.  A type. This can be a simple primitive type like `types.boolean`, see `// 2`, or a complex, possibly pre-defined type (`// 4`)
2.  A primitive. Using a primitive as type is syntactic sugar for introducing a property with a default value. See `// 3`, `endpoint: "http://localhost"` is the same as `endpoint: types.optional(types.string, "http://localhost")`. The primitive type is inferred from the default value. Properties with a default value can be omitted in snapshots.
3.  A [computed property](https://mobx.js.org/computeds.html), see `// 6`. Computed properties are tracked and memoized by MobX. Computed properties will not be stored in snapshots or emit patch events. It is possible to provide a setter for a computed property as well. A setter should always invoke an action.
4.  A view function (see `// 7`). A view function can, unlike computed properties, take arbitrary arguments. It won't be memoized, but its value can be tracked by MobX nonetheless. View functions are not allowed to change the model, but should rather be used to retrieve information from the model.

_Tip: `(self) => ({ action1() { }, action2() { }})` is ES6 syntax for `function (self) { return { action1: function() { }, action2: function() { } }}`. In other words, it's short way of directly returning an object literal.
For that reason a comma between each member of a model is mandatory, unlike classes which are syntactically a totally different concept._

`types.model` creates a chainable model type, where each chained method produces a new type:

-   `.named(name)` clones the current type, but gives it a new name
-   `.props(props)` produces a new type, based on the current one, and adds / overrides the specified properties
-   `.actions(self => object literal with actions)` produces a new type, based on the current one, and adds / overrides the specified actions
-   `.views(self => object literal with view functions)` produces a new type, based on the current one, and adds / overrides the specified view functions
-   `.preProcessSnapshot(snapshot => snapshot)` can be used to pre-process the raw JSON before instantiating a new model. See [Lifecycle hooks](/overview/hooks) or alternatively `types.snapshotProcessor`
-   `.postProcessSnapshot(snapshot => snapshot)` can be used to post-process the raw JSON before getting a model snapshot. See [Lifecycle hooks](/overview/hooks) or alternatively `types.snapshotProcessor`

Note that `views` and `actions` don't define actions and views directly, but rather they should be given a function.
The function will be invoked when a new model instance is created. The instance will be passed in as the first and only argument typically called `self`.
This has two advantages:

1.  All methods will always be bound correctly, and won't suffer from an unbound `this`
2.  The closure can be used to store private state or methods of the instance. See also [actions](/concepts/actions) and [volatile state](/concepts/volatiles).

Quick example:

```javascript
const TodoStore = types
    .model("TodoStore", {
        /* props */
    })
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

It is perfectly fine to chain multiple `views`, `props` calls etc in arbitrary order. This can be a great way to structure complex types, mix-in utility functions, etc. Each call in the chain creates a new, immutable type which can itself be stored and reused as part of other types, etc.

It is also possible to define lifecycle hooks in the _actions_ object. These are actions with a predefined name that are run at a specific moment. See [Lifecycle hooks](/overview/hooks).

### Composing trees

In MST every node in the tree is a tree in itself.
Trees can be composed by composing their types:

```javascript
const TodoStore = types.model({
    todos: types.array(Todo)
})

const storeInstance = TodoStore.create({
    todos: [
        {
            title: "Get biscuit"
        }
    ]
})
```

The _snapshot_ passed to the `create` method of a type will recursively be turned in MST nodes. So, you can safely call:

```javascript
storeInstance.todos[0].setTitle("Chocolate instead plz")
```

Because any node in a tree is a tree in itself, any built-in method in MST can be invoked on any node in the tree, not just the root.
This makes it possible to get a patch stream of a certain subtree, or to apply middleware to a certain subtree only.

### Tree semantics in detail

MST trees have very specific semantics. These semantics purposefully constrain what you can do with MST. The reward for that is all kinds of generic features out of the box like snapshots, replayability, etc. If these constraints don't suit your app, you are probably better off using plain MobX with your own model classes, which is fine as well.

1.  Each object in an MST tree is considered a _node_. Each primitive (and frozen) value is considered a _leaf_.
1.  MST has only three types of nodes: _model_, _array_ and _map_.
1.  Every _node_ tree in an MST tree is a tree in itself. Any operation that can be invoked on the complete tree can also be applied to a subtree.
1.  A node can only exist exactly _once_ in a tree. This ensures it has a unique, identifiable position.
1.  It is however possible to refer to another object in the _same_ tree by using _references_
1.  There is no limit to the number of MST trees that live in an application. However, each node can only live in exactly one tree.
1.  All _leaves_ in the tree must be serializable. It is not possible to store, for example, functions in a MST.
1.  The only free-form type in MST is frozen, with the requirement that frozen values are immutable and serializable so that the MST semantics can still be upheld.
1.  At any point in the tree it is possible to assign a snapshot to the tree instead of a concrete instance of the expected type. In that case an instance of the correct type, based on the snapshot, will be automatically created for you.
1.  Nodes in the MST tree will be reconciled (the exact same instance will be reused) when updating the tree by any means, based on their _identifier_ property. If there is no identifier property, instances won't be reconciled.
1.  If a node in the tree is replaced by another node, the original node will die and become unusable. This makes sure you are not accidentally holding on to stale objects anywhere in your application.
1.  If you want to create a new node based on an existing node in a tree, you can either `detach` that node, or `clone` it.

These egghead.io lessons nicely leverage the specific semantics of MST trees:

<details>
    <summary style="color: white; background:#ff7000;padding:5px;margin:5px;border-radius:2px">egghead.io lesson 6: Build Forms with React to Edit mobx-state-tree Models</summary>
    <br>
    <div style="padding:5px;">
        <iframe style="border: none;" width=760 height=427  src="https://egghead.io/lessons/react-build-forms-with-react-to-edit-mobx-state-tree-models/embed" ></iframe>
    </div>
    <a style="font-style:italic;padding:5px;margin:5px;"  href="https://egghead.io/lessons/react-build-forms-with-react-to-edit-mobx-state-tree-models">Hosted on egghead.io</a>
</details>

<details>
    <summary style="color: white; background:#ff7000;padding:5px;margin:5px;border-radius:2px">egghead.io lesson 7: Remove Model Instances from the Tree</summary>
    <br>
    <div style="padding:5px;">
        <iframe style="border: none;" width=760 height=427  src="https://egghead.io/lessons/react-remove-model-instances-from-the-tree/embed" ></iframe>
    </div>
    <a style="font-style:italic;padding:5px;margin:5px;"  href="https://egghead.io/lessons/react-remove-model-instances-from-the-tree">Hosted on egghead.io</a>
</details>

<details>
    <summary style="color: white; background:#ff7000;padding:5px;margin:5px;border-radius:2px">egghead.io lesson 8: Create an Entry Form to Add Models to the State Tree</summary>
    <br>
    <div style="padding:5px;">
        <iframe style="border: none;" width=760 height=427  src="https://egghead.io/lessons/react-create-an-entry-form-to-add-models-to-the-state-tree/embed" ></iframe>
    </div>
    <a style="font-style:italic;padding:5px;margin:5px;"  href="https://egghead.io/lessons/react-create-an-entry-form-to-add-models-to-the-state-tree">Hosted on egghead.io</a>
</details>
