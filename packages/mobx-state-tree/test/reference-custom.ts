import { reaction, when } from "mobx"
import {
    types,
    recordPatches,
    getSnapshot,
    applySnapshot,
    applyPatch,
    unprotect,
    getRoot,
    onSnapshot,
    flow
} from "../src"
test("it should support custom references - basics", () => {
    const User = types.model({
        id: types.identifier(),
        name: types.string
    })
    const UserByNameReference = types.maybe(
        types.reference(User, {
            // given an identifier, find the user
            get(identifier /* string */, parent: typeof Store.Type /*Store*/) {
                return parent.users.find(u => u.name === identifier) || null
            },
            // given a user, produce the identifier that should be stored
            set(value /* User */) {
                return value.name
            }
        })
    )
    const Store = types.model({
        users: types.array(User),
        selection: UserByNameReference
    })
    const s = Store.create({
        users: [{ id: "1", name: "Michel" }, { id: "2", name: "Mattia" }],
        selection: "Mattia"
    })
    unprotect(s)
    expect(s.selection.name).toBe("Mattia")
    expect(s.selection === s.users[1]).toBe(true)
    expect(getSnapshot(s).selection).toBe("Mattia")
    s.selection = s.users[0]
    expect(s.selection.name).toBe("Michel")
    expect(s.selection === s.users[0]).toBe(true)
    expect(getSnapshot(s).selection).toBe("Michel")
    s.selection = null
    expect(getSnapshot(s).selection).toBe(null)
    applySnapshot(s, Object.assign({}, getSnapshot(s), { selection: "Mattia" }))
    expect(s.selection).toBe(s.users[1])
    applySnapshot(s, Object.assign({}, getSnapshot(s), { selection: "Unknown" }))
    expect(s.selection).toBe(null)
})
test("it should support custom references - adv", () => {
    const User = types.model({
        id: types.identifier(),
        name: types.string
    })
    const NameReference = types.reference(User, {
        get(identifier, parent: any) {
            if (identifier === null) return null
            return (
                getRoot(parent)
                    .users.values()
                    .filter(u => u.name === identifier)[0] || null
            )
        },
        set(value) {
            return value ? value.name : ""
        }
    })
    const Store = types.model({
        users: types.map(User),
        selection: NameReference
    })
    const s = Store.create({
        users: {
            "1": { id: "1", name: "Michel" },
            "2": { id: "2", name: "Mattia" }
        },
        selection: "Mattia"
    })
    unprotect(s)
    expect(s.selection.name).toBe("Mattia")
    expect(s.selection === s.users.get("2")).toBe(true)
    expect(getSnapshot<typeof Store.SnapshotType>(s).selection).toBe("Mattia")
    const p = recordPatches(s)
    const r = []
    onSnapshot(s, r.push.bind(r))
    const ids: any[] = []
    reaction(
        () => s.selection,
        selection => {
            ids.push(selection ? selection.id : null)
        }
    )
    s.selection = s.users.get("1")!
    expect(s.selection.name).toBe("Michel")
    expect(s.selection === s.users.get("1")).toBe(true)
    expect(getSnapshot<any>(s).selection).toBe("Michel")
    applySnapshot(s, Object.assign({}, getSnapshot(s), { selection: "Mattia" }))
    expect(s.selection).toBe(s.users.get("2"))
    applyPatch(s, { op: "replace", path: "/selection", value: "Michel" })
    expect(s.selection).toBe(s.users.get("1"))
    s.users.delete("1")
    expect(s.selection).toBe(null)
    s.users.put({ id: "3", name: "Michel" })
    expect(s.selection.id).toBe("3")
    expect(ids).toMatchSnapshot()
    expect(r).toMatchSnapshot()
    expect(p.patches).toMatchSnapshot()
    expect(p.inversePatches).toMatchSnapshot()
})
test("it should support dynamic loading", done => {
    const events: any[] = []
    const User = types.model({
        name: types.string,
        age: 0
    })
    const UserByNameReference = types.maybe(
        types.reference(User, {
            get(identifier /* string */, parent: any /*Store*/) {
                return parent.getOrLoadUser(identifier)
            },
            set(value /* User */) {
                return value.name
            }
        })
    )
    const Store = types
        .model({
            users: types.array(User),
            selection: UserByNameReference
        })
        .actions(self => ({
            loadUser: flow(function* loadUser(name) {
                events.push("loading " + name)
                self.users.push({ name } as any)
                yield new Promise(resolve => {
                    setTimeout(resolve, 200)
                })
                events.push("loaded " + name)
                const user = (self.users.find(u => u.name === name).age = name.length * 3) // wonderful!
            })
        }))
        .views(self => ({
            // Important: a view so that the reference will automatically react to the reference being changed!
            getOrLoadUser(name) {
                const user = self.users.find(u => u.name === name) || null
                if (!user) {
                    /*
                    TODO: this is ugly, but workaround the idea that views should be side effect free.
                    We need a more elegant solution..
                */
                    setImmediate(() => self.loadUser(name))
                }
                return user
            }
        }))
    const s = Store.create({
        users: [],
        selection: "Mattia"
    })
    unprotect(s)
    expect(events).toEqual([])
    expect(s.users.length).toBe(0)
    expect(s.selection).toBe(null)
    when(
        () => s.users.length === 1 && s.users[0].age === 18 && s.users[0].name === "Mattia",
        () => {
            expect(s.selection).toBe(s.users[0])
            expect(events).toEqual(["loading Mattia", "loaded Mattia"])
            done()
        }
    )
})
