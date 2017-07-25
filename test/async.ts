import {
    unprotect,
    types,
    addMiddleware
    // TODO: export IRawActionCall
} from "../src"
import { test } from "ava"
import { reaction } from "mobx"

function delay<T>(time: number, value: T, shouldThrow = false): Promise<T> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldThrow) reject(value)
            else resolve(value)
        }, time)
    })
}

test.cb("can handle async actions", t => {
    const Todo = types.model(
        {
            title: "get coffee"
        },
        {
            *fetchData(kind: string) {
                this.title = "getting coffee " + kind
                this.title = yield delay(100, "drinking coffee")
                return "awake"
            }
        }
    )

    const events: any[] = []
    const coffees: string[] = []
    const t1 = Todo.create({})
    unprotect(t1)

    addMiddleware(t1, (c, next) => {
        events.push(c)
        return next(c)
    })

    reaction(() => t1.title, coffee => coffees.push(coffee))

    debugger
    t1.fetchData("black").then((res: string) => {
        t.deepEqual(coffees, ["getting coffee black", "drinking coffee"])
        // TODO: deep equal events
        t.end()
    })
})
