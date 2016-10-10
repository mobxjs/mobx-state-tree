import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import todosFactory from './models/todos'
import 'todomvc-app-css/index.css'
import { asReduxStore } from 'mobx-state-tree'

// Redux devtools support
const devtools = window.__REDUX_DEVTOOLS_EXTENSION__
const logger = api => next => action => {
    const result = next(action)
    if (devtools)
        devtools.send(action, store.getState())
    return result
}


const initialState = {
    todos: [{
        text: 'learn mobx-state-tree',
        completed: false,
        id: 0
    }]
}
const todos = todosFactory(initialState)
const store = asReduxStore(todos, logger)

if (devtools)
    devtools.send("@@INIT", store.getState())

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
