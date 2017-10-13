# Getting Started
This tutorial will introduce you to the basics of mobx-state-tree (MST) by building a TODO application.  This todo application will have the ability to assign todo's to a user.

## Prerequisites
This tutorial assumes that you know the basics of how to use React. If you don't know what React is and how to use it, you may wish to read first [this tutorial](https://facebook.github.io/react/tutorial/tutorial.html).

### Do I need to learn MobX?
MST is based heavily on MobX. A basic understanding of the MobX library will help when dealing with complex situations and how to  connect the data with React components. If you don't have MobX experience, don't worry, working with MST does not require any MobX API knowledge.

## How to follow this tutorial
You can write the code for this tutorial in the browser, using the codesandbox playground, or in your preferred code editor (e.g. VSCode).

### Writing code in the browser
For each example you'll fine a codesandbox playground link. You can start from the playgrond of each point and manually progress to the next tutorial step by using it! If you're stuck, feel free to have a sneak peak from the next playground link! :)

### Writing code in the editor
Setting up the whole environment for a React project involve transpilers, bundlers, linters, etc... and setting them up may become very tedious and not fun. Thanks to `create-react-app` setting up all those tools became easy as typing a couple of lines in your terminal.

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

If this sentence confused you, don't worry. We will dive together and explore what it means step by step.

## Getting Started
When building applications with MST, the first exercise that will help you building your application is thinking which is the minimal set of entities and their relative attributes of our application.

In our example application we will deal with todos, so we need a Todo entity. The Todo entity will have a name and a done attribute to store if that todo is done or not. We will also have a knowledge of Users (name will be enough for now), so we need an User entity, whose TODO will be assigned to.

In the end we will have something like:

User
* name

Todo
* name
* done

## Creating our first model
Central to MST (mobx-state-tree) is the concept of a living tree. The tree consists of mutable, but strictly protected objects enriched with runtime type information. In other words; each tree has a shape (type information) and state (data). From this living tree, immutable, structurally shared, snapshots are generated automatically.

This means that in order to make our application work, we need to describe how our entities are shaped to MST. Knowing that, MST will be able to automatically generate all those boundaries, and help us avoiding silly mistakes, like putting strings in price fields or booleans where an array is expected.

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
[View sample in playground](https://codesandbox.io/s/98x2n959ky)

The code above will create two types, a User and a Todo type, but as we said before, a tree model in MST consists of type information (and we just saw how to define them) and state (the instance data). So how do we create an instance of the Todo and User type?

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

console.log("John:", john.toJSON())
console.log("Eat TODO:", eat.toJSON())

```
[View sample in playground](https://codesandbox.io/s/6jo1o9n9qk)

As you will see, using models ensures that all the fields defined will be always present and defaulted to the predefined value. If you want to change that value when creating the model instance, you can simply pass an object with the values to use into the create function.

```javascript
const eat = Todo.create({ name: "eat" })

console.log("Eat TODO:", eat.toJSON()) // => will print {name: "eat", done: false}
```
[View sample in playground](https://codesandbox.io/s/ymqpj71oj9)

## Meeting types
When playing with this feature and passing in values to the create method, you may encounter an error like this:
```javascript
const eat = Todo.create({ name: "eat", done: 1 })
```
```
Error: [mobx-state-tree] Error while converting `{"name":"eat","done":1}` to `AnonymousModel`:
at path "/done" value `1` is not assignable to type: `boolean`.
```
What does this mean? As I said before, MST nodes are type-enriched. This means that providing a value (number) of the wrong type (expected boolean) will make MST throw an error. This is very helpful when building applications, as it will keep your state consistent and avoid entering in illegal states due to data of the wrong type. To be honest with you, I lied when I told you how to define models. The syntax you used was only a shortcut for the following syntax:

```javascript
const Todo = types.model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false)
})

const User = types.model({
    name: types.optional(types.string, "")
})
```
[View sample in playground](https://codesandbox.io/s/j27j41828v)

The types namespace provided in the MST package provides a lot of useful types and utility types like array, map, maybe, refinements and unions. If you are interested in them, feel free to check out the API documentation for the whole list and their parameters.

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
[View sample in playground](https://codesandbox.io/s/5wyx1xvvj4)

## Modifying data
MST tree nodes (model instances) can be modified using actions. Actions are colocated with your types and can be easily defined by declaring `.actions` over your model type and passing it a functions that accept the model instance and returns an object with the functions that modify that tree node.

For example, the following actions will be defined on the Todo type, and will allow you to toggle the done and set the name of the provided Todo instance.
```javascript
const Todo = types.model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false)
}).actions(self => {
    function setName(newName) {
        self.name = newName
    }

    function toggle() {
        self.done = !self.done
    }

    return {setName, toggle}
})

