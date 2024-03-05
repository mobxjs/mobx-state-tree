---
id: context-reducer-vs-mobx-state-tree
title: React Context vs. MobX-State-Tree
---

If you're using React, you have the option to manage application state with built in hooks, like [`useContext`](https://react.dev/reference/react/useContext) and [`useReducer`](https://react.dev/reference/react/useReducer). The React docs have [a great example showing how to combine these two hooks to manage more complex state](https://react.dev/learn/scaling-up-with-reducer-and-context).

React built-ins are a great choice if you're strongly opposed to adding new dependencies to your project, or if you want to write flexible JavaScript code with your own set of conventions and choices.

MobX-State-Tree can provide you with the same features as React's built-in state management hooks, but with the added benefits of:

- Better performance out of the box due to MST's reactive, observable state as opposed to context's data flow through the React component tree.
- Automatic TypeScript inference of your state, which makes your state management discoverable, and statically verifiable to prevent author-time bugs.
- Runtime type safety for your state, which helps keep your application bug free as your codebase and team grows.
- Clearer data modeling with our rich runtime type system as opposed to writing plain JS objects.
- Built-in immutability with [snapshots](../concepts/snapshots.md), great for common operations like "undo/redo", time travel debugging, or synchronizing with external systems
- Easy persistence with utilities like [mst-persist](https://www.npmjs.com/package/mst-persist)
- Much more

## React Context/Reducer Code Review

If you haven't worked with complex contexts and reducers in React, you should definitely read through [their guide on advanced usage](https://react.dev/learn/scaling-up-with-reducer-and-context). It will help you make a fair assessment between React state hooks and MobX-State-Tree.

[Here is the CodeSandbox of their final product in that article](https://codesandbox.io/p/sandbox/react-dev-wy7lfd?file=%2Fsrc%2FTasksContext.js%3A54%2C4&utm_medium=sandpack).

For your reference, [here is the same set of features, built with MobX-State-Tree instead of Context/Reducers](https://codesandbox.io/p/sandbox/mobx-state-tree-instead-of-reducer-and-context-8824l8?file=%2Fsrc%2FViewModel.ts%3A15%2C24.).

Let's focus on comparing just the state-management code in React's `src/TasksContext.js`, and MST's `src/ViewModel.ts`. To start, we'll compare code, and then we'll move on to feature comparisons.

```js
// React context/reducer in `src/TasksContext.js`
// https://codesandbox.io/p/sandbox/react-dev-wy7lfd?file=%2Fsrc%2FTasksContext.js%3A43%2C17&utm_medium=sandpack
import { createContext, useContext, useReducer } from "react"

const TasksContext = createContext(null)

const TasksDispatchContext = createContext(null)

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>{children}</TasksDispatchContext.Provider>
    </TasksContext.Provider>
  )
}

export function useTasks() {
  return useContext(TasksContext)
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext)
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added": {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false
        }
      ]
    }
    case "changed": {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task
        } else {
          return t
        }
      })
    }
    case "deleted": {
      return tasks.filter((t) => t.id !== action.id)
    }
    default: {
      throw Error("Unknown action: " + action.type)
    }
  }
}

const initialTasks = [
  { id: 0, text: "Philosopher’s Path", done: true },
  { id: 1, text: "Visit the temple", done: false },
  { id: 2, text: "Drink matcha", done: false }
]
```

### React Code is Tightly Coupled

The Context/Reducer code is, understandably, very coupled to React. It exports JSX directly:

```js
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>{children}</TasksDispatchContext.Provider>
    </TasksContext.Provider>
  )
}
```

It also mixes concerns. Note how in `TasksProvider`, the reducer, initial tasks, and dispatch value have to come together with the UI code to become useful. It's not entirely clear from a top-to-bottom glance where the source of truth for state is.

### Reducer Functions Lack Convention

Check out the reducer function:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added": {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false
        }
      ]
    }
    case "changed": {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task
        } else {
          return t
        }
      })
    }
    case "deleted": {
      return tasks.filter((t) => t.id !== action.id)
    }
    default: {
      throw Error("Unknown action: " + action.type)
    }
  }
}
```

With three actions, this feels somewhat manageable. But what if your state mutations are more numerous or more complex? Of course you can split those out into other files, but then your codebase gets fragmented, and it's becomes more difficult to reason about it overtime.

Moreover, the `action` argument is opaque. What types are valid? What other data will come along with it? You could write these out in TypeScript and define valid shapes, but that's more work and boilerplate for you.

### Unclear Initial State in Context/Reducer

The reducer/context example provides `initialTasks`, like this:

```js
const initialTasks = [
  { id: 0, text: "Philosopher’s Path", done: true },
  { id: 1, text: "Visit the temple", done: false },
  { id: 2, text: "Drink matcha", done: false }
]
```

But those are just the initial tasks. If you followed the React tutorial, you might be wondering:

1. How do we know if an item is being edited?
2. Where are we storing `nextId`?

Turns out, the item being edited is managed as local state with `useState` in [`src/TaskList.js`](https://codesandbox.io/p/sandbox/react-dev-wy7lfd?file=%2Fsrc%2FTaskList.js%3A15%2C2&utm_medium=sandpack):

```js
// ...
function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
// ...
```

We use an auto-incrementing number for IDs. In the React example, this is stored and initialized in [`src/AddTask.js`](https://codesandbox.io/p/sandbox/react-dev-wy7lfd?file=%2Fsrc%2FAddTask.js%3A27%2C1&utm_medium=sandpack):

```js
// At the bottom of `src/AddTask.js`:
let nextId = 3
```

## MobX-State-Tree Code Review

```ts
// MST's viewmodel in `src/ViewModel.ts`.
// https://codesandbox.io/p/sandbox/mobx-state-tree-instead-of-reducer-and-context-8824l8?file=%2Fsrc%2FViewModel.ts%3A88%2C1
import { t, Instance } from "mobx-state-tree"

