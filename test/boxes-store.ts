/**
 *  Based on examples/boxes/domain-state.js
 */
import { types, getParent, hasParent, recordPatches, IJsonPatch, unprotect, getSnapshot } from "../src"
import { test } from "ava"

export const Box = types.model(
    "Box",
    {
        id: types.identifier(),
        name: "",
        x: 0,
        y: 0,
        get width() {
            return this.name.length * 15
        },
        get isSelected() {
            if (!hasParent(this)) return false
            return getParent(getParent(this)).selection === this
        }
    },
    {
        move(dx, dy) {
            this.x += dx
            this.y += dy
        },
        setName(newName) {
            this.name = newName
        }
    }
)

export const Arrow = types.model("Arrow", {
    id: types.identifier(),
    from: types.reference(Box),
    to: types.reference(Box)
})

export const Store = types.model(
    "Store",
    {
        boxes: types.map(Box),
        arrows: types.array(Arrow),
        selection: types.reference(Box)
    },
    {
        afterCreate() {
            unprotect(this)
        },
        addBox(id, name, x, y) {
            const box = Box.create({ name, x, y, id })
            this.boxes.put(box)
            return box
        },
        addArrow(id, from, to) {
            this.arrows.push(Arrow.create({ id, from, to }))
        },
        setSelection(selection) {
            this.selection = selection
        },
        createBox(id, name, x, y, source, arrowId) {
            const box = this.addBox(id, name, x, y)
            this.setSelection(box)
            if (source) this.addArrow(arrowId, source.id, box.id)
        }
    }
)

function createStore() {
    return Store.create({
        boxes: {
            cc: { id: "cc", name: "Rotterdam", x: 100, y: 100 },
            aa: { id: "aa", name: "Bratislava", x: 650, y: 300 }
        },
        arrows: [{ id: "dd", from: "cc", to: "aa" }],
        selection: "aa"
    })
}

test("store is deserialized correctly", t => {
    const s = createStore()
    t.is(s.boxes.size, 2)
    t.is(s.arrows.length, 1)
    t.true(s.selection === s.boxes.get("aa"))
    t.is(s.arrows[0].from!.name, "Rotterdam")
    t.is(s.arrows[0].to!.name, "Bratislava")
    t.deepEqual(s.boxes.values().map(b => b.isSelected), [false, true])
})

test("store emits correct patch paths", t => {
    const s = createStore()
    const recorder1 = recordPatches(s)
    const recorder2 = recordPatches(s.boxes)
    const recorder3 = recordPatches(s.boxes.get("cc")!)

    s.arrows[0].from!.x += 117
    t.deepEqual(recorder1.patches, [{ op: "replace", path: "/boxes/cc/x", value: 217 } as IJsonPatch])
    t.deepEqual(recorder2.patches, [{ op: "replace", path: "/cc/x", value: 217 } as IJsonPatch])
    t.deepEqual(recorder3.patches, [{ op: "replace", path: "/x", value: 217 } as IJsonPatch])
})

test("box operations works correctly", t => {
    const s = createStore()
    s.createBox("a", "A", 0, 0, null, null)
    s.createBox("b", "B", 100, 100, s.boxes.get("aa"), "aa2b")

    t.deepEqual(getSnapshot(s), {
        boxes: {
            cc: { id: "cc", name: "Rotterdam", x: 100, y: 100 },
            aa: { id: "aa", name: "Bratislava", x: 650, y: 300 },
            a: { id: "a", name: "A", x: 0, y: 0 },
            b: { id: "b", name: "B", x: 100, y: 100 }
        },
        arrows: [{ id: "dd", from: "cc", to: "aa" }, { id: "aa2b", from: "aa", to: "b" }],
        selection: "b"
    })

    s.boxes.get("a")!.setName("I'm groot")

    t.deepEqual(getSnapshot(s), {
        boxes: {
            cc: { id: "cc", name: "Rotterdam", x: 100, y: 100 },
            aa: { id: "aa", name: "Bratislava", x: 650, y: 300 },
            a: { id: "a", name: "I'm groot", x: 0, y: 0 },
            b: { id: "b", name: "B", x: 100, y: 100 }
        },
        arrows: [{ id: "dd", from: "cc", to: "aa" }, { id: "aa2b", from: "aa", to: "b" }],
        selection: "b"
    })

    s.boxes.get("a")!.move(50, 50)

    t.deepEqual(getSnapshot(s), {
        boxes: {
            cc: { id: "cc", name: "Rotterdam", x: 100, y: 100 },
            aa: { id: "aa", name: "Bratislava", x: 650, y: 300 },
            a: { id: "a", name: "I'm groot", x: 50, y: 50 },
            b: { id: "b", name: "B", x: 100, y: 100 }
        },
        arrows: [{ id: "dd", from: "cc", to: "aa" }, { id: "aa2b", from: "aa", to: "b" }],
        selection: "b"
    })

    t.is(s.boxes.get("b")!.width, 15)
    t.is(Box.create({ id: "hello" }).isSelected, false)
})
