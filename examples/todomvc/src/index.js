import React from "react"
import { render } from "react-dom"
import App from "./components/App"
import "todomvc-app-css/index.css"
import { connectReduxDevtools } from "mobx-state-tree/middleware/redux"

import TodoStore from "./models/todos"

const store = TodoStore.create({
    todos: [
        {
            text: "learn Mobx",
            completed: false,
            id: 0
        },
        {
            text: "learn MST",
            completed: false,
            id: 1
        }
    ]
})
connectReduxDevtools(require("remotedev"), store)

render(<App store={store} />, document.getElementById("root"))
