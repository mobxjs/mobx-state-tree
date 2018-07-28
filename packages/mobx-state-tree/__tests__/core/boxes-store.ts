/**
 *  Based on examples/boxes/domain-state.js
 */
import { values } from "mobx"
import { types, getParent, hasParent, recordPatches, unprotect, getSnapshot } from "../../src"

export const Box = types
    .model("Box", {
        id: types.identifier,
        name: "",
        x: 0,
        y: 0
    })
    .views(self => ({
        get width() {
            return self.name.length * 15
        },
        get isSelected() {
            if (!hasParent(self)) return false
            return getParent(getParent(self)).selection === self
        }
    }))
    .actions(self => {
        function move(dx: number, dy: number) {
            self.x += dx
            self.y += dy
        }
        function setName(newName: string) {
            self.name = newName
        }
        return {
            move,
            setName
        }
    })
export const Arrow = types.model("Arrow", {
    id: types.identifier,
    from: types.reference(Box),
    to: types.reference(Box)
})
export const Store = types
    .model("Store", {
        boxes: types.map(Box),
        arrows: types.array(Arrow),
        selection: types.reference(Box)
    })
    .actions(self => {
        function afterCreate() {
            unprotect(self)
        }
        function addBox(id: string, name: string, x: number, y: number) {
            const box = Box.create({ name, x, y, id })
            self.boxes.put(box)
            return box
        }
        function addArrow(id: string, from: string, to: string) {
            self.arrows.push(Arrow.create({ id, from, to }))
        }
        function setSelection(selection: typeof Box.Type) {
            self.selection = selection
        }
        function createBox(
            id: string,
            name: string,
            x: number,
            y: number,
            source: typeof Box.Type | null | undefined,
            arrowId: string | null
        ) {
            const box = addBox(id, name, x, y)
            setSelection(box)
            if (source) addArrow(arrowId!, source.id, box.id)
        }
        return {
            afterCreate,
            addBox,
            addArrow,
            setSelection,
            createBox
        }
    })
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
test("store is deserialized correctly", () => {
    const s = createStore()
    expect(s.boxes.size).toBe(2)
    expect(s.arrows.length).toBe(1)
    expect(s.selection === s.boxes.get("aa")).toBe(true)
    expect(s.arrows[0].from.name).toBe("Rotterdam")
    expect(s.arrows[0].to.name).toBe("Bratislava")
    expect(values(s.boxes).map((b: any) => b.isSelected)).toEqual([false, true])
})
test("store emits correct patch paths", () => {
    const s = createStore()
    const recorder1 = recordPatches(s)
    const recorder2 = recordPatches(s.boxes)
    const recorder3 = recordPatches(s.boxes.get("cc")!)
    s.arrows[0].from.x += 117
    expect(recorder1.patches).toEqual([{ op: "replace", path: "/boxes/cc/x", value: 217 }])
    expect(recorder2.patches).toEqual([{ op: "replace", path: "/cc/x", value: 217 }])
    expect(recorder3.patches).toEqual([{ op: "replace", path: "/x", value: 217 }])
})
test("box operations works correctly", () => {
    const s = createStore()
    s.createBox("a", "A", 0, 0, null, null)
    s.createBox("b", "B", 100, 100, s.boxes.get("aa"), "aa2b")
    expect(getSnapshot(s)).toEqual({
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
    expect(getSnapshot(s)).toEqual({
        boxes: {
            cc: { id: "cc", name: "Rotterdam", x: 100, y: 100 },
            aa: { id: "aa", name: "Bratislava", x: 650, y: 300 },
            a: { id: "a", name: "I'm groot", x: 0, y: 0 },
            b: { id: "b", name: "B", x: 100, y: 100 }
        },
        arrows: [{ id: "dd", from: "cc", to: "aa" }, { id: "aa2b", from: "aa", to: "b" }],
        selection: "b"
    })
    expect(JSON.stringify(s)).toEqual(JSON.stringify(getSnapshot(s)))
    s.boxes.get("a")!.move(50, 50)
    expect(getSnapshot(s)).toEqual({
        boxes: {
            cc: { id: "cc", name: "Rotterdam", x: 100, y: 100 },
            aa: { id: "aa", name: "Bratislava", x: 650, y: 300 },
            a: { id: "a", name: "I'm groot", x: 50, y: 50 },
            b: { id: "b", name: "B", x: 100, y: 100 }
        },
        arrows: [{ id: "dd", from: "cc", to: "aa" }, { id: "aa2b", from: "aa", to: "b" }],
        selection: "b"
    })
    expect(s.boxes.get("b")!.width).toBe(15)
    expect(Box.create({ id: "hello" }).isSelected).toBe(false)
})
