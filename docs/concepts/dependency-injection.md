
## Dependency injection

When creating a new state tree it is possible to pass in environment specific data by passing an object as the second argument to a `.create` call.
This object should be (shallowly) immutable and can be accessed by any model in the tree by calling `getEnv(self)`.

This is useful to inject environment or test-specific utilities like a transport layer, loggers, etc. This is also very useful to mock behavior in unit tests or provide instantiated utilities to models without requiring singleton modules.
See also the [bookshop example](https://github.com/mobxjs/mobx-state-tree/blob/a4f25de0c88acf0e239acb85e690e91147a8f0f0/examples/bookshop/src/stores/ShopStore.test.js#L9) for inspiration.

```javascript
import { types, getEnv } from "mobx-state-tree"

const Todo = types
    .model({
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

const store = Store.create(
    {
        todos: [{ title: "Grab tea" }]
    },
    {
        logger: logger // inject logger to the tree
    }
)

store.todos[0].setTitle("Grab coffee")
// prints: Changed title to: Grab coffee
```
