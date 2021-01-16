import React from "react"
import classnames from "classnames"
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from "../constants/TodoFilters"
import { observer } from "mobx-react-lite"

const FILTER_TITLES = {
    [SHOW_ALL]: "All",
    [SHOW_ACTIVE]: "Active",
    [SHOW_COMPLETED]: "Completed"
}

function Footer({ store }) {
    function renderTodoCount() {
        const { activeCount } = store
        const itemWord = activeCount === 1 ? "item" : "items"

        return (
            <span className="todo-count">
                <strong>{activeCount || "No"}</strong> {itemWord} left
            </span>
        )
    }

    function renderFilterLink(filter) {
        const title = FILTER_TITLES[filter]
        const selectedFilter = store.filter

        return (
            // eslint-disable-next-line
            <a
                className={classnames({ selected: filter === selectedFilter })}
                style={{ cursor: "pointer" }}
                onClick={() => store.setFilter(filter)}
            >
                {title}
            </a>
        )
    }

    function renderClearButton() {
        const { completedCount, clearCompleted } = store
        if (completedCount > 0) {
            return (
                <button className="clear-completed" onClick={() => clearCompleted()}>
                    Clear completed
                </button>
            )
        }
    }

    return (
        <footer className="footer">
            {renderTodoCount()}
            <ul className="filters">
                {[SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED].map((filter) => (
                    <li key={filter}>{renderFilterLink(filter)}</li>
                ))}
            </ul>
            {renderClearButton()}
        </footer>
    )
}

export default observer(Footer)
