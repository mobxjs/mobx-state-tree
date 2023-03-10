import React, { Component } from "react"
import { values } from "mobx"
import { observer } from "mobx-react"

import BoxView from "./box-view"
import ArrowView from "./arrow-view"
import Sidebar from "./sidebar"
import FunStuff from "./fun-stuff"

class Canvas extends Component {
    render() {
        const { store } = this.props
        return (
            <div className="app">
                <div className="canvas" onClick={this.onCanvasClick}>
                    <svg>
                        {store.arrows.map((arrow) => (
                            <ArrowView arrow={arrow} key={arrow.id} />
                        ))}
                    </svg>
                    {values(store.boxes).map((box) => (
                        <BoxView box={box} store={store} key={box.id} />
                    ))}
                </div>
                <Sidebar store={store} />
                <FunStuff />
            </div>
        )
    }

    onCanvasClick = (e) => {
        const { store } = this.props
        if (e.ctrlKey === false) {
            store.setSelection(null)
        } else {
            store.createBox("Hi.", e.clientX - 50, e.clientY - 20, store.selection)
        }
    }
}

export default observer(Canvas)
