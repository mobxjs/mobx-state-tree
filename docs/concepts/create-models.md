---
id: creating-models
title: Creating models
---

<div id="codefund"></div>

### Creating models

<i><a style="color: white; background:cornflowerblue;padding:5px;margin:5px;border-radius:2px" href="https://egghead.io/lessons/react-describe-your-application-domain-using-mobx-state-tree-mst-models">egghead.io lesson 1: Describe Your Application Domain Using mobx-state-tree(MST) Models</a></i>

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
3.  A [computed property](https://mobx.js.org/refguide/computed-decorator.html), see `// 6`. Computed properties are tracked and memoized by MobX. Computed properties will not be stored in snapshots or emit patch events. It is possible to provide a setter for a computed property as well. A setter should always invoke an action.
4.  A view function (see `// 7`). A view function can, unlike computed properties, take arbitrary arguments. It won't be memoized, but its value can be tracked by MobX nonetheless. View functions are not allowed to change the model, but should rather be used to retrieve information from the model.

_Tip: `(self) => ({ action1() { }, action2() { }})` is ES6 syntax for `function (self) { return { action1: function() { }, action2: function() { } }}`. In other words, it's short way of directly returning an object literal.
For that reason a comma between each member of a model is mandatory, unlike classes which are syntactically a totally different concept._

`types.model` creates a chainable model type, where each chained method produces a new type:

-   `.named(name)` clones the current type, but gives it a new name
-   `.props(props)` produces a new type, based on the current one, and adds / overrides the specified properties
-   `.actions(self => object literal with actions)` produces a new type, based on the current one, and adds / overrides the specified actions
-   `.views(self => object literal with view functions)` produces a new type, based on the current one, and adds / overrides the specified view functions
-   `.preProcessSnapshot(snapshot => snapshot)` can be used to pre-process the raw JSON before instantiating a new model. See [Lifecycle hooks](#lifecycle-hooks-for-typesmodel) or alternatively `types.snapshotProcessor`
-   `.postProcessSnapshot(snapshot => snapshot)` can be used to post-process the raw JSON before getting a model snapshot. See [Lifecycle hooks](#lifecycle-hooks-for-typesmodel) or alternatively `types.snapshotProcessor`

Note that `views` and `actions` don't define actions and views directly, but rather they should be given a function.
The function will be invoked when a new model instance is created. The instance will be passed in as the first and only argument typically called `self`.
This has two advantages:

1.  All methods will always be bound correctly, and won't suffer from an unbound `this`
2.  The closure can be used to store private state or methods of the instance. See also [actions](#actions) and [volatile state](#volatile-state).

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

It is also possible to define lifecycle hooks in the _actions_ object. These are actions with a predefined name that are run at a specific moment. See [Lifecycle hooks](#lifecycle-hooks-for-typesmodel).
