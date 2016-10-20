import React from 'react'
import { render } from 'react-dom'
import App from './containers/App'
import 'todomvc-app-css/index.css'

import { Provider } from 'react-redux'
import todosFactory from './models/todos'
import { asReduxStore, connectReduxDevtools } from 'mobx-state-tree'

const initialState = {
    todos: [{
        text: 'learn mobx-state-tree',
        completed: false,
        id: 0
    }]
}
const todos = window.todos = todosFactory(initialState)
const store = asReduxStore(todos)
connectReduxDevtools(todos)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
