import React from "react"
import { render } from "react-dom"
import App from "./containers/App"
import "todomvc-app-css/index.css"

import { Provider } from "react-redux"
import todosFactory from "./models/todos"
import { asReduxStore, connectReduxDevtools } from "mst-middlewares"

const initialState = {
    todos: [
        {
            text: "learn Redux",
            completed: false,
            id: 0
        }
    ]
}
const todos = (window.todos = todosFactory.create(initialState))
const store = asReduxStore(todos)
connectReduxDevtools(require("remotedev"), todos)

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
)
