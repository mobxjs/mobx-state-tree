import { ADD_TODO, DELETE_TODO, EDIT_TODO, COMPLETE_TODO, COMPLETE_ALL, CLEAR_COMPLETED } from '../constants/ActionTypes'
import { action } from 'mobx'
import { createFactory, arrayOf } from 'mobx-state-tree'

export const todoFactory = createFactory({
    text: 'Use mobx-state-tree',
    completed: false,
    id: 0
})

export default createFactory({
  todos: arrayOf(todoFactory),

  // utilities
  findTodoById: function (id) {
    return this.todos.find(todo => todo.id === id)
  },

  // actions
  [ADD_TODO]: action(function ({text}) {
    const id = this.todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1
    this.todos.push({
      id, text
    })
  }),
  [DELETE_TODO]: action(function ({id}) {
    this.todos.remove(this.findTodoById(id))
  }),
  [EDIT_TODO]: action(function ({id, text}) {
    this.findTodoById(id).text = text
  }),
  [COMPLETE_TODO]: action(function ({id}) {
    const todo = this.findTodoById(id)
    todo.completed = !todo.completed
  }),
  [COMPLETE_ALL]: action(function () {
    const areAllMarked = this.todos.every(todo => todo.completed)
    this.todos.forEach(todo => todo.completed = !areAllMarked)
  }),
  [CLEAR_COMPLETED]: action(function () {
    this.todos.replace(this.todos.filter(todo => todo.completed === false))
  })
})