const User = types.model({
    name: types.optional(types.string, "")
})

const RootStore = types.model({
    users: types.map(User),
    todos: types.optional(types.map(Todo), {})
}).actions(self => {
    function addTodo(id, name) {
        self.todos.set(id, Todo.create({ name }))
    }

    return {addTodo}
})
```
[View sample in playground](https://codesandbox.io/s/928l6pw7pr)

Please notice the use of "self". Self is the object being constructed when an instance of your model is created. Thanks to the self object instance actions are "this-free", allowing you to be sure that they are correclty bound.

Calling those actions is as simple as what you would do with plain JavaScript classes, you simply call them on a model instance!

```javascript
store.addTodo(1, "Eat a cake")
store.todos.get(1).toggle()
```
[View sample in playground](https://codesandbox.io/s/928l6pw7pr)

## Snapshots are awesome!
Dealing with mutable data and objects makes it easy to change data on the fly, but on the other hand it makes testing hard. Immutable data makes that very easy.  Is there a way to have the best of both worlds? Nature is a great example of that. Beings are living and mutable, but we may eternalize nature's beauty by taking awesome snapshots. Can we do the same with the state of our application?

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

Note: The `.toJSON()` you have used before in the tutorial is just a shortcut to `getSnapshot`!

Because the nature of state is mutable, a snapshot will be emitted whenever the state is mutated! To listen to those new snapshot, you can use `onSnapshot(store, snapshot => console.log(snapshot))` to log them as they are emitted!

## From snapshot to model
As we just saw, getting a snapshot from a model instance is pretty easy, but wouldn't it be neat to be able to restore a model from a snapshot? The good news is that you can!

That basically means that you can restore your objects with your custom methods by just knowing the type of the tree and its snapshot! You can perform this operation in two ways.

First is by creating a new model instance, and pass in the snapshot as argument to create. That means that you will need to update all your store references, if used in React components, to the new one.

The second option avoids this refrence problem by applying the snapshot to an existing model instance. Properties will be updated, but the store reference will remain the same. This will trigger an operation called "reconciliation". We will speak later about this phase.

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
[View sample in playground](https://codesandbox.io/s/xjm99kkopp)

## Time travel
The ability of getting snapshots and applying them makes implementing time travel really easy in user-land. What you need to do is basically listen for snapshots, store them and reapply them to enable time travel!

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
[View sample in playground](https://codesandbox.io/s/r54o5pp8z4)

## Improving render performance
If you have the React DevTools installed, using the "Highlight Updates" check you will see that the entire application will re-render whenever a todo is toggled or name is changed. That's a shame, as this can cause performance issues if there are a lots of todos in our list!

Thanks to the ability of MobX to emit granular updates, fixing that becomes pretty easy! You just need to split the rendering of a Todo into another component to only re-render that component whenever the todo data changes.

```javascript
const TodoView = observer(props =>
        <div>
            <input type="checkbox" checked={props.todo.done} onChange={e => props.todo.toggle()} />
            <input type="text" value={props.todo.name} onChange={e => props.todo.setName(e.target.value)} />
        </div>)

const AppView = observer(props =>
        <div>
            <button onClick={e => props.store.addTodo(randomId(), 'New Task')}>Add Task</button>
            {props.store.todos.values().map(todo => <TodoView todo={todo} />)}
        </div>
)
```
[View sample in playground](https://codesandbox.io/s/m3rw1wll79)

Basically each `observer` declaration will enable the React component to only re-render if any of it's observed data changes. Since our App component was observing everything, it was basically re-rendering whenever you changed something.

Now that we have split the rendering logic out into a separate observer, the Todo will re-render only if that todo changes, and App will re-render only if a new todo is added/removed since it's observing only the length of the todo map.

## Computed properties

We now want to display the count of TODOs to be done in our application, to help users know how many TODOs are left. That means that we need to count the number of TODOs with "done" set to false. To do this, we just need to modify the RootStore declaration, and add a getter property over our model by calling `.views` that will count how many TODOs are left.

```javascript
const RootStore = types.model({
    users: types.map(User),
    todos: types.optional(types.map(Todo), {}),
}).views(self => ({
    get pendingCount() {
        return self.todos.values().filter(todo => !todo.done).length
    },
    get completedCount() {
        return self.todos.values().filter(todo => todo.done).length
    }
})).actions(self => {
    function addTodo(id, name) {
        self.todos.set(id, Todo.create({ name }))
    }

    return {addTodo}
})
```
[View sample in playground](https://codesandbox.io/s/x3qlr3xpjo)

Those properties are called "computed" because they keep track of the changes of the observed fields and recompute automatically if anything used by that field changes. This allows for performance savings; for example changing the name of a TODO won't affect the number of pending and completed count, as such it wont trigger a recalculation of those counters.

We can easily see that by creating an additional component in our application that observes the store and renders those counters. Using the React Dev Tools and tracing updates, you'll see that changing the name of a TODO won't re-render that counters, while checking completed or uncompleted will re-render the todo and the counters.

```javascript
const TodoCounterView = observer(props =>
        <div>
            {props.store.pendingCount} pending, {props.store.completedCount} completed
        </div>
)

