import { when } from "mobx"
import { types } from "../../src"

test("it should load the correct type", async () => {
    const LazyModel = types
        .model("LazyModel", {
            width: types.number,
            height: types.number
        })
        .views((self) => ({
            get area() {
                return self.height * self.width
            }
        }))

    const TestModel = types
        .model("TestModel", {
            shouldLoad: types.optional(types.boolean, false),
            lazyModel: types.lazy<typeof LazyModel>("lazy", {
                // @ts-ignore todo fix this type issue
                loadType: () => Promise.resolve(LazyModel),
                shouldLoadPredicate: (self) => self.shouldLoad == true
            })
        })
        .actions((self) => ({
            load: () => {
                self.shouldLoad = true
            }
        }))

    const store = TestModel.create({
        lazyModel: {
            width: 3,
            height: 2
        }
    })

    expect(store.lazyModel.width).toBe(3)
    expect(store.lazyModel.height).toBe(2)
    expect(store.lazyModel.area).toBeUndefined()
    store.load()
    const promise = new Promise<void>((resolve, reject) => {
        when(
            () => store.lazyModel && store.lazyModel.area,
            () => resolve(store.lazyModel.area)
        )

        setTimeout(reject, 2000)
    })

    await expect(promise).resolves.toBe(6)
})
