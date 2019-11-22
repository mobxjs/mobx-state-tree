---
id: actions
title: Actions
---

<div id="codefund"></div>


### Actions

<i><a style="color: white; background:cornflowerblue;padding:5px;margin:5px;border-radius:2px" href="https://egghead.io/lessons/react-attach-behavior-to-mobx-state-tree-models-using-actions">egghead.io lesson 2: Attach Behavior to mobx-state-tree Models Using Actions</a></i>

By default, nodes can only be modified by one of their actions, or by actions higher up in the tree.
Actions can be defined by returning an object from the action initializer function that was passed to `actions`.
The initializer function is executed for each instance, so that `self` is always bound to the current instance.
Also, the closure of that function can be used to store so called _volatile_ state for the instance or to create private functions that can only
be invoked from the actions, but not from the outside.

```javascript
const Todo = types
    .model({
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

Shorter form if no local state or private functions are involved:

```javascript
const Todo = types
    .model({
        title: types.string
    })
    .actions(self => ({
        // note the `({`, we are returning an object literal
        setTitle(newTitle) {
            self.title = newTitle
        }
    }))
```

Actions are replayable and are therefore constrained in several ways:

-   Trying to modify a node without using an action will throw an exception.
-   It's recommended to make sure action arguments are serializable. Some arguments can be serialized automatically such as relative paths to other nodes
-   Actions can only modify models that belong to the (sub)tree on which they are invoked
-   You cannot use `this` inside actions. Instead, use `self`. This makes it safe to pass actions around without binding them or wrapping them in arrow functions.

Useful methods:

-   [`onAction`](docs/API/README.md#onaction) listens to any action that is invoked on the model or any of its descendants.
-   [`addMiddleware`](docs/API/README.md#addmiddleware) adds an interceptor function to any action invoked on the subtree.
-   [`applyAction`](docs/API/README.md#applyaction) invokes an action on the model according to the given action description


#### Action listeners versus middleware

The difference between action listeners and middleware is: middleware can intercept the action that is about to be invoked, modify arguments, return types, etc. Action listeners cannot intercept and are only notified. Action listeners receive the action arguments in a serializable format, while middleware receives the raw arguments. (`onAction` is actually just a built-in middleware).

For more details on creating middleware, see the [docs](docs/middleware.md).

#### Disabling protected mode

This may be desired if the default protection of `mobx-state-tree` doesn't fit your use case. For example, if you are not interested in replayable actions or hate the effort of writing actions to modify any field, `unprotect(tree)` will disable the protected mode of a tree allowing anyone to directly modify the tree.
