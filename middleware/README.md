# Prebuilt middlewares

The MST package ships with some prebuilt middlewares, which serves mainly as examples on how to write your own middleware.
The source of each middleware can be found in this github directory, you are encouraged to read them!

The middlewares are bundled separately to keep the core package small, and can be included using:


```
import MiddleWarename from "mobx-state-tree/middleware/middlewarename"
```

The middlewares serve as example and are supported on a best effort bases. The goal of these middlewares is that if they are critical to your system, you can simply copy paste them and further tailor them towards your specific needs.

For the exact description of all middleware events offered by MST, see the [api docs](../middleware.md)

# Contributing

Feel free to contribute to these middlewares and improve them on your experience.
The middlewares must be written in valid ES5. `.spec` files will be run automatically and individually and needs to be written in ES5-ish as well.

---

# simple-action-logger

This is the most basic of middlewares: It logs all _direct_ action invocations. Example:

```
import logger from "mobx-state-tree/middleware/simple-action-logger"

// .. type definitions ...

const store = Store.create({
    todos: [{ title: "test " }]
})

mst.addMiddleware(store, logger)

store.todos[0].setTitle("hello world")

// Prints:
[MST action call] /todos/0/setTitle
```

For a more sophisticated logger, see [process-logger](#process-logger) which also logs process invocations and continuations