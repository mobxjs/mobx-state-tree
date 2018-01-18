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
import { test } from "ava"

test("it should support custom references - basics", t => {
    const User = types.model({
        id: types.identifier(),
        name: types.string
    })

    const UserByNameReference = types.maybe(
        types.reference(User, {
            // given an identifier, find the user
            get(identifier /* string */, parent: any /*Store*/) {
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

    t.is(s.selection!.name, "Mattia")
    t.true(s.selection === s.users[1])
    t.is((getSnapshot(s) as any).selection, "Mattia")

    s.selection = s.users[0]

    t.is(s.selection.name, "Michel")
    t.true(s.selection === s.users[0])
    t.is((getSnapshot(s) as any).selection, "Michel")
    ;(s as any).selection = null
    t.is((getSnapshot(s) as any).selection, null)

    applySnapshot(s, { ...getSnapshot(s), selection: "Mattia" })
    t.is(s.selection, s.users[1])

    applySnapshot(s, { ...getSnapshot(s), selection: "Unknown" })
    t.is(s.selection, null)
})

test("it should support custom references - adv", t => {
    const User = types.model({
        id: types.identifier(),
        name: types.string
    })
    type IUser = typeof User.Type

    const NameReference = types.reference(User, {
        get(identifier: string, parent) {
            if (identifier === null) return null
            return (
                getRoot(parent!)
                    .users.values()
                    .filter(u => u.name === identifier)[0] || null
            )
        },
        set(value: IUser): string {
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

    t.is(s.selection.name, "Mattia")
    t.true(s.selection === s.users.get("2"))
    t.is((getSnapshot(s) as any).selection, "Mattia")

    const p = recordPatches(s)
    const r: any[] = []
    onSnapshot(s, r.push.bind(r))
    const ids: (string | null)[] = []

    reaction(
        () => s.selection,
        selection => {
            ids.push(selection ? selection.id : null)
        }
    )

    s.selection = s.users.get("1")

    t.is(s.selection.name, "Michel")
    t.true(s.selection === s.users.get("1"))
    t.is((getSnapshot(s) as any).selection, "Michel")

    applySnapshot(s, { ...getSnapshot(s), selection: "Mattia" })
    t.is(s.selection, s.users.get("2"))

    applyPatch(s, { op: "replace", path: "/selection", value: "Michel" })
    t.is(s.selection, s.users.get("1"))

    s.users.delete("1")
    t.is(s.selection, null)

    s.users.put({ id: "3", name: "Michel" })
    t.is(s.selection.id, "3")

    t.snapshot(ids)
    t.snapshot(r)
    t.snapshot(p.patches)
    t.snapshot(p.inversePatches)
})

test.cb("it should support dynamic loading", t => {
    const events: string[] = []

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

    t.deepEqual(events, [])
    t.is(s.users.length, 0)
    t.is(s.selection, null)

    when(
        () => s.users.length === 1 && s.users[0].age === 18 && s.users[0].name === "Mattia",
        () => {
            t.is(s.selection, s.users[0])
            t.deepEqual(events, ["loading Mattia", "loaded Mattia"])
            t.end()
        }
    )
})

test("it should allow for custom primitive types", t => {
    class Decimal {
        public number: number
        public fraction: number

        constructor(value: string) {
            const parts = value.split(".")
            this.number = parseInt(parts[0])
            this.fraction = parseInt(parts[1])
        }

        toNumber() {
            return this.number + parseInt("0." + this.fraction)
        }

        toString() {
            return `${this.number}.${this.fraction}`
        }
    }

    const DecimalPrimitive = types.reference<Decimal>(types.string as any, {
        get(value: string) {
            return new Decimal(value)
        },
        set(value: Decimal) {
            return value.toString()
        }
    })

    const Wallet = types.model({ balance: DecimalPrimitive })

    const w1 = Wallet.create({
        balance: new Decimal("2.5")
    })

    t.is(w1.balance.number, 2)
    t.is(w1.balance.fraction, 5)

    const w2 = Wallet.create({ balance: "3.5" })
    t.is(w2.balance.number, 3)
    t.is(w2.balance.fraction, 5)
})
