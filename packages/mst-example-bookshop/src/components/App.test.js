import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { Provider } from "mobx-react"
import renderer from "react-test-renderer"
import fs from "fs"

import { ShopStore } from "../stores/ShopStore"

const bookFetcher = () => Promise.resolve(JSON.parse(fs.readFileSync("./public/books.json")))

it("matches snapshot before and after loading", done => {
    const shop = ShopStore.create({}, { fetch: bookFetcher })

    const app = renderer.create(
        <Provider shop={shop} history={null}>
            <App />
        </Provider>
    )
    let tree = app.toJSON()
    expect(tree).toMatchSnapshot()

    setTimeout(() => {
        let tree = app.toJSON()
        expect(tree).toMatchSnapshot()
        done()
    }, 100)
})
