import React, {Component} from 'react';
import {observer} from 'mobx-react';

@observer
class Sidebar extends Component {
    render() {
        const {selection} = this.props.store;
        return selection
            ? <div className="sidebar sidebar-open">
                <input onChange={this.onChange} value={selection.name} />
              </div>
            : <div className="sidebar" />;
    }

    onChange = (e) => {
        this.props.store.selection.setName(e.target.value);
    }
}

export default Sidebar;
