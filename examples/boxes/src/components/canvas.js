import React, {Component} from 'react';
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import {randomUuid} from '../utils';

import BoxView from './box-view';
import ArrowView from './arrow-view';
import Sidebar from './sidebar';
import FunStuff from './fun-stuff';

@observer
class Canvas extends Component {
    render() {
        const {store} = this.props;
        return (
            <div className="app">
                <div className="canvas"
                    onClick={this.onCanvasClick}
                >
                    <svg>
                        { store.arrows.map(arrow =>
                            <ArrowView arrow={arrow} key={arrow.id} />
                        ) }
                    </svg>
                    { store.boxes.values().map(box =>
                        <BoxView box={box} store={store} key={box.id} />
                    ) }
                </div>
                {/* temporarily disabled for demo to save screen real estate <Sidebar store={store} /> */}
                <FunStuff />
                <DevTools />
            </div>
        )
    }

    onCanvasClick = (e) => {
        const {store} = this.props;
        if (e.ctrlKey === false) {
            store.setSelection(null);
        } else {
            store.createNewBox('Hi.', e.clientX - 50, e.clientY - 20, store.selection);
        }
    }
}

export default Canvas;
