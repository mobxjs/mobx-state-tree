import React, { Component, PropTypes } from "react"
import TodoItem from "./TodoItem"
import Footer from "./Footer"
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from "../constants/TodoFilters"
import { observer } from "mobx-react"

const TODO_FILTERS = {
    [SHOW_ALL]: () => true,
    [SHOW_ACTIVE]: todo => !todo.completed,
    [SHOW_COMPLETED]: todo => todo.completed
}

export default observer(
    class MainSection extends Component {
        static propTypes = {
            store: PropTypes.object.isRequired
        }

        state = { filter: SHOW_ALL }

        handleClearCompleted = () => {
            this.props.store.clearCompleted()
        }

        handleShow = filter => {
            this.setState({ filter })
        }

        renderToggleAll(completedCount) {
            const { store } = this.props
            if (store.todos.length > 0) {
                return (
                    <span>
                        <input
                            className="toggle-all"
                            id="toggle-all"
                            type="checkbox"
                            checked={completedCount === store.todos.length}
                            onChange={() => store.completeAll()}
                        />
                        <label htmlFor="toggle-all">Mark all as complete</label>
                    </span>
                )
            }
        }

        renderFooter(completedCount) {
            const { todos } = this.props.store
            const { filter } = this.state
            const activeCount = todos.length - completedCount

            if (todos.length) {
                return (
                    <Footer
                        completedCount={completedCount}
                        activeCount={activeCount}
                        filter={filter}
                        onClearCompleted={this.handleClearCompleted.bind(this)}
                        onShow={this.handleShow.bind(this)}
                    />
                )
            }
        }

        render() {
            const { todos } = this.props.store
            const { filter } = this.state

            const filteredTodos = todos.filter(TODO_FILTERS[filter])
            const completedCount = todos.reduce((count, todo) => (todo.completed ? count + 1 : count), 0)

            return (
                <section className="main">
                    {this.renderToggleAll(completedCount)}
                    <ul className="todo-list">
                        {filteredTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
                    </ul>
                    {this.renderFooter(completedCount)}
                </section>
            )
        }
    }
)
