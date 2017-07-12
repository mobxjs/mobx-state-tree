import { types, getRoot } from "../src"
import { test } from "ava"
import { when } from "mobx"

const delay = <T>(fn: () => T, n = 1000) => {
    return new Promise<T>((res, rej) => {
        setTimeout(() => res(fn()), n)
    })
}

test.only(
    "it should load the correct type",
    t =>
        new Promise((resolve, reject) => {
            let setType: (value: any) => void = () => 1

            const LazyModel = types.model("LazyModel", {
                width: types.number,
                height: types.number,
                get area() {
                    return this.height * this.width
                }
            })

            const Model = types.model(
                "Model",
                {
                    shouldLoad: types.optional(types.boolean, false),
                    lazy: types.lazy(
                        model => model.shouldLoad,
                        () => new Promise((res, rej) => (setType = res))
                    )
                },
                {
                    setLoaded() {
                        this.shouldLoad = true
                    }
                }
            )

            const store = Model.create({
                lazy: {
                    width: 3,
                    height: 2
                }
            })

            t.is(store.lazy.area, undefined)
            store.setLoaded()
            t.is(store.lazy.area, undefined)
            setType(LazyModel)
            // after some seconds...
            when(() => store.lazy && store.lazy.area && store.lazy.area === 6, () => resolve())
            // fail afer 1 second
            delay(() => reject(), 1000)
        })
)
