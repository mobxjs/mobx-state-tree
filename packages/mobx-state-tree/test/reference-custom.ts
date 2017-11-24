import { reaction } from "mobx"
import {
    types,
    recordPatches,
    getSnapshot,
    applySnapshot,
    applyPatch,
    unprotect,
    getRoot,
    onSnapshot
} from "../src"
import { test } from "ava"

test("it should support custom references", t => {
    debugger
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

    t.snapshot(ids) // N.B. the first `null` is a bug in mobx, but only pops up when not using a proper action wrapper
    t.snapshot(r)
    t.snapshot(p.patches)
    t.snapshot(p.inversePatches)
})