const Task = t
  .model("Task", {
    id: t.identifierNumber,
    text: t.string,
    done: t.optional(t.boolean, false),
    isBeingEdited: t.optional(t.boolean, false)
  })
  .actions((self) => ({
    setText(text: string) {
      self.text = text
    },
    setDone(done: boolean) {
      self.done = done
    },
    setIsBeingEdited(beingEdited: boolean) {
      self.isBeingEdited = beingEdited
    }
  }))

export interface ITask extends Instance<typeof Task> {}

const ViewModel = t
  .model("ViewModel", {
    taskInputText: "",
    nextId: 0,
    tasks: t.array(Task)
  })
  .actions((self) => ({
    addTask() {
      const { nextId, taskInputText } = self

      if (!taskInputText) {
        return
      }

      const newTask = Task.create({
        id: nextId,
        text: taskInputText
      })

      self.tasks.push(newTask)

      self.nextId += 1

      self.taskInputText = ""
    },
    deleteTask(id: number) {
      const task = self.tasks.find((t) => t.id === id)
      if (task) {
        self.tasks.remove(task)
      }
    },
    setInputText(text: string) {
      self.taskInputText = text
    }
  }))

export const ViewModelSingleton = ViewModel.create({
  nextId: 3,
  tasks: [
    { id: 0, text: "Philosopher’s Path", done: true },
    { id: 1, text: "Visit the temple", done: false },
    { id: 2, text: "Drink matcha", done: false }
  ]
})
```

### MobX-State-Tree Decouples State from UI

The MobX-State-Tree code doesn't really "know" anything about React (or Vue, or Angular, or Solid, or Svelte, or any other library you might be using). It is Just TypeScript. Which means it does not suffer from the [coupling problems of React state built-ins](#react-code-is-tightly-coupled). We can't really fault React tools for being coupled to React, but using MST will provide you with more flexibility to change your UI code, and even your entire UI library if you ever choose to.

### Conventional State Change with Actions

The `.actions` block in our MST code replaces the React reducer. Rather than managing our actions with dispatches and a switch statement, we can write state mutations as regular TypeScript functions. Each aciton gets its own set of parameters. You can call those actions like regular functions, rather than "dispatching" the action boilerplate. This is the code we're talking about:

```ts
  .actions((self) => ({
    addTask() {
      const { nextId, taskInputText } = self;

      if (!taskInputText) {
        return;
      }

      const newTask = Task.create({
        id: nextId,
        text: taskInputText,
      });

      self.tasks.push(newTask);

      self.nextId += 1;

      self.taskInputText = "";
    },
    deleteTask(id: number) {
      const task = self.tasks.find((t) => t.id === id);
      if (task) {
        self.tasks.remove(task);
      }
    },
    setInputText(text: string) {
      self.taskInputText = text;
    },
  }));
