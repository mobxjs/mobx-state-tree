import { types, getRoot, getSnapshot, IType } from "../src"
import { test } from "ava"
import { when } from "mobx"

const delay = <T>(fn: () => T, n = 1000) => {
    return new Promise<T>((res, rej) => {
        setTimeout(() => res(fn()), n)
    })
}

test("it should load the correct type", t =>
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
    }))

test("lazy real world example", t =>
    new Promise((resolve, reject) => {
        const LoginPage = types.model({
            username: types.string,
            password: types.string,
            get isLoaded() {
                return true
            },
            get isValid() {
                return this.username.length > 0 && this.password.length > 0
            }
        })

        const HomePage = types.model({
            get isLoaded() {
                return true
            }
        })

        const setPageTypeLoaded: any = {}
        const createPageType = (type: string) =>
            types.model({
                type: types.literal(type),
                data: types.lazy(
                    store => getRoot(store).pages.some(page => page.type === type),
                    () =>
                        new Promise<IType<any, any>>((res, rej) => (setPageTypeLoaded[type] = res))
                )
            })

        const RouterPage = types.union(...["home", "login"].map(createPageType))

        const RootStore = types.model(
            "RootStore",
            { pages: types.optional(types.array(RouterPage), []) },
            {
                addPage(type: string, data: any = {}) {
                    this.pages.push({
                        type,
                        data
                    })
                }
            }
        )

        const store = RootStore.create()

        t.deepEqual(getSnapshot(store.pages), [])
        t.is(setPageTypeLoaded["login"], undefined)
        store.addPage("login", {
            username: "",
            password: ""
        })
        t.is(typeof setPageTypeLoaded["login"], "function")
        t.is(store.pages[0].type, "login")
        t.is(store.pages[0].isLoaded, undefined)
        setPageTypeLoaded["login"](LoginPage)

        // after some seconds...
        when(
            () =>
                store.pages &&
                store.pages[0] &&
                store.pages[0].data &&
                store.pages[0].data.isLoaded,
            () => resolve()
        )
        // fail afer 1 second
        delay(() => reject(), 1000)
    }))
