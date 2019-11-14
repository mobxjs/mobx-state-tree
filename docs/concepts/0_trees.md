### Trees, types and state

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
Other built-in types include arrays, maps, primitives, etc. See the [types overview](#types-overview).
The type information will be used for both.
