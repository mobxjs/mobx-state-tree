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

// test("it should load the correct type", () =>
//     new Promise<void>((resolve, reject) => {
//         let setType: (value: any) => void = () => 1

//         const LazyModel = types
//             .model("LazyModel", {
//                 width: types.number,
//                 height: types.number
//             })
//             .views((self) => ({
//                 get area() {
//                     return self.height * self.width
//                 }
//             }))

//         const Model = types
//             .model("Model", {
//                 shouldLoad: types.optional(types.boolean, false),
//                 lazy: types.lazy<typeof, >(
//                     (model) => model.shouldLoad,
//                     () => new Promise((res, rej) => (setType = res))
//                 )
//             })
//             .actions((self) => ({
//                 setLoaded: function () {
//                     self.shouldLoad = true
//                 }
//             }))

//         const store = Model.create({
//             lazy: {
//                 width: 3,
//                 height: 2
//             }
//         })

//         expect(store.lazy.area).toBeUndefined()
//         store.setLoaded()
//         expect(store.lazy.area).toBeUndefined()
//         setType(LazyModel)
//         // after some seconds...
//         when(
//             () => store.lazy && store.lazy.area && store.lazy.area === 6,
//             () => resolve()
//         )
//         // fail afer 1 second
//         delay(() => reject(), 1000)
//     }))

// test("lazy real world example", () =>
//     new Promise<void>((resolve, reject) => {
//         const LoginPage = types
//             .model({
//                 username: types.string,
//                 password: types.string
//             })
//             .views((self) => ({
//                 get isLoaded() {
//                     return true
//                 },
//                 get isValid() {
//                     return self.username.length > 0 && self.password.length > 0
//                 }
//             }))

//         const HomePage = types.model({}).views(() => ({
//             get isLoaded() {
//                 return true
//             }
//         }))

//         const setPageTypeLoaded: any = {}
//         const createPageType = (type: string) =>
//             types.model({
//                 type: types.literal(type),
//                 data: types.lazy(
//                     (store) => getRoot(store).pages.some((page) => page.type === type),
//                     () =>
//                         new Promise<IType<any, any, any>>(
//                             (res, rej) => (setPageTypeLoaded[type] = res)
//                         )
//                 )
//             })

//         const RouterPage = types.union(...["home", "login"].map(createPageType))

//         const RootStore = types
//             .model("RootStore", { pages: types.optional(types.array(RouterPage), []) })
//             .actions((self) => ({
//                 addPage(type: string, data: any = {}) {
//                     self.pages.push({
//                         type,
//                         data
//                     })
//                 }
//             }))

//         const store = RootStore.create()

//         expect(getSnapshot(store.pages)).toEqual([])
//         expect(setPageTypeLoaded["login"]).toBeUndefined()

//         store.addPage("login", {
//             username: "",
//             password: ""
//         })

//         expect(typeof setPageTypeLoaded["login"]).toEqual("function")
//         expect(store.pages[0].type).toEqual("login")
//         expect(store.pages[0].isLoaded).toEqual(undefined)

//         setPageTypeLoaded["login"](LoginPage)

//         // after some seconds...
//         when(
//             () =>
//                 store.pages &&
//                 store.pages[0] &&
//                 store.pages[0].data &&
//                 store.pages[0].data.isLoaded,
//             () => resolve()
//         )
//         // fail afer 1 second
//         delay(() => reject(), 1000)
//     }))
