import React from "react"
import TodoItem from "./TodoItem"
import Footer from "./Footer"
import { observer } from "mobx-react-lite"

function MainSection({ store }) {
    function renderToggleAll() {
        if (store.todos.length > 0) {
            return (
                <span>
                    <input
                        className="toggle-all"
                        id="toggle-all"
                        type="checkbox"
                        checked={store.completedCount === store.todos.length}
                        onChange={() => store.completeAll()}
                    />
                    <label htmlFor="toggle-all">Mark all as complete</label>
                </span>
            )
        }
    }

    function renderFooter(completedCount) {
        if (store.todos.length) {
            return <Footer store={store} />
        }
    }

    const { filteredTodos } = store

    return (
        <section className="main">
            {renderToggleAll()}
            <ul className="todo-list">
                {filteredTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </ul>
            {renderFooter()}
        </section>
    )
}

export default observer(MainSection)
