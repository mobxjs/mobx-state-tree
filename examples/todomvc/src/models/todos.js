import { types, destroy } from "mobx-state-tree"
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from "../constants/TodoFilters"

const filterType = types.union(...[SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE].map(types.literal))
const TODO_FILTERS = {
    [SHOW_ALL]: () => true,
    [SHOW_ACTIVE]: todo => !todo.completed,
    [SHOW_COMPLETED]: todo => todo.completed
}

const Todo = types.model(
    {
        text: types.string,
        completed: false,
        id: types.identifier(types.number)
    },
    {
        remove() {
            destroy(this)
        },
        edit(text) {
            this.text = text
        },
        complete() {
            this.completed = !this.completed
        }
    }
)

const TodoStore = types.model(
    {
        todos: types.array(Todo),
        filter: types.optional(filterType, SHOW_ALL),

        get completedCount() {
            return this.todos.reduce((count, todo) => (todo.completed ? count + 1 : count), 0)
        },
        get activeCount() {
            return this.todos.length - this.completedCount
        },
        get filteredTodos() {
            return this.todos.filter(TODO_FILTERS[this.filter])
        }
    },
    {
        // actions
        addTodo(text) {
            const id = this.todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1
            this.todos.unshift({
                id,
                text
            })
        },
        completeAll() {
            const areAllMarked = this.todos.every(todo => todo.completed)
            this.todos.forEach(todo => (todo.completed = !areAllMarked))
        },
        clearCompleted() {
            this.todos.replace(this.todos.filter(todo => todo.completed === false))
        },
        setFilter(filter) {
            this.filter = filter
        }
    }
)

export default TodoStore