```

If you want to add a task, you'd call:

```ts
ViewModelSingleton.addtask()
```

And we'd create a task based on the current state of the `taskInputText`. State would update, and the UI would respond to the granular updates. Simple and lovely to work with!

### MST is a Single Source of Truth for State

It's easier to clarify initial state in MobX-State-Tree. In our example, we provide it much like the [initial state in Context](#unclear-initial-state-in-contextreducer):

```ts
export const ViewModelSingleton = ViewModel.create({
  nextId: 3,
  tasks: [
    { id: 0, text: "Philosopher’s Path", done: true },
    { id: 1, text: "Visit the temple", done: false },
    { id: 2, text: "Drink matcha", done: false }
  ]
})
```

This code is creating a new instance of a ViewModel, and it's providing it with all of the initial state we need. If we gave an invalid initial state, MobX-State-Tree would warn us:

```ts
export const ViewModelSingleton = ViewModel.create({
  nextId: "3", // We use numbers for IDs, not strings. This will give you a TypeScript error if you're using TS
  tasks: [
    { id: 0, text: "Philosopher’s Path", done: true },
    { id: 1, text: "Visit the temple", done: false },
    { id: 2, text: "Drink matcha", done: false }
  ]
})
```

If we use the wrong kind of value for our `nextId`, we'll get a TypeScript error like:

```
Type 'string' is not assignable to type 'number'.typescript(2322)
```

And if you're not using TypeScript, MST will let you know about it in the runtime:

```
[mobx-state-tree] Error while converting `{"nextId":"3","tasks":[{"id":0,"text":"Philosopher’s Path","done":true},{"id":1,"text":"Visit the temple","done":false},{"id":2,"text":"Drink matcha","done":false}]}` to `ViewModel`: at path "/nextId" value `"3"` is not assignable to type: `number` (Value is not a number).
```

If you want to avoid even this much initial code, you're free to initialize the view model with no tasks. Since we wrote the `nextId` value as a literal, MST will assume it's optional, and the provided value is the default. So this code:

```ts
const ViewModel = t.model("ViewModel", {
  taskInputText: t.maybe(t.string),
  nextId: 0,
  tasks: t.array(Task)
})
```

Allows us to write:

```ts
export const ViewModelSingleton = ViewModel.create({})
```

It _also_ keeps all of this state in one central place. We can read the file top-to-bottom and understand the entirety of our state at a glance.

## React Context/Reducer Rendering Performance

Imagine you want to use React Context in a large React application with many layers of nesting. As a placeholder for a complex app, we can wrap our code in some `MiddleComponent`:

```js
// src/MiddleComponent.js
export default function MiddleComponent(props) {
  const { children } = props;
  console.log("MiddleComponent evaluated");

  return <div>{children}</div>;
}

// src/App.js

import AddTask from "./AddTask.js";
import TaskList from "./TaskList.js";
import MiddleComponent from "./MiddleComponent.js";
import { TasksProvider } from "./TasksContext.js";

export default function TaskApp() {
  return (
    <TasksProvider>
      <MiddleComponent>
        <h1>Day off in Kyoto</h1>
        <AddTask />
        <TaskList />
      </MiddleComponent>
    </TasksProvider>
  );
}
```

[Play around with this in CodeSandbox and pay attention to the console](https://codesandbox.io/p/sandbox/react-dev-reducer-context-with-middle-component-cjgg72?file=%2Fsrc%2FMiddleComponent.js%3A11%2C1). Add some to-dos, delete some, check some off. You'll see this output in the console:

```
MiddleComponent evaluated
MiddleComponent evaluated
MiddleComponent evaluated
MiddleComponent evaluated
MiddleComponent evaluated
MiddleComponent evaluated
MiddleComponent evaluated
MiddleComponent evaluated
MiddleComponent evaluated
```

And so on, for as many times as you change the values in the context provider.

### Requires You to Manage Optimizations

Of course, you can fix this in React with memoization:

```jsx
// src/MiddleComponent.js
import React from "react"

const MiddleComponent = React.memo(function MiddleComponent(props) {
  const { children } = props
  console.log("MiddleComponent evaluated")

  return <div>{children}</div>
})

