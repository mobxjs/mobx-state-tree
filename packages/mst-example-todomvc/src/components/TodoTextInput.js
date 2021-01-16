import React, { useState } from "react"
import classnames from "classnames"

function TodoTextInput({ text, onSave, newTodo, editing, placeholder }) {
    const [editingText, setEditingText] = useState(text)

    const handleSubmit = (e) => {
        const text = e.target.value.trim()
        if (e.key === "Enter") {
            onSave(text)
            if (newTodo) {
                setEditingText("")
            }
        }
    }

    const handleChange = (e) => {
        setEditingText(e.target.value)
    }

    const handleBlur = (e) => {
        if (!newTodo) {
            onSave(e.target.value)
        }
    }

    return (
        <input
            className={classnames({
                edit: editing,
                "new-todo": newTodo
            })}
            type="text"
            placeholder={placeholder}
            autoFocus={true}
            value={editingText}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleSubmit}
        />
    )
}

export default TodoTextInput
