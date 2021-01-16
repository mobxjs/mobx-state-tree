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
        todo.edit(text)
        setEditing(false)
    }

    return (
        <li
            className={classnames({
                completed: todo.completed,
                editing
            })}
        >
            {editing ? (
                <TodoTextInput
                    text={todo.text}
                    placeholder={todo.text}
                    editing={editing}
                    onSave={(text) => handleSave(todo.id, text)}
                />
            ) : (
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
            )}
        </li>
    )
}
export default observer(TodoItem)
