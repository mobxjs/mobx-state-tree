import { types, tryResolve, resolvePath } from "../src"

if (process.env.NODE_ENV !== "production") {
    test("#275 - Identifiers should check refinement", () => {
        const Model = types
            .model("Model", {
                id: types.refinement(
                    "id",
                    types.string,
                    identifier => identifier.indexOf("Model_") === 0
                )
            })
            .actions(self => ({
                setId(id) {
                    self.id = id
                }
            }))
        const ParentModel = types
            .model("ParentModel", {
                models: types.array(Model)
            })
            .actions(self => ({
                addModel(model) {
                    self.models.push(model)
                }
            }))
        expect(() => {
            ParentModel.create({ models: [{ id: "WrongId_1" }] })
        }).toThrow()
        expect(() => {
            const parentStore = ParentModel.create({ models: [] })
            parentStore.addModel({ id: "WrongId_2" })
        }).toThrow()
        expect(() => {
            const model = Model.create({ id: "Model_1" })
            model.setId("WrongId_3")
        }).toThrow()
        expect(() => {
            Model.create({ id: "WrongId_4" })
        }).toThrow()
    })
}
test("#158 - #88 - Identifiers should accept any string character", () => {
    const Todo = types.model("Todo", {
        id: types.identifier(types.string),
        title: types.string
    })
    expect(() => {
        ;["coffee", "cof$fee", "cof|fee", "cof/fee"].forEach(id => {
            Todo.create({
                id: id,
                title: "Get coffee"
            })
        })
    }).not.toThrow()
})
test("#187 - identifiers should not break late types", () => {
    expect(() => {
        const MstNode = types.model("MstNode", {
            value: types.number,
            next: types.maybe(types.late(() => MstNode))
        })
    }).not.toThrow()
})
if (process.env.NODE_ENV !== "production") {
    test("should throw if multiple identifiers provided", () => {
        expect(() => {
            const Model = types.model("Model", {
                id: types.identifier(types.number),
                pk: types.identifier(types.number)
            })
            Model.create({ id: 1, pk: 2 })
        }).toThrowError(
            `[mobx-state-tree] Cannot define property 'pk' as object identifier, property 'id' is already defined as identifier property`
        )
    })
    test("should throw if identifier of wrong type", () => {
        expect(() => {
            const Model = types.model("Model", { id: types.identifier(types.number) })
            Model.create({ id: "1" } as any)
        }).toThrowError(
            `[mobx-state-tree] Error while converting \`{\"id\":\"1\"}\` to \`Model\`:\n\n    at path \"/id\" value \`\"1\"\` is not assignable to type: \`identifier(number)\` (Value is not a number), expected an instance of \`identifier(number)\` or a snapshot like \`identifier(number)\` instead.`
        )
    })
    test("identifier should be used only on model types - no parent provided", () => {
        expect(() => {
            const Model = types.identifier(types.number)
            Model.create(1)
        }).toThrowError(
            `[mobx-state-tree] Identifier types can only be instantiated as direct child of a model type`
        )
    })
}

{
    const Foo = types.model("Foo", {
        id: types.identifier(),
        name: types.string
    })

    const Bar = types.model("Bar", {
        mimi: types.string,
        fooRef: types.reference(Foo)
    })

    const Root = types.model("Root", {
        foos: types.map(Foo),
        bar: Bar
    })

    const root = Root.create({
        foos: {},
        bar: {
            mimi: "mimi",
            fooRef: "123"
        }
    })
    test("try resolve doesn't work #686", () => {
        expect(tryResolve(root, "/bar/fooRef")).toBe(undefined)

        expect(tryResolve(root, "/bar/fooRef/name")).toBe(undefined)
    })

    test("failing to resolve throws sane errors", () => {
        expect(() => {
            resolvePath(root, "/bar/mimi/oopsie")
        }).toThrow(
            "[mobx-state-tree] Could not resolve 'oopsie' in path '/bar/mimi' while resolving '/bar/mimi/oopsie'"
        )

        expect(() => {
            resolvePath(root, "/zoomba/moomba")
        }).toThrow(
            "[mobx-state-tree] Could not resolve 'zoomba' in path '/' while resolving '/zoomba/moomba'"
        )

        expect(() => resolvePath(root, "/bar/fooRef")).toThrow(
            "[mobx-state-tree] Failed to resolve reference '123' to type 'Foo' (from node: /bar/fooRef)"
        )
        expect(() => resolvePath(root, "/bar/fooRef/name")).toThrow(
            "[mobx-state-tree] Failed to resolve reference '123' to type 'Foo' (from node: /bar/fooRef)"
        )
    })
}

test("it can resolve through refrences", () => {
    const Folder = types.model("Folder", {
        type: types.literal("folder"),
        name: types.identifier(),
        children: types.array(types.late(() => types.union(Folder, SymLink)))
    })
    const SymLink = types.model({
        type: types.literal("link"),
        target: types.reference(Folder)
    })

    const root = Folder.create({
        type: "folder",
        name: "root",
        children: [
            {
                type: "folder",
                name: "a",
                children: []
            },
            {
                type: "folder",
                name: "b",
                children: [
                    {
                        type: "folder",
                        name: "c",
                        children: []
                    }
                ]
            },
            {
                type: "link",
                target: "b"
            },
            {
                type: "link",
                target: "e"
            }
        ]
    })

    expect(resolvePath(root, "/children/1/children/0").name).toBe("c")

    expect(resolvePath(root, "/children/2/target/children/0").name).toBe("c")

    expect(resolvePath(root, "/children/2/target/children/../children/./0").name).toBe("c")

    // double // resets the path to root!
    expect(resolvePath(root, "/children/0//children/2/target/children/../children/./0").name).toBe(
        "c"
    )

    expect(() => resolvePath(root, "/children/3/target/children/0").name).toThrow(
        "[mobx-state-tree] Failed to resolve reference 'e' to type 'Folder' (from node: /children/3/target)"
    )
})
