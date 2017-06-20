import { types, destroy } from "mobx-state-tree"

const Todo = types.model(
    {
        text: "Learn Redux",
        completed: false,
        id: 0
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
        todos: types.array(Todo)
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
        }
    }
)

export default TodoStore