const AppView = observer(props =>
        <div>
            <button onClick={e => props.store.addTodo(randomId(), 'New Task')}>Add Task</button>
            {props.store.todos.values().map(todo => <TodoView todo={todo} />)}
            <TodoCounterView store={props.store} />
        </div>
)
```
[View sample in playground](https://codesandbox.io/s/x3qlr3xpjo)

If you're console.log your snapshot, you'll notice that computed properties won't appear in snapshots. Thats fine and intended, since those properties must be computed over the other properties of the tree, they can be reproduced by knowing just their definition. For the same reason, if you provide a computed value in a snapshot you'll end up with an error when you attempt to apply it.

## Model views
You may need to use the list of todos filtered by completion in various locations in your application. Even if accessing the list of todos and filter them every time may look a viable solution, if the filter logic is complex or changes over time you'll find that it's not a viable solution.

MST solves that by providing the ability to declare model views. A model views is declared as a function over the properties (first argument) of the model declaration. Model views can accept parameters and only read data from our store. If you try to change your store from a model view, MST will throw and prevent your from doing so.

```javascript
const RootStore = types.model({
    users: types.map(User),
    todos: types.optional(types.map(Todo), {})
}).views(self => ({
    get pendingCount() {
        return self.todos.values().filter(todo => !todo.done).length
    },
    get completedCount() {
        return self.todos.values().filter(todo => todo.done).length
    },
    getTodosWhereDoneIs(done) {
        return self.todos.values().filter(todo => todo.done === done)
    }
})).actions(self => {
    function addTodo(id, name) {
        self.todos.set(id, Todo.create({ name }))
    }

    return {addTodo}
})
```
[View sample in playground](https://codesandbox.io/s/zkrkwj91p3)

Notice that the `getTodosWhereDoneIs` view can also be used outside of its model, for example it can be used inside views.

## Going further: References
Ok, the basics of our TODO application are done! But as I said when starting this tutorial, we want to be able to provide assignees for each of our todos!

We will focus on this feature; to do that let's assume that the list of the users cames from an XHR request or other data sources. Feel free to either implement it or add to the todo application a user management feature.

First, we need to populate the users map. To do so, we will simply pass in some users when creating the users map.

```javascript
const store = RootStore.create({
    "users": {
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
    "todos": {
        "1": {
            "name": "Eat a cake",
            "done": true
        }
    }
})
```
[View sample in playground](https://codesandbox.io/s/7zqlw3ro11)

Now we need to change our Todo model to store the user assigned to that task. You could do that by storing the User map id, and provide a computed that resolves to the user (you can do it as an exercise), but that would end up being a copious amount of code.

MST supports references out of the box. That means that we can define a "user" attribute on the Todo model, that's a reference to a User. When getting the snapshot, the value of that attribute will be the identifier of the User, when reading, it will resolve to the correct instance of the User model and when setting you could provide either the User model instance or the User identifier.

### Identifiers
In order to make our reference work, we first need to set up identifier in the targetted model Type of the reference. We need to tell MST which attribute is the identifier of the user.

The identifier attribute cannot be mutated once the model instance has been created. That also means that if you try to apply a snapshot with a different identifier on that model, it will throw. On the other hand, providing an identifier helps MST understand elements in maps and arrays, and allows it to correctly reuse model instances in arrays/maps when possible.

To define an identifier, you will need to define a property using the `types.identifier` type composer. For example, we want the identifier to be a string.

```javascript
const User = types.model({
    id: types.identifier(types.string),
    name: types.optional(types.string, "")
})
```

As I said before, identifiers are required upon creation of the element and cannot be mutated, so if you end up receiving an error like this, that's because you also need to provide ids for the users in the snapshot for the .create of the RootStore.

```
Error: [mobx-state-tree] Error while converting `{"users":{"1":{"name":"mweststrate"},"2":{"name":"mattiamanzati"},"3":{"name":"johndoe"}},"todos":{"1":{"name":"Eat a cake","done":true}}}` to `AnonymousModel`:
at path "/users/1/id" value `undefined` is not assignable to type: `identifier(string)`, expected an instance of `identifier(string)` or a snapshot like `identifier(string)` instead.
at path "/users/2/id" value `undefined` is not assignable to type: `identifier(string)`, expected an instance of `identifier(string)` or a snapshot like `identifier(string)` instead.
at path "/users/3/id" value `undefined` is not assignable to type: `identifier(string)`, expected an instance of `identifier(string)` or a snapshot like `identifier(string)` instead.
```
we can easily fix that by providing a correct snapshot.
```javascript
const store = RootStore.create({
    "users": {
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
    "todos": {
        "1": {
            "name": "Eat a cake",
            "done": true
        }
    }
})
```
[View sample in playground](https://codesandbox.io/s/mzvx6o7r0j)

### How to define the reference
The reference we are looking for can be easily defined as `types.reference(User)`. Sometimes this can lead to circular references that may use a type before it's declared. To postpone the resolution of the type, you can use `types.late(() => User)` instead of just `User` and that will hoist the type and defer its evaluation. The user assignee for the Todo could also be omitted, so we will use `types.maybe(...)` to allow the user property to be null and be initialized as null.

```javascript
const Todo = types.model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false),
    user: types.maybe(types.reference(types.late(() => User)))
}).actions(self => {
    function setName(newName) {
        self.name = newName
    }
    function toggle() {
        self.done = !self.done
    }

    return {setName, toggle}
})
```
[View sample in playground](https://codesandbox.io/s/mzvx6o7r0j)

### Setting a reference value
The reference value can be set by providing either the identifier or a model instance. First of all, we need to define an action that will allow you to change the user of the todo.

```javascript
const Todo = types.model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false),
    user: types.maybe(types.reference(types.late(() => User)))
}).actions(self => {
    function setName(newName) {
        self.name = newName
    }
    function setUser(user) {
        if (user === "") { // When selected value is empty, set as null
            self.user = null
        } else {
            self.user = user
        }
    }
    function toggle() {
        self.done = !self.done
    }

    return {setName, setUser, toggle}
})
```

Now we need to edit our views to display a select along with each todo, where the user can chose the assignee for that task. To do so, we will create a separate component (the UserPickerView) and use it inside the TodoView component to trigger the setUser call. That's it!

```javascript
const UserPickerView = observer(props =>
    <select value={props.user ? props.user.id : ""} onChange={e => props.onChange(e.target.value)}>
        <option value="">-none-</option>
        {props.store.users.values().map(user => <option value={user.id}>{user.name}</option>)}
    </select>
)

