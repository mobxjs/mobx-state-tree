import { when } from "mobx"
import { getRoot, types } from "../../src"

interface IRootModel {
    shouldLoad: boolean
}

test("it should load the correct type", async () => {
    const LazyModel = types
        .model("LazyModel", {
            width: types.number,
            height: types.number
        })
        .views({
            get area() {
                return this.height * this.width
            }
        })

    const Root = types
        .model("Root", {
            shouldLoad: types.optional(types.boolean, false),
            lazyModel: types.lazy<typeof LazyModel, IRootModel>("lazy", {
                loadType: () => Promise.resolve(LazyModel),
                shouldLoadPredicate: (parent) => parent.shouldLoad == true
            })
        })
        .actions({
            load: function () {
                this.shouldLoad = true
            }
        })

    const store = Root.create({
        lazyModel: {
            width: 3,
            height: 2
        }
    })

    expect(store.lazyModel.width).toBe(3)
    expect(store.lazyModel.height).toBe(2)
    expect(store.lazyModel.area).toBeUndefined()
    store.load()
    const promise = new Promise<number>((resolve, reject) => {
        when(
            () => store.lazyModel && store.lazyModel.area !== undefined,
            () => resolve(store.lazyModel.area)
        )

        setTimeout(reject, 2000)
    })

    await expect(promise).resolves.toBe(6)
})

test("maintains the tree structure when loaded", async () => {
    const LazyModel = types
        .model("LazyModel", {
            width: types.number,
            height: types.number
        })
        .views({
            get area() {
                const root = getRoot<{ rootValue: number }>(this)
                return this.height * this.width * root.rootValue
            }
        })

    const Root = types
        .model("Root", {
            shouldLoad: types.optional(types.boolean, false),
            lazyModel: types.lazy<typeof LazyModel, IRootModel>("lazy", {
                loadType: () => Promise.resolve(LazyModel),
                shouldLoadPredicate: (parent) => parent.shouldLoad == true
            })
        })
        .views(() => ({
            get rootValue() {
                return 5
            }
        }))
        .actions({
            load: function () {
                this.shouldLoad = true
            }
        })

    const store = Root.create({
        lazyModel: {
            width: 3,
            height: 2
        }
    })

    expect(store.lazyModel.width).toBe(3)
    expect(store.lazyModel.height).toBe(2)
    expect(store.rootValue).toEqual(5)
    expect(store.lazyModel.area).toBeUndefined()
    store.load()
    const promise = new Promise<number>((resolve, reject) => {
        when(
            () => store.lazyModel && store.lazyModel.area !== undefined,
            () => resolve(store.lazyModel.area)
        )

        setTimeout(reject, 2000)
    })

    await expect(promise).resolves.toBe(30)
})
