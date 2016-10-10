import React, {Component} from 'react';
import {observer} from 'mobx-react';

import {generateStuff} from '../stores/domain-state';
import * as history from '../stores/time';

export default observer(() => (<div className="funstuff">
    <button onClick={generateItems} title="generate 500 boxes">!</button>
    <button onClick={previous} title="previous state">&lt;</button>
    <button onClick={next} title="next state">&gt;</button>
</div>));

function generateItems() {
    generateStuff(500);
}

function previous() {
    history.previousState();
}

function next() {
    history.nextState();
}
