import React from "react"
import Header from "../components/Header"
import MainSection from "../components/MainSection"

const App = ({ store }) => (
    <div>
        <Header addTodo={store.addTodo} />
        <MainSection store={store} />
    </div>
)

export default App
