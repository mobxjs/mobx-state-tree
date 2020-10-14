import React, { useState } from "react"
import classnames from "classnames"
import TodoTextInput from "./TodoTextInput"
import { observer } from "mobx-react-lite"

function TodoItem({ todo }) {
    const [editing, setEditing] = useState(false)

    const handleDoubleClick = () => {
        setEditing(true)
    }

    const handleSave = (id, text) => {
        if (text.length === 0) {
            todo.remove()
        } else {
            todo.edit(text)
        }
        setEditing(false)
    }

    let element
    if (editing) {
        element = (
            <TodoTextInput
                text={todo.text}
                placeholder={todo.text}
                editing={editing}
                onSave={(text) => handleSave(todo.id, text)}
            />
        )
    } else {
        element = (
            <div className="view">
                <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => todo.toggle()}
                />
                <label onDoubleClick={handleDoubleClick}>{todo.text}</label>
                <button className="destroy" onClick={() => todo.remove()} />
            </div>
        )
    }

    return (
        <li
            className={classnames({
                completed: todo.completed,
                editing
            })}
        >
            {element}
        </li>
    )
}
export default observer(TodoItem)