export default MiddleComponent
```

Or you can split context into many sub-contexts and provide them to children more granularly.

But all that said, _you_ still have to manage this complexity in some way. This is advantageous if you and your team are adept at performance work, and want to have fine-grained control of the primitive building blocks provided by React. But many teams lack the expertise, time, or interest in managing this themselves. MobX-State-Tree can solve this pain point for you out-of-the-box.

## MobX-State-Tree Performance

Given a similar component and setup:

```tsx
// src/MiddleComponent.tsx
import React from "react"

export default function MiddleComponent(props) {
  const { children } = props
  console.log("MiddleComponent evaluated")

  return <div>{children}</div>
}

// src/App.tsx
import AddTask from "./AddTask"
import TaskList from "./TaskList"
import MiddleComponent from "./MiddleComponent"

export default function TaskApp() {
  return (
    <>
      <MiddleComponent>
        <h1>Day off in Kyoto</h1>
        <AddTask />
        <TaskList />
      </MiddleComponent>
    </>
  )
}
```

### Handles Granular Updates Automatically

[Try the same set of actions in CodeSandbox](https://codesandbox.io/p/sandbox/mobx-state-tree-instead-of-reducer-and-context-with-middle-component-y2h558?file=%2Fsrc%2FMiddleComponent.tsx%3A9%2C1), and you'll see that the `MiddleComponent` does _not_ get re-evaluated. MobX-State-Tree does this for you with its [observer higher-order-component](../intro/getting-started#getting-to-the-ui), which [only re-renders components when their observed data changes](../intro/getting-started#improving-render-performance).

## Automatic TypeScript Types with MobX-State-Tree

So far we've been comparing React's [JavaScript only example](https://codesandbox.io/p/sandbox/react-dev-wy7lfd?file=%2Fsrc%2Findex.js%3A28%2C30&utm_medium=sandpack) against a MobX-State-Tree example [written in TypeScript](https://codesandbox.io/p/sandbox/mobx-state-tree-instead-of-reducer-and-context-8824l8?file=%2Fsrc%2FViewModel.ts%3A11%2C22).

The TypeScript story for MobX-State-Tree is very straightforward. In [`src/ViewModel.ts`](https://codesandbox.io/p/sandbox/mobx-state-tree-instead-of-reducer-and-context-8824l8?file=%2Fsrc%2FViewModel.ts%3A69%2C20) you can write `ViewModelSingleton.` and get auto-complete for all its properties and actions.

If you want to do more with these types, we [have a recommended set of type helpers](../tips/typescript#using-a-mst-type-at-design-time). In our example, you can see we use:

```ts
export interface ITask extends Instance<typeof Task> {}
```

To tell the [Task component](https://codesandbox.io/p/sandbox/mobx-state-tree-instead-of-reducer-and-context-8824l8?file=%2Fsrc%2FTaskList.tsx%3A27%2C19) what to expect in its props.

You don't have to make any choices about the TypeScript design. Model out your state with MST, and we'll give you an opinionated set of TypeScript types back. You trade off some control for quicker development overall, much like the performance management.

## Write Your Own Types for React Context/Reducer

If you want to use React Context/Reducer with TypeScript, you'll need to specify your types from the ground up. Many teams might like this approach, but it does require you to take the time to do so. Here's one way you might type the context:

```tsx
import React, { createContext, useContext, useReducer, ReactNode, Dispatch, JSX } from "react"

export interface Task {
  id: number
  text: string
  done: boolean
}

type Action =
  | { type: "added"; id: number; text: string }
  | { type: "changed"; task: Task }
  | { type: "deleted"; id: number }

const TasksContext = createContext<Task[] | null>(null)
const TasksDispatchContext = createContext<Dispatch<Action> | null>(null)

export function TasksProvider({ children }: { children: ReactNode }): JSX.Element {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>{children}</TasksDispatchContext.Provider>
    </TasksContext.Provider>
  )
}

export function useTasks(): Task[] {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider")
  }
  return context
}

export function useTasksDispatch(): Dispatch<Action> {
  const context = useContext(TasksDispatchContext)
  if (!context) {
    throw new Error("useTasksDispatch must be used within a TasksProvider")
  }
  return context
}

function tasksReducer(tasks: Task[], action: Action): Task[] {
  switch (action.type) {
    case "added": {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false
        }
      ]
    }
    case "changed": {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task
        } else {
          return t
        }
      })
    }
    case "deleted": {
      return tasks.filter((t) => t.id !== action.id)
    }
    default: {
      throw Error("Unknown action: " + action)
    }
  }
}

