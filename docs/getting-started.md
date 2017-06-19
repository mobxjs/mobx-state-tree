# Getting Started
The following tutorial will introduce yourself to the basics of mobx-state-tree (lately called MST) by building a sample TODO application with the ability to set assignees for every TODO. 

## Prerequisites
This tutorial assumes that you know the basics of how to use React, so if you don't know what React is and how to use it, you may read first [this tutorial](https://facebook.github.io/react/tutorial/tutorial.html).

## How to follow along the tutorial
You can write the code for this tutorial in the browser, using the playground, or in your preferred code editor (e.g. VSCode).

### Writing code in the browser
[Here](https://mattiamanzati.github.io/mobx-state-tree-playground/) you can find a browser playground for MST. It provides live preview of the React view and also allows to browse through the performed actions and emitted snapshot and patches of your MST store. When opening the playground you'll find, along the mobx, react and MST imports, an import to the mobx-state-tree-playground package. That imports two functions that you can use to display your app in the preview of the playground. Inspect() will accept an MST store (we will see later what exactly is) and will display its snapshots, actions and patches. Render() will accept a React element and will render it into the preview window of the playground.

### Writing code in the editor
Setting up the whole environment for a React project involve transpilers, bundlers, linters, etc... and setting them up may become very tedious and not funny. Thanks to `create-react-app` setting up all those tools became easy as typing a couple of lines in your terminal.

```
npm install -g create-react-app
create-react-app mst-todo
```
You can now install mobx, mobx-react and mobx-state-tree.
```
npm install mobx mobx-react mobx-state-tree --save
```
Then you can run `npm run start` and a basic React page will show up. You can now start editing all you need!

## Overview
mobx-state-tree is a state container that combines the simplicity and ease of mutable data with the traceability of immutable data and the reactiveness and performance of observable data.

If this sentence may have confused you, don't worry. We will dive together and explore what it means step by step.

## Getting Started
When building applications with MST, the first exercise that will help you building your application is thinking which is the minimal set of entities and their relative attributes of our application.

In our example application we will deal with todos, so we need a Todo entity, that have a name and a done attribute to store if that todo is done or not. We will also have a knowledge of Users (name will be enough for now), so we need an User entity, whose TODO will be assigned to.

In the end we will have something like:

User
* name

Todo
* name
* done

## Creating our first model
Central in MST (mobx-state-tree) is the concept of a living tree. The tree consists of mutable, but strictly protected objects enriched with runtime type information. In other words; each tree has a shape (type information) and state (data). From this living tree, immutable, structurally shared, snapshots are generated automatically.

This means that in order to make our application work, we need to describe to MST how our entities are shaped. Knowing that, MST will be able to generate automatically all those bounties, and help us avoiding silly mistakes, like putting strings in price fields or booleans where an array is expected.

The simplest way to define a model for an entity in MST, is by providing a sample data that will be used as defaults for it, and pass it to the types.model function.

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
[View sample in playground](https://goo.gl/iGkvGH)

The code above will create two types, a User and a Todo type, but as we said before, a tree model in MST consists of type information (and we just saw how to define them) and state (the instance data). So how we can create an instance of the Todo and User type?

## Creating model instances (tree nodes)
That could be easily done by calling .create() on the User and Todo type we just defined.
```javascript
import { types } from "mobx-state-tree"

const Todo = types.model({
    name: "",
    done: false
})

const User = types.model({
    name: ""
})

const john = User.create()
const eat = Todo.create()

console.log("John:", JSON.stringify(john))
console.log("Eat TODO:", JSON.stringify(eat))

```
[View sample in playground](https://goo.gl/6xVqf8)

As you will see, using models ensures that all the fields defined will be always present, and defaulted to the predefined value. If you want to change that value when creating the model instance, you can simply pass into the create function an object with the value to use.

```javascript
const eat = Todo.create({ name: "eat" })

console.log("Eat TODO:", JSON.stringify(eat)) // => will print {name: "eat", done: false}
```
[View sample in playground](https://goo.gl/KmhmEP)

## Meeting types
When playing with this feature and passing in values to the create method, you may encounter an error like this:
```javascript
const eat = Todo.create({ name: "eat", done: 1 })
```
```
Error: [mobx-state-tree] Error while converting `{"name":"eat","done":1}` to `AnonymousModel`:
at path "/done" value `1` is not assignable to type: `boolean`.
```
What does it means? As said before MST nodes are type-enriched. This means that providing a value (number) of the wrong type (expected boolean) will make MST throw an error. This helps a lot when building applications, as it will keep your state consistent and avoid entering in illegal states due to data of the wrong type. To be hones with you, I lied when I told you how to define models. The syntax you used was only a shortcut to the following syntax:

```javascript
const Todo = types.model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false)
})

const User = types.model({
    name: types.optional(types.string, "")
})
```
[View sample in playground](https://goo.gl/QZkShZ)

The types namespace provided in the MST package provides a lot of useful of types and utility types like array, map, maybe, refinements and unions. If you are interested in them, feel free to check out the API documentation for the whole list and their parameters.

We can now use this knowledge to combine types and define the root type of our store that will hold users and todos. It will have a map of users and todos stored under the according key. 

Notice that the types.optional second argument is required as long you don't pass a value in the create method of the type. If you want, for example, to make the name or todos property required when calling create, just remove the types.optional function call and just pass the types.* included inside.

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
    users: { } // users is required here because it's not marked as optional
})
```
[View sample in playground](https://goo.gl/Q8qffQ)

Note: You can add as last line "inspect(store)" if you are using the playground to view on the preview side the snapshot of the store. We will dive later into it.

## Modifying data
MST tree nodes (model instances) can be modified using actions. Actions are colocated with your types and can be easily defined by passing another object as parameter of types.model containing the functions that modify that tree node.

For example, the following actions will be defined on the Todo type, and will allow to toggle the done and set the name of the provided Todo instance.
```javascript
const Todo = types.model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false)
}, {
    setName(newName) {
        this.name = newName
    },
    toggle() {
        this.done = !this.done
    }
})

