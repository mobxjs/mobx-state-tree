import { types, getRoot, destroy } from "mobx-state-tree"
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from "../constants/TodoFilters"

const filterType = types.union(...[SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE].map(types.literal))
const TODO_FILTERS = {
    [SHOW_ALL]: () => true,
    [SHOW_ACTIVE]: (todo) => !todo.completed,
    [SHOW_COMPLETED]: (todo) => todo.completed
}

const Todo = types
    .model({
        text: types.string,
        completed: false,
        id: types.identifierNumber
    })
    .actions((self) => ({
        remove() {
            getRoot(self).removeTodo(self)
        },
        edit(text) {
            if (!text.length) self.remove()
            else self.text = text
        },
        toggle() {
            self.completed = !self.completed
        }
    }))

const TodoStore = types
    .model({
        todos: types.array(Todo),
        filter: types.optional(filterType, SHOW_ALL)
    })
    .views((self) => ({
        get completedCount() {
            return self.todos.filter((todo) => todo.completed).length
        },
        get activeCount() {
            return self.todos.length - self.completedCount
        },
        get filteredTodos() {
            return self.todos.filter(TODO_FILTERS[self.filter])
        }
    }))
    .actions((self) => ({
        addTodo(text) {
            const id = self.todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1
            self.todos.unshift({ id, text })
        },
        removeTodo(todo) {
            destroy(todo)
        },
        completeAll() {
            const areAllMarked = self.todos.every((todo) => todo.completed)
            self.todos.forEach((todo) => (todo.completed = !areAllMarked))
        },
        clearCompleted() {
            self.todos.replace(self.todos.filter((todo) => !todo.completed))
        },
        setFilter(filter) {
            self.filter = filter
        }
    }))

export default TodoStore
