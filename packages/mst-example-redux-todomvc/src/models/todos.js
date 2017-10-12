import {
    ADD_TODO,
    DELETE_TODO,
    EDIT_TODO,
    COMPLETE_TODO,
    COMPLETE_ALL,
    CLEAR_COMPLETED
} from "../constants/ActionTypes"
import { types } from "mobx-state-tree"

const Todo = types.model({
    text: "Learn Redux",
    completed: false,
    id: 0
})

const TodoStore = types
    .model({
        todos: types.optional(types.array(Todo), [])
    })
    .views(self => ({
        // utilities
        findTodoById: function(id) {
            return self.todos.find(todo => todo.id === id)
        }
    }))
    .actions(self => ({
        // actions
        [ADD_TODO]({ text }) {
            const id = self.todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1
            self.todos.unshift({
                id,
                text
            })
        },
        [DELETE_TODO]({ id }) {
            const todo = self.findTodoById(id)
            self.todos.remove(todo)
        },
        [EDIT_TODO]({ id, text }) {
            self.findTodoById(id).text = text
        },
        [COMPLETE_TODO]({ id }) {
            const todo = self.findTodoById(id)
            todo.completed = !todo.completed
        },
        [COMPLETE_ALL]() {
            const areAllMarked = self.todos.every(todo => todo.completed)
            self.todos.forEach(todo => (todo.completed = !areAllMarked))
        },
        [CLEAR_COMPLETED]() {
            self.todos.replace(self.todos.filter(todo => todo.completed === false))
        }
    }))

export default TodoStore