const User = types.model({
    name: types.optional(types.string, "")
})

const RootStore = types.model({
    users: types.map(User),
    todos: types.optional(types.map(Todo), {})
}, {
    addTodo(id, name) {
        this.todos.set(id, Todo.create({ name }))
    }
})
```
[View sample in playground](https://goo.gl/Sj17Nq)

Calling those actions is simply as you would do with plain JavaScript classes, you simply call them on a model instance!

```javascript
store.addTodo(1, "Eat a cake")
store.todos.get(1).toggle()
```
[View sample in playground](https://goo.gl/Sj17Nq)

## Snapshots are awesome!
Dealing with mutable data and objects makes easy to change data on the fly, but on the other hand it makes hard testing. Immutable data makes that very easy, so is there a way to have the best from both worlds? Nature is a great example of that, beings are living and mutable, but we eternalize it's beauty taking awesome snapshots. Can't we do the same with the state of our application?

Thanks to it's knowledge of models and relative property types, MST is able to generate serializable snapshots of our store! You can easily get a snapshot of it by using the `getSnapshot` function exported by the MST package.

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

And because the nature of state is mutable, snapshot will be emitted whenever the state is mutated! To listen to those new snapshot, you can use `onSnapshot(store, snapshot => console.log(snapshot))` to log them as they are emitted!

Note: The snapshot inspector of the playground is based `onSnapshot` as whell. The inspect function will read the current snapshot and listen for newer ones, and update the view showing you the new snapshots.

## From snapshot to model
As we just saw, getting a snapshot from a model instance is pretty easy, but would'nt be neat to be able to restore a model from a snapshot? The good news is that you can!

That basically means that you can restore your objects with your custom methods by just knowing the type of the tree and its snapshot! You can perform this operation in two ways.

The first one is by creating a new model instance, and pass in the snapshot as argument to create. That means that you will need to update all your store reference, if used in React components, to the new one.

The second one avoid this problem by applying the snapshot to an existing model instance. Properties will be updated, but the store reference will remain the same. This way will trigger an operation called "reconciliation". We will speak later about this phase.

```javascript
// 1st
const store = RootStore.create({
    "users": {},
    "todos": {
        "1": {
            "name": "Eat a cake",
            "done": true
        }
    }
})

// 2nd
applySnapshot(store, {
    "users": {},
    "todos": {
        "1": {
            "name": "Eat a cake",
            "done": true
        }
    }
})
```
[View sample in playground](https://goo.gl/eNycxT)

## Time travel
The ability of getting snapshot and apply them makes implementing time travel really easy in user-land. What you need to do is basically listen for snapshots, store them and reapply them as time travelling!

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

Note: Time travel in playground is implemented in a pretty similar way

## Getting to the UI
MST loves MobX, and is fully compatible with it's autorun, reaction, observe, etc! You can use the mobx-react package to connect a MST store to a React component!
More details can be found on the mobx-react package documentation, but keep in mind that any view engine could be easily integrated with MST, just listen to onSnapshot and update accordingly!

```javascript
const App = observer(props => <div>
    <button onClick={e => props.store.addTodo(randomId(), 'New Task')}>Add Task</button>
    {props.store.todos.values().map(todo => 
        <div>
            <input type="checkbox" checked={todo.done} onChange={e => todo.toggle()} />
            <input type="text" value={todo.name} onChange={e => todo.setName(e.target.value)} />
        </div>
    )}
</div>
)
```
[View sample in playground](https://goo.gl/V9dqv4)