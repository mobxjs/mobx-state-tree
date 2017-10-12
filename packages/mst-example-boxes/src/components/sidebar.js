import React, { Component } from "react"
import { observer } from "mobx-react"

class Sidebar extends Component {
    render() {
        const { selection } = this.props.store
        return selection ? (
            <div className="sidebar sidebar-open">
                <small>(control click the canvas to create new boxes)</small>
                <hr />
                Caption:
                <input onChange={this.onChange} value={selection.name} />
            </div>
        ) : (
            <div className="sidebar" />
        )
    }

    onChange = e => {
        this.props.store.selection.setName(e.target.value)
    }
}

export default observer(Sidebar)
