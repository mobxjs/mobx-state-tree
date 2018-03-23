import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "mobx-react"
import { observable, reaction } from "mobx"
import {
    onSnapshot,
    onAction,
    onPatch,
    applySnapshot,
    applyAction,
    applyPatch,
    getSnapshot
} from "mobx-state-tree"

import createRouter from "./utils/router"
import App from "./components/App"
import "./index.css"

import { ShopStore } from "./stores/ShopStore"

const fetcher = url => window.fetch(url).then(response => response.json())
const shop = ShopStore.create(
    {},
    {
        fetch: fetcher,
        alert: m => console.log(m) // Noop for demo: window.alert(m)
    }
)

const history = {
    snapshots: observable.array([], { deep: false }),
    actions: observable.array([], { deep: false }),
    patches: observable.array([], { deep: false })
}

/**
 * Rendering
 */
ReactDOM.render(
    <Provider shop={shop} history={history}>
        <App />
    </Provider>,
    document.getElementById("root")
)

/**
 * Routing
 */

reaction(
    () => shop.view.currentUrl,
    path => {
        if (window.location.pathname !== path) window.history.pushState(null, null, path)
    }
)

const router = createRouter({
    "/book/:bookId": ({ bookId }) => shop.view.openBookPageById(bookId),
    "/cart": shop.view.openCartPage,
    "/": shop.view.openBooksPage
})

window.onpopstate = function historyChange(ev) {
    if (ev.type === "popstate") router(window.location.pathname)
}

router(window.location.pathname)

// ---------------

window.shop = shop // for playing around with the console

/**
 * Poor man's effort of "DevTools" to demonstrate the api:
 */

let recording = true // supress recording history when replaying

onSnapshot(
    shop,
    s =>
        recording &&
        history.snapshots.unshift({
            data: s,
            replay() {
                recording = false
                applySnapshot(shop, this.data)
                recording = true
            }
        })
)
onPatch(
    shop,
    s =>
        recording &&
        history.patches.unshift({
            data: s,
            replay() {
                recording = false
                applyPatch(shop, this.data)
                recording = true
            }
        })
)
onAction(
    shop,
    s =>
        recording &&
        history.actions.unshift({
            data: s,
            replay() {
                recording = false
                applyAction(shop, this.data)
                recording = true
            }
        })
)

// add initial snapshot
history.snapshots.push({
    data: getSnapshot(shop),
    replay() {
        // TODO: DRY
        recording = false
        applySnapshot(shop, this.data)
        recording = true
    }
})