const initialTasks = [
  { id: 0, text: "Philosopher’s Path", done: true },
  { id: 1, text: "Visit the temple", done: false },
  { id: 2, text: "Drink matcha", done: false }
]
```

[See the whole example converted to TypeScript in CodeSandbox](https://codesandbox.io/p/sandbox/react-dev-context-reducer-example-with-typescript-l8ym3t?file=%2Fsrc%2FTasksContext.tsx%3A91%2C1)

## Context/Reducer Cannot Guarantee Type Safety at Runtime

In the React Context/Reducer example, you are required to understand the kinds of initial data that satisfy your requirements. You must remember how to write them, and write them consistently. The example provides initial tasks like this:

```js
const initialTasks = [
  { id: 0, text: "Philosopher’s Path", done: true },
  { id: 1, text: "Visit the temple", done: false },
  { id: 2, text: "Drink matcha", done: false }
]
```

But if you write an invalid task, React won't stop you:

```js
const initialTasks = [
  { id: 0, text: "Philosopher’s Path", done: true },
  { id: 1, text: "Visit the temple", done: false },
  { id: 2, text: "Drink matcha", done: false },
  {
    something: "else",
    works: false,
    id: () => {
      console.log("here")
    }
  }
]
```

In fact, React _almost_ does the right thing here. If you check out the [CodeSandbox with this incorrect data](https://codesandbox.io/p/sandbox/react-dev-context-reducer-with-incorrect-task-data-nqw67d?file=%2Fsrc%2FTasksContext.js%3A56%2C1), you'll see that a fourth item shows up. You can even edit/delete/check it off. The React components themselves are pretty resilient.

But if you check off the task, or edit its name, you'll get a warning in the console:

```
Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components
```

This is because we've left `text` and `done` to be `undefined`, and then the reducer is modifying those values.

In the small, toy React example, this isn't a huge deal. But this kind of unexpected behavior can lead to serious bugs in a larger application.

## MobX-State-Tree Provides Runtime Type Safety by Default

[Open up the MST example in CodeSandbox](https://codesandbox.io/p/sandbox/mobx-state-tree-instead-of-reducer-and-context-8824l8?file=%2Fsrc%2FViewModel.ts%3A15%2C24.) and change the ViewModel instantiation to be:

```ts
export const ViewModelSingleton = ViewModel.create({
  nextId: 3,
  tasks: [
    { id: 0, text: "Philosopher’s Path", done: true },
    { id: 1, text: "Visit the temple", done: false },
    { id: 2, text: "Drink matcha", done: false },
    {
      something: "else",
      works: false,
      id: () => {
        console.log("here")
      }
    }
  ]
})
```

You'll _immediately receive an error from MobX-State-Tree_:

```
[mobx-state-tree] Error while converting `{"nextId":3,"tasks":[{"id":0,"text":"Philosopher’s Path","done":true},{"id":1,"text":"Visit the temple","done":false},{"id":2,"text":"Drink matcha","done":false},{"something":"else","works":false}]}` to `ViewModel`:

    at path "/tasks/3/id" snapshot <function id> is not assignable to type: `identifierNumber` (Value is not a valid identifierNumber, expected a number), expected an instance of `identifierNumber` or a snapshot like `identifierNumber` instead.
    at path "/tasks/3/text" value `undefined` is not assignable to type: `string` (Value is not a string).
```

This error will both prevent you from making costly mistakes in the future, and it even attempts to give you information about _precisely what's wrong_, which makes debugging things easier.

_(Note: by default, MST will not run this check in production mode, which improves performance and prevents your app from crashing in real-world scenarios with untrusted data/inputs)_

## MobX-State-Tree Gives you Building Blocks for Advanced Data Modeling

In the Reducer/Context example, we arbitrarily decide that a task looks like this:

```js
{ id: 0, text: "Philosopher’s Path", done: true },
```

With TypeScript, we can annotate the types of these objects. But if you're building a complex app, sometimes you want to enforce your data modeling beyond conventions and static types.

In MobX-State-Tree, we turned that object syntax into a model itself:

```ts
const Task = t
  .model("Task", {
    id: t.identifierNumber,
    text: t.string,
    done: t.optional(t.boolean, false),
    isBeingEdited: t.optional(t.boolean, false)
  })
  .actions((self) => ({
    setText(text: string) {
      self.text = text
    },
    setDone(done: boolean) {
      self.done = done
    },
    setIsBeingEdited(beingEdited: boolean) {
      self.isBeingEdited = beingEdited
    }
  }))
