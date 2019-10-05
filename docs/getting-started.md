# Getting Started

This tutorial will introduce you to the basics of `mobx-state-tree` (MST) by building a TODO application. The application will also have the ability to assign each TODO to a user.

## Prerequisites

This tutorial assumes that you know the basics of how to use React. If you don't know what React is and how to use it, you may wish to read [this tutorial](https://facebook.github.io/react/tutorial/tutorial.html) first.

### Do I need to learn MobX?

MST is heavily based on MobX. A basic understanding of the MobX library will help when dealing with complex situations and connecting of the data with React components. If you don't have MobX experience, don't worry, working with MST does not require any MobX API knowledge.

## How to follow this tutorial

You can write the code for this tutorial in the browser using the CodeSandbox playground, or in your preferred code editor (e.g. VSCode).

### Writing code in the browser

For each example you'll find a CodeSandbox playground link. You can start from the playground of each point and manually progress to the next tutorial step by using it. If you're stuck, feel free to have a sneak peak from the next playground link! :)

### Writing code in the editor

Setting up the whole environment for a React project involves transpilers, bundlers, linters, etc., and setting them up may become very tedious and not fun. Thanks to `create-react-app` setting up all those tools becomes as easy as typing a couple of lines in your terminal.

```
npx create-react-app mst-todo
```

Next install `mobx`, `mobx-react` and `mobx-state-tree` dependencies.

```
yarn add mobx mobx-react mobx-state-tree
```

Now you can run `npm run start` and a basic React page will show up. You're all set up and can begin editing the project files!

## Overview

MST is a state container that combines the simplicity and ease of mutable data with the traceability of immutable data and the reactiveness and performance of observable data.

If the above sentence confused you, don't worry. We will dive deeper together and explore what it means step by step.

## Getting Started

When building applications with MST, the first exercise that will help you building your application is thinking about what is the minimal set of entities and their relative attributes.

In our example application we will deal with TODOs, so we need a `Todo` entity. The `Todo` entity will have a `name` and a `done` attribute to store if the `Todo` is done or not. We will also have knowledge of users, so we need a `User` entity that will have a `name` attribute and will be assignable to TODOs.

So far our entities and their attributes look like this:

`Todo`

-   name
-   done

`User`

-   name

## Creating our first model

Central to MST is the concept of a living tree. The tree consists of mutable, but strictly protected objects enriched with run-time type information. In other words; each tree has a shape (type information) and state (data). From this living tree, immutable and structurally shared snapshots are generated automatically.

This means that in order to make our application work, we need to describe to MST how our attributes are shaped. Knowing that, MST will be able to automatically generate all those boundaries, and help us avoid making silly mistakes, like putting a string in price field or a boolean where an array is expected.

The simplest way to define a model for an entity in MST is to provide sample data that will be used as defaults for it, and pass it to the `types.model` function.

```javascript
import { types } from "mobx-state-tree"

const Todo = types.model({
    name: "",
    done: false
})

const User = types.model({
    name: ""
})
```