const TodoView = observer(props =>
        <div>
            <input type="checkbox" checked={props.todo.done} onChange={e => props.todo.toggle()} />
            <input type="text" value={props.todo.name} onChange={e => props.todo.setName(e.target.value)} />
            <UserPickerView user={props.todo.user} store={props.store} onChange={userId => props.todo.setUser(userId)} />
        </div>
)

const TodoCounterView = observer(props =>
        <div>
            {props.store.pendingCount} pending, {props.store.completedCount} completed
        </div>
)

const AppView = observer(props =>
        <div>
            <button onClick={e => props.store.addTodo(randomId(), 'New Task')}>Add Task</button>
            {props.store.todos.values().map(todo => <TodoView store={props.store} todo={todo} />)}
            <TodoCounterView store={props.store} />
        </div>
)
```
[View sample in playground](https://codesandbox.io/s/mzvx6o7r0j)

## References are safe!
One neat feature of references, is that they will throw if you accidentally remove a model that is required by a computed! If you try to remove a user that's used by a reference, you'll get something like this:

```
[mobx-state-tree] Failed to resolve reference of type <late>: '1' (in: /todos/1/user)
```

## Next up
In part 2 of this tutorial, we will discover how to use MST lifecycle hooks and local state to fetch user data from an XHR endpoint, and see how envinronments will help dealing with dependency injection of the parameters needed to fetch our endpoint. We will implement auto-save using mobx helpers and learn more about patches and actions event streams.