```

Now our program understands that a `Task` is a real entity with a defined set of properties, and well defined actions it can take at runtime. This is a clearer way to communicate your intention to other programmers, and to enforce rules for your data modeling in your application.

There are [many different types](../overview/types.md) you can extend and build with to provide this same kind of structure and safety to your application at all levels. This is another tradeoff: MST primitives and models have rules that plain JavaScript objects do not. But if you learn those rules, you can improve your developer experience, and more rigorously model your application state for your future self and the rest of your team to work with correctly.

## React Context/Reducer Needs Custom Code for Time Travel Debugging

[Time travel debugging](https://medium.com/the-web-tub/time-travel-in-react-redux-apps-using-the-redux-devtools-5e94eba5e7c0) is a popular tool used to observe how application state changes over time, and diagnose any errors or inaccuracies. The idea is to keep a record of the state and its mutations over time, and then play it back through some dev tooling or observability that understands how to represent the state.

Building this kind of functionality is possible with Reducers and Context, but you have to build it yourself, from the ground up.

## MobX-State-Tree Has Built-in Time Travel Primitives

MobX-State-Tree generates [snapshots](../concepts/snapshots.md), which are immutable, serialized versions of the state at each point it gets changes. You can listen to the snapshots with the `onSnapshot` listener, like this:

```ts
const initialSnapshot = JSON.stringify(getSnapshot(ViewModelSingleton))
const timeTravel: string[] = [initialSnapshot]
onSnapshot(ViewModelSingleton, (snapshot) => {
  timeTravel.push(JSON.stringify(snapshot))
})
```

In this code, we take an inital snapshot of the `ViewModelSingleton`, and then store each subsequent snapshot. You can play around with this in [CodeSandbox](https://codesandbox.io/p/sandbox/mobx-state-tree-instead-of-reducer-and-context-snapshots-qvr529?file=%2Fsrc%2FViewModel.ts%3A54%2C31). Open up the console, and store the `timeTravel` variable as a global variable. Log it out after you make some changes, and you'll see a series of snapshots.

Snapshots like this make time travel debugging easy to implement, with very little custom code. It also makes it easy to do things like persistence, re-hydrating state from the server, and other operations where serialized state can be deserialized into something more useful. The following section is a great example of this.

## Persist State Easily with mst-persist

Since MobX-State-Tree state is always serializable and we have utilities like snapshot listeners, libraries like [mst-persist](https://www.npmjs.com/package/mst-persist) are readily available.

With one import and one line of code, we can persist our application state to localStorage:

```
import { persist } from "mst-persist";

persist("ViewModelSingleton", ViewModelSingleton)
```

[Open this CodeSandbox example](https://codesandbox.io/p/sandbox/mobx-state-tree-instead-of-reducer-and-context-persistence-hjmrzg?file=%2Fsrc%2FViewModel.ts%3A70%2C59), make some changes, and then reload it. You'll see your changes have persisted.

React Context can also be persisted to localStorage, but again, it requires you to write the logic from the ground up. If you need this kind of functionality in a large project, the MST community has already taken care of it for you, and we have conventions and maintainers behind the code to do solve your problems.

## MST is State Management on Easy Mode

At this point, we hope the benefits of MobX-State-Tree are clear. If you have a complex application, or if your application is going to become complex over time, MST offers a pre-built set of tools and conventions that will allow you to focus on building features and solving user problems, rather than reinventing the wheel for your state management system.

There are many more MST-specific utilities available, like [data normalization](../concepts/references.md), [JSON patches](../concepts/patches.md), [middleware](../concepts/middleware.md), and libraries like [mst-query](https://github.com/ConrabOpto/mst-query) and [mst-gql](https://github.com/mobxjs/mst-gql) to help you manage asynchronous state. Much like the prior examples in this article, using these tools will save you a lot of work building and maintaining your own bespoke solutions.

If you've been working with React Reducer and Context, MobX-State-Tree will feel like easy-mode for state management. On top of that, you'll join a [welcoming, active community](https://github.com/mobxjs/mobx-state-tree/discussions) where we can help you with state modeling questions, and any learning curve you experience while getting used to MobX-State-Tree.

Questions? Comments? [Let us know in the forum](https://github.com/mobxjs/mobx-state-tree/discussions)
