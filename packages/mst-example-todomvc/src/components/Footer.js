import React, { Component } from "react"
import classnames from "classnames"
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from "../constants/TodoFilters"
import { observer } from "mobx-react"

const FILTER_TITLES = {
    [SHOW_ALL]: "All",
    [SHOW_ACTIVE]: "Active",
    [SHOW_COMPLETED]: "Completed"
}

export default observer(
    class Footer extends Component {
        renderTodoCount() {
            const { activeCount } = this.props.store
            const itemWord = activeCount === 1 ? "item" : "items"

            return (
                <span className="todo-count">
                    <strong>{activeCount || "No"}</strong> {itemWord} left
                </span>
            )
        }

        renderFilterLink(filter) {
            const title = FILTER_TITLES[filter]
            const { store } = this.props
            const selectedFilter = store.filter

            return (
                <a
                    className={classnames({ selected: filter === selectedFilter })}
                    style={{ cursor: "pointer" }}
                    onClick={() => store.setFilter(filter)}
                >
                    {title}
                </a>
            )
        }

        renderClearButton() {
            const { completedCount, clearCompleted } = this.props.store
            if (completedCount > 0) {
                return (
                    <button className="clear-completed" onClick={() => clearCompleted()}>
                        Clear completed
                    </button>
                )
            }
        }

        render() {
            return (
                <footer className="footer">
                    {this.renderTodoCount()}
                    <ul className="filters">
                        {[SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED].map(filter => (
                            <li key={filter}>{this.renderFilterLink(filter)}</li>
                        ))}
                    </ul>
                    {this.renderClearButton()}
                </footer>
            )
        }
    }
)