[View sample in the playground](https://codesandbox.io/s/235jykjp90)

The above code will create two models, a `Todo` and a `User` model, but as we said before, a tree model in MST consists of type information (and we just saw how to define them) and state (the instance data). So how do we create instances of the `Todo` and `User` models?

## Creating model instances (tree nodes)

This can be easily done by calling `.create()` on the `Todo` and `User` models we just defined.

```javascript
import { types, getSnapshot } from "mobx-state-tree"

const Todo = types.model({
    name: "",
    done: false
})

const User = types.model({
    name: ""
})

const john = User.create()
const eat = Todo.create()

console.log("John:", getSnapshot(john))
console.log("Eat TODO:", getSnapshot(eat))
```

[View sample in the playground](https://codesandbox.io/s/kkl8kn4pq5)

As you will see, using models ensures that all the attributes defined will always be present and defaulted to the predefined values. If you want to change those values when creating the model instance, you can simply pass an object with the values to use into the `.create` function.

```javascript
const eat = Todo.create({ name: "eat" })

console.log("Eat TODO:", getSnapshot(eat)) // => will print {name: "eat", done: false}
```

[View sample in the playground](https://codesandbox.io/s/jpmpyj7pm3)

## Meeting types

When playing with this feature and passing in values to the `.create` function, you may encounter an error like this:

```javascript
const eat = Todo.create({ name: "eat", done: 1 })
```

```
Error: [mobx-state-tree] Error while converting `{"name":"eat","done":1}` to `AnonymousModel`:
at path "/done" value `1` is not assignable to type: `boolean`.
```

What does this mean? As I said before, MST nodes are type-enriched. This means that providing a value (number) of the wrong type (expected boolean) will make MST throw an error. This is very helpful when building applications, as it will keep your state consistent and avoid entering illegal states due to data of the wrong type. To be honest with you, I lied when I told you how to define models. The syntax you used was only a shortcut for the following syntax:

```javascript
const Todo = types.model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false)
})

const User = types.model({
    name: types.optional(types.string, "")
})
```

[View sample in the playground](https://codesandbox.io/s/kx9x4973z3)

The `types` namespace provided in the MST package provides a lot of useful types and utility types like array, map, maybe, refinements and unions. If you are interested in them, feel free to check out the [API documentation](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/API/README.md) for the whole list and their parameters.

We can now use this knowledge to combine models and define the root model of our store that will hold `Todo` and `User` instances in the `todos` and `users` maps.

```javascript
import { types } from "mobx-state-tree"

const Todo = types.model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false)
})

const User = types.model({
    name: types.optional(types.string, "")
})

const RootStore = types.model({
    users: types.map(User),
    todos: types.optional(types.map(Todo), {})
})

const store = RootStore.create({
    users: {} // users is not required really since arrays and maps are optional by default since MST3
})
```

[View sample in the playground](https://codesandbox.io/s/kk63vox225)

Notice that the `types.optional` second argument is required as long you don't pass a value in the `.create` function of the model. If you want, for example, to make the `name` or `todos` attribute required when calling `.create`, remove the `types.optional` function call and pass the `types.*` included inside.

## Modifying data

MST tree nodes (model instances) can be modified using actions. Actions are collocated with your model and can easily be defined by declaring `.actions` over your model and passing it a function that accepts the model instance and returns an object with the functions that modify that tree node.

For example, the following actions will be defined on the `Todo` model, and will allow you to toggle the `done` and set the `name` attribute of the provided `Todo` instance.

```javascript
const Todo = types
    .model({
        name: types.optional(types.string, ""),
        done: types.optional(types.boolean, false)
    })
    .actions(self => ({
        setName(newName) {
            self.name = newName
        },

        toggle() {
            self.done = !self.done
        }
    }))

const User = types.model({
    name: types.optional(types.string, "")
})

const RootStore = types
    .model({
        users: types.map(User),
        todos: types.map(Todo)
    })
    .actions(self => ({
        addTodo(id, name) {
            self.todos.set(id, Todo.create({ name }))
        }
    }))
```

[View sample in the playground](https://codesandbox.io/s/3xw9x060mp)

Please notice the use of `self`. `self` is the object being constructed when an instance of your model is created. Thanks to the `self` object, instance actions are "this-free", allowing you to be sure that they are correctly bound.

Calling the actions is as simple as what you would do with plain JavaScript classes, you simply call them on a model instance!

```javascript
store.addTodo(1, "Eat a cake")
store.todos.get(1).toggle()
```

[View sample in the playground](https://codesandbox.io/s/r673zxw4p)

## Snapshots are awesome!

Dealing with mutable data and objects makes it easy to change data on the fly, but on the other hand it makes testing hard. Immutable data makes that very easy. Is there a way to have the best of both worlds? Nature is a great example of that. Beings are living and mutable, but we may eternalize nature's beauty by taking awesome snapshots. Can we do the same with the state of our application?

Thanks to MST's knowledge of models and relative property types, MST is able to generate serializable snapshots of our store! You can easily get a snapshot of the store by using the `getSnapshot` function exported by the MST package.

```javascript
console.log(getSnapshot(store))
/*
{
    "users": {},
    "todos": {
        "1": {
            "name": "Eat a cake",
            "done": true
        }
    }
}
*/
```

Because the nature of state is mutable, a snapshot will be emitted whenever the state is mutated. To listen to the new snapshots, you can use `onSnapshot(store, snapshot => console.log(snapshot))` and log them as they are emitted.

## From snapshot to model

As we just saw, getting a snapshot from a model instance is pretty easy, but wouldn't it be neat to be able to restore a model from a snapshot? The good news is that you can!

That basically means that you can restore your objects with your custom methods by just knowing the type of the tree and its snapshot! You can perform this operation in two ways.

1. By creating a new model instance, and passing in the snapshot as argument to the `.create` function. This means that you will need to update all your store references, if used in React components, to the new one.

2. Avoiding this reference problem by applying the snapshot to an existing model instance. Properties will be updated, but the store reference will remain the same. This will trigger an operation called "reconciliation". We will talk about this phase later.

```javascript
// 1st
const store = RootStore.create({
    users: {},
    todos: {
        "1": {
            name: "Eat a cake",
            done: true
        }
    }
})

// 2nd
applySnapshot(store, {
    users: {},
    todos: {
        "1": {
            name: "Eat a cake",
            done: true
        }
    }
})
```

[View sample in the playground](https://codesandbox.io/s/3x3v5kl5mq)

## Time travel

The ability of getting snapshots and applying them makes implementing time travel really easy in user-land. What you need to do is listen for snapshots, store them and re-apply them to enable time travel!

A sample implementation would look like this:

```javascript
import { applySnapshot, onSnapshot } from "mobx-state-tree"

var states = []
var currentFrame = -1

onSnapshot(store, snapshot => {
    if (currentFrame === states.length - 1) {
        currentFrame++
        states.push(snapshot)
    }
})

export function previousState() {
    if (currentFrame === 0) return
    currentFrame--
    applySnapshot(store, states[currentFrame])
}

export function nextState() {
    if (currentFrame === states.length - 1) return
    currentFrame++
    applySnapshot(store, states[currentFrame])
}
```

## Getting to the UI

MST loves MobX, and is fully compatible with it's `autorun`, `reaction`, `observe` and other parts of the API. You can use the `mobx-react` package to connect a MST store to a React component. More details can be found in the `mobx-react` package documentation, but keep in mind that any view engine could be easily integrated with MST, just listen to `onSnapshot` and update accordingly!

```javascript
const App = observer(props => (
    <div>
        <button onClick={e => props.store.addTodo(randomId(), "New Task")}>Add Task</button>
        {values(props.store.todos).map(todo => (
            <div>
                <input type="checkbox" checked={todo.done} onChange={e => todo.toggle()} />
                <input type="text" value={todo.name} onChange={e => todo.setName(e.target.value)} />
            </div>
        ))}
    </div>
))
```

[View sample in the playground](https://codesandbox.io/s/310ol795x6)

## Improving render performance

If you have the React DevTools installed, enable the "Highlight Updates" check and you will see that the entire application will re-render whenever a `Todo` is toggled or a `name` is changed. That's a shame, as this can cause performance issues if there's a lot of `Todo`'s in our list!

Thanks to the ability of MobX to emit granular updates, fixing that becomes pretty easy! You just need to split the rendering of a `Todo` into another component to only re-render that component whenever the `Todo` data changes.

```javascript
const TodoView = observer(props => (
    <div>
        <input type="checkbox" checked={props.todo.done} onChange={e => props.todo.toggle()} />
        <input
            type="text"
            value={props.todo.name}
            onChange={e => props.todo.setName(e.target.value)}
        />
    </div>
))

const AppView = observer(props => (
    <div>
        <button onClick={e => props.store.addTodo(randomId(), "New Task")}>Add Task</button>
        {values(props.store.todos).map(todo => (
            <TodoView todo={todo} />
        ))}
    </div>
))
```

[View sample in the playground](https://codesandbox.io/s/jvmw9oxyxv)

Each `observer` declaration will enable the React component to only re-render if any of it's observed data changes. Since our `App` component was observing everything, it was re-rendering whenever you changed something.

Now that we have split the rendering logic out into a separate observer, the `TodoView` will re-render only if that `Todo` changes, and `AppView` will re-render only if a new `Todo` is added or removed since it's observing only the length of the `todos` map.

## Computed properties

We now want to display the count of TODOs to be done in our application, to help users know how many TODOs are left. That means that we need to count the number of TODOs with `done` set to `false`. To do this, we need to modify the `RootStore` declaration and add a getter property over our model by calling `.views` that will count how many TODOs are left.

```javascript
const RootStore = types
    .model({
        users: types.map(User),
        todos: types.map(Todo),
    })
    .views(self => ({
        get pendingCount() {
            return values(self.todos).filter(todo => !todo.done).length
        },
        get completedCount() {
            return values(self.todos).filter(todo => todo.done).length
        }
    }))
    .actions(self => ({
        addTodo(id, name) {
            self.todos.set(id, Todo.create({ name }))
        }
    }))
```

[View sample in the playground](https://codesandbox.io/s/7z01y57no0)

These properties are called "computed" because they keep track of the changes to the observed attributes and recompute automatically if anything used by that attribute changes. This allows for performance savings; for example changing the `name` of a TODO won't affect the number of pending and completed count, as such it wont trigger a recalculation of those counters.

We can easily see that by creating an additional component in our application that observes the store and renders those counters. Using the React DevTools and tracing updates, you'll see that changing the `name` of a TODO won't re-render the counters, while checking completed or uncompleted will re-render the `TodoView` and `TodoCounterView`.

```javascript
const TodoCounterView = observer(props => (
    <div>
        {props.store.pendingCount} pending, {props.store.completedCount} completed
    </div>
))

const AppView = observer(props => (
    <div>
        <button onClick={e => props.store.addTodo(randomId(), "New Task")}>Add Task</button>
        {values(props.store.todos).map(todo => (
            <TodoView todo={todo} />
        ))}
        <TodoCounterView store={props.store} />
    </div>
))
```

[View sample in the playground](https://codesandbox.io/s/k21ol780xr)

If you `console.log` your snapshot you'll notice that computed properties won't appear in snapshots. That's fine and intended, since those properties must be computed over the other properties of the tree, they can be re-produced by knowing just their definition. For the same reason, if you provide a computed value in a snapshot you'll end up with an error when you attempt to apply it.

## Model views

You may need to use the list of `todos` filtered by completion in various locations of your application. Even if accessing the list of `todos` and filtering them every time may look like a viable solution, if the filter logic is complex or changes over time you'll find out that it's not a viable solution.

MST solves that by providing the ability to declare model views. A model's `.views` is declared as a function over the properties (first argument) of the model declaration. Model views can accept parameters and only read data from our store. If you try to change your store from a model view, MST will throw an error and prevent you from doing so.

```javascript
const RootStore = types
    .model({
        users: types.map(User),
        todos: types.map(Todo)
    })
    .views(self => ({
        get pendingCount() {
            return values(self.todos).filter(todo => !todo.done).length
        },
        get completedCount() {
            return values(self.todos).filter(todo => todo.done).length
        },
        getTodosWhereDoneIs(done) {
            return values(self.todos).filter(todo => todo.done === done)
        }
    }))
    .actions(self => ({
        addTodo(id, name) {
            self.todos.set(id, Todo.create({ name }))
        }
    }))
```

[View sample in the playground](https://codesandbox.io/s/x293k4q95o)

Notice that the `getTodosWhereDoneIs` view can also be used outside of its model, for example it can be used inside views.

## Going further: References

Ok, the basics of our TODO application are done! But as I said when starting this tutorial, we want to be able to provide assignees for each of our TODOs!

We will focus on this feature; to do that let's assume that the list of users comes from an XHR request or another data source. Feel free to either implement it or add to the TODO application a user management feature.

First, we need to populate the `users` map. To do so, we will simply pass in some users when creating the `users` map.

```javascript
const store = RootStore.create({
    users: {
        "1": {
            name: "mweststrate"
        },
        "2": {
            name: "mattiamanzati"
        },
        "3": {
            name: "johndoe"
        }
    },
    todos: {
        "1": {
            name: "Eat a cake",
            done: true
        }
    }
})
```

[View sample in the playground](https://codesandbox.io/s/7wwn0x4xkq)

Now we need to change our `Todo` model to store the user assigned to the TODO. You could do that by storing the `User` map `id`, and provide a computed that resolves to the user (you can do it as an exercise), but you would end up with a copious amount of code.

MST supports references out of the box. That means that we can define a `user` attribute on the `Todo` model that's a reference to a `User` instance. When getting the snapshot, the value of that attribute will be the identifier of the `User`, when reading, it will resolve to the correct instance of the `User` model and when setting you could provide either the `User` model instance or the `User` identifier.

### Identifiers

In order to make our reference work, we need to tell MST which attribute to use as a unique identifier of each `User` model instance.

The identifier attribute cannot be mutated once the model instance has been created. That also means that if you try to apply a snapshot with a different identifier on that model, it will throw an error. On the other hand, providing an identifier helps MST understand elements in maps and arrays, and allows it to correctly reuse model instances in arrays and maps when possible.

To define an identifier, you will need to define a property using the `types.identifier` type composer. For example, we want the identifier to be a string.

```javascript
const User = types.model({
    id: types.identifier,
    name: types.optional(types.string, "")
})
```

As I said before, identifiers are required upon creation of the element and cannot be mutated, so if you end up receiving an error like this, it's because you also have to provide ids for the users in the snapshot for the `.create` of `RootStore`.

```
Error: [mobx-state-tree] Error while converting `{"users":{"1":{"name":"mweststrate"},"2":{"name":"mattiamanzati"},"3":{"name":"johndoe"}},"todos":{"1":{"name":"Eat a cake","done":true}}}` to `AnonymousModel`:
at path "/users/1/id" value `undefined` is not assignable to type: `identifier(string)`, expected an instance of `identifier(string)` or a snapshot like `identifier(string)` instead.
at path "/users/2/id" value `undefined` is not assignable to type: `identifier(string)`, expected an instance of `identifier(string)` or a snapshot like `identifier(string)` instead.
at path "/users/3/id" value `undefined` is not assignable to type: `identifier(string)`, expected an instance of `identifier(string)` or a snapshot like `identifier(string)` instead.
```

We can easily fix that by providing a correct snapshot.

```javascript
const store = RootStore.create({
    users: {
        "1": {
            id: "1",
            name: "mweststrate"
        },
        "2": {
            id: "2",
            name: "mattiamanzati"
        },
        "3": {
            id: "3",
            name: "johndoe"
        }
    },
    todos: {
        "1": {
            name: "Eat a cake",
            done: true
        }
    }
})
```

[View sample in the playground](https://codesandbox.io/s/44jn3pv2x)

### How to define the reference

The reference we are looking for can be easily defined as `types.reference(User)`. Sometimes this can lead to circular references that may use a model before it's declared. To postpone the resolution of the model, you can use `types.late(() => User)` instead of just `User` and that will hoist the model and defer its evaluation. The `user` assignee for the `Todo` could also be omitted, so we will use `types.maybe(...)` to allow the `user` property to be `null` and be initialized as `null`.

```javascript
const Todo = types
    .model({
        name: types.optional(types.string, ""),
        done: types.optional(types.boolean, false),
        user: types.maybe(types.reference(types.late(() => User)))
    })
    .actions(self => ({
        setName(newName) {
            self.name = newName
        },
        toggle() {
            self.done = !self.done
        }
    }))
```

[View sample in the playground](https://codesandbox.io/s/xv1lkqw9oq)

### Setting a reference value

The reference value can be set by providing either the identifier or a model instance. First of all, we need to define an action that will allow you to change the `user` of the `Todo`.

```javascript
const Todo = types
    .model({
        name: types.optional(types.string, ""),
        done: types.optional(types.boolean, false),
        user: types.maybe(types.reference(types.late(() => User)))
    })
    .actions(self => ({
        setName(newName) {
            self.name = newName
        },
        setUser(user) {
            if (user === "") {
                // When selected value is empty, set as undefined
                self.user = undefined
            } else {
                self.user = user
            }
        },
        toggle() {
            self.done = !self.done
        }
    }))
```

Now we need to edit our views to display a select along with each `TodoView`, where the user can choose the assignee for that task. To do so, we will create a separate component `UserPickerView` and use it inside the `TodoView` component to trigger the `setUser` call. That's it!

```javascript
const UserPickerView = observer(props => (
    <select value={props.user ? props.user.id : ""} onChange={e => props.onChange(e.target.value)}>
        <option value="">-none-</option>
        {values(props.store.users).map(user => (
            <option value={user.id}>{user.name}</option>
        ))}
    </select>
))

const TodoView = observer(props => (
    <div>
        <input type="checkbox" checked={props.todo.done} onChange={e => props.todo.toggle()} />
        <input
            type="text"
            value={props.todo.name}
            onChange={e => props.todo.setName(e.target.value)}
        />
        <UserPickerView
            user={props.todo.user}
            store={props.store}
            onChange={userId => props.todo.setUser(userId)}
        />
    </div>
))

const TodoCounterView = observer(props => (
    <div>
        {props.store.pendingCount} pending, {props.store.completedCount} completed
    </div>
))

const AppView = observer(props => (
    <div>
        <button onClick={e => props.store.addTodo(randomId(), "New Task")}>Add Task</button>
        {values(props.store.todos).map(todo => (
            <TodoView store={props.store} todo={todo} />
        ))}
        <TodoCounterView store={props.store} />
    </div>
))
```

[View sample in the playground](https://codesandbox.io/s/6j3qy74kpw)

## References are safe!

One neat feature of references, is that they will throw an error if you accidentally remove a model that is required by a computed property! If you try to remove a user that's used by a reference, you'll get something like this:

```
[mobx-state-tree] Failed to resolve reference of type <late>: '1' (in: /todos/1/user)
```

## Next up

In (the still TODO) part 2 of this tutorial, we will discover how to use MST life cycle hooks and local state to fetch user data from an XHR endpoint, and see how environments will help dealing with dependency injection of the parameters needed to fetch our endpoint. We will implement auto-save using MobX helpers and learn more about patches and actions event streams.
