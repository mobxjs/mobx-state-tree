import { ADD_TODO, DELETE_TODO, EDIT_TODO, COMPLETE_TODO, COMPLETE_ALL, CLEAR_COMPLETED } from '../constants/ActionTypes'
import { types, destroy } from 'mobx-state-tree'

const Todo = types.model({
    text: 'Learn Redux',
    completed: false,
    id: 0
})

const TodoStore = types.model({
    todos: types.optional(types.array(Todo), []),

    // utilities
    findTodoById: function (id) {
      return this.todos.find(todo => todo.id === id)
    }
  }, {
    // actions
    [ADD_TODO]({text}) {
      const id = this.todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1
      this.todos.unshift({
        id, text
      })
    },
    [DELETE_TODO]({id}) {
      const todo = this.findTodoById(id)
      this.todos.remove(todo)
    },
    [EDIT_TODO]({id, text}) {
      this.findTodoById(id).text = text
    },
    [COMPLETE_TODO]({id}) {
      const todo = this.findTodoById(id)
      todo.completed = !todo.completed
    },
    [COMPLETE_ALL]() {
      const areAllMarked = this.todos.every(todo => todo.completed)
      this.todos.forEach(todo => todo.completed = !areAllMarked)
    },
    [CLEAR_COMPLETED]() {
      this.todos.replace(this.todos.filter(todo => todo.completed === false))
    }
})

export default TodoStore
