import React, { Component } from "react"
import TodoItem from "./TodoItem"
import Footer from "./Footer"
import { observer } from "mobx-react"

export default observer(
    class MainSection extends Component {
        handleClearCompleted = () => {
            this.props.store.clearCompleted()
        }

        renderToggleAll() {
            const { store } = this.props
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

        renderFooter(completedCount) {
            const { store } = this.props

            if (store.todos.length) {
                return <Footer store={store} />
            }
        }

        render() {
            const { filteredTodos } = this.props.store

            return (
                <section className="main">
                    {this.renderToggleAll()}
                    <ul className="todo-list">
                        {filteredTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
                    </ul>
                    {this.renderFooter()}
                </section>
            )
        }
    }
)
