

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
