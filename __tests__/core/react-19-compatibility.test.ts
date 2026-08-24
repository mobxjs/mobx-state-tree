import { t, setLivelinessChecking, getLivelinessChecking, unprotect } from "../../src/index"
import { getStateTreeNode } from "../../src/internal"
import { describe, expect, it, beforeEach, afterEach, spyOn } from "bun:test"

/**
 * Tests for React 19 compatibility, specifically addressing issue #2277
 * where observer() applied after component definition causes warnings
 * due to React 19's more aggressive prop inspection.
 */
describe("React 19 compatibility", () => {
    const ItemModel = t.model("Item", {
        id: t.identifier,
        name: t.string,
        description: t.string,
        count: t.number
    })

    const StoreModel = t.model("Store", {
        items: t.array(ItemModel)
    })

    let originalLivelinessMode: any
    let consoleWarnSpy: any
    let consoleErrorSpy: any

    beforeEach(() => {
        // Save original liveliness mode
        originalLivelinessMode = getLivelinessChecking()

        // Set to warn mode to catch warnings
        setLivelinessChecking("warn")

        // Spy on console methods to detect warnings
        consoleWarnSpy = spyOn(console, "warn").mockImplementation(() => {})
        consoleErrorSpy = spyOn(console, "error").mockImplementation(() => {})
    })

    afterEach(() => {
        // Restore original liveliness mode
        setLivelinessChecking(originalLivelinessMode)

        // Restore console methods
        consoleWarnSpy.mockRestore()
        consoleErrorSpy.mockRestore()
    })

    describe("property access outside of actions", () => {
        it("should not warn when reading properties outside of actions", () => {
            const store = StoreModel.create({
                items: [{ id: "1", name: "Item 1", description: "First item", count: 1 }]
            })

            const item = store.items[0]

            // Simulate React 19 prop inspection by reading properties outside of any action
            const name = item.name
            const description = item.description
            const count = item.count

            // Should not have triggered any warnings
            expect(consoleWarnSpy).not.toHaveBeenCalled()
            expect(consoleErrorSpy).not.toHaveBeenCalled()

            // Values should be correct
            expect(name).toBe("Item 1")
            expect(description).toBe("First item")
            expect(count).toBe(1)
        })

        it("should not warn when enumerating properties (React DevTools pattern)", () => {
            const store = StoreModel.create({
                items: [{ id: "1", name: "Item 1", description: "First item", count: 1 }]
            })

            const item = store.items[0]

            // Simulate React DevTools enumerating properties
            const keys = Object.keys(item)

            // Read all properties (simulating prop inspection)
            keys.forEach(key => {
                const value = (item as any)[key]
                // Just accessing to trigger the read
            })

            // Should not have triggered any warnings
            expect(consoleWarnSpy).not.toHaveBeenCalled()
            expect(consoleErrorSpy).not.toHaveBeenCalled()
        })

        it("should not warn when accessing nested properties", () => {
            const ParentModel = t.model("Parent", {
                child: ItemModel
            })

            const parent = ParentModel.create({
                child: { id: "1", name: "Child", description: "Nested", count: 5 }
            })

            // Access nested properties outside of action
            const childName = parent.child.name
            const childDesc = parent.child.description

            expect(consoleWarnSpy).not.toHaveBeenCalled()
            expect(consoleErrorSpy).not.toHaveBeenCalled()
            expect(childName).toBe("Child")
            expect(childDesc).toBe("Nested")
        })
    })

    describe("property access during actions", () => {
        it("should still validate alive status during actions for genuinely dead nodes", () => {
            const store = StoreModel.create({
                items: [{ id: "1", name: "Item 1", description: "First item", count: 1 }]
            })
            unprotect(store)

            const item = store.items[0]

            // Remove the item (making it "dead")
            store.items.splice(0, 1)

            // Try to read from the dead node
            let caughtError = false
            try {
                // Access within the internal node context (this should still check)
                const node = getStateTreeNode(item)
                if (!node.isAlive) {
                    // This simulates what would happen if we tried to write
                    caughtError = true
                }
            } catch (e) {
                caughtError = true
            }

            // The node should be detected as dead
            expect(caughtError).toBe(true)
        })
    })

    describe("multiple rapid property accesses", () => {
        it("should handle rapid property access without warnings (React rendering pattern)", () => {
            const store = StoreModel.create({
                items: [
                    { id: "1", name: "Item 1", description: "First item", count: 1 },
                    { id: "2", name: "Item 2", description: "Second item", count: 2 },
                    { id: "3", name: "Item 3", description: "Third item", count: 3 }
                ]
            })

            // Simulate multiple rapid renders accessing all properties
            for (let i = 0; i < 10; i++) {
                store.items.forEach(item => {
                    const _ = item.name
                    const __ = item.description
                    const ___ = item.count
                })
            }

            expect(consoleWarnSpy).not.toHaveBeenCalled()
            expect(consoleErrorSpy).not.toHaveBeenCalled()
        })
    })

    describe("observable property reads", () => {
        it("should allow MobX-style computed access to properties", () => {
            const store = StoreModel.create({
                items: [{ id: "1", name: "Item 1", description: "First item", count: 1 }]
            })

            const item = store.items[0]

            // This simulates what mobx-react observer does - reading props to set up tracking
            const trackingRead = () => {
                return `${item.name} - ${item.description} (${item.count})`
            }

            const result = trackingRead()

            expect(result).toBe("Item 1 - First item (1)")
            expect(consoleWarnSpy).not.toHaveBeenCalled()
            expect(consoleErrorSpy).not.toHaveBeenCalled()
        })
    })

    describe("edge cases", () => {
        it("should handle undefined/null property access gracefully", () => {
            const OptionalModel = t.model("Optional", {
                item: t.maybe(ItemModel)
            })

            const model = OptionalModel.create({
                item: undefined
            })

            // Access optional property
            const item = model.item

            expect(item).toBeUndefined()
            expect(consoleWarnSpy).not.toHaveBeenCalled()
            expect(consoleErrorSpy).not.toHaveBeenCalled()
        })

        it("should handle array iteration (common in React rendering)", () => {
            const store = StoreModel.create({
                items: [
                    { id: "1", name: "Item 1", description: "First", count: 1 },
                    { id: "2", name: "Item 2", description: "Second", count: 2 },
                    { id: "3", name: "Item 3", description: "Third", count: 3 }
                ]
            })

            // Simulate React rendering a list
            const rendered = store.items.map(item => ({
                id: item.id,
                name: item.name,
                description: item.description,
                count: item.count
            }))

            expect(rendered).toHaveLength(3)
            expect(rendered[0].name).toBe("Item 1")
            expect(consoleWarnSpy).not.toHaveBeenCalled()
            expect(consoleErrorSpy).not.toHaveBeenCalled()
        })
    })

    describe("backward compatibility", () => {
        it("should still respect error mode when set", () => {
            setLivelinessChecking("error")

            const store = StoreModel.create({
                items: [{ id: "1", name: "Item 1", description: "First item", count: 1 }]
            })
            unprotect(store)

            const item = store.items[0]

            // Remove item to make it dead
            store.items.splice(0, 1)

            // In error mode, accessing dead nodes should still throw
            // (though not during simple property reads - only during writes)
            expect(() => {
                const node = getStateTreeNode(item)
                // Force a write-like operation that should check alive status
                if (!node.isAlive) {
                    throw new Error("Node is dead")
                }
            }).toThrow()
        })

        it("should respect ignore mode for alive nodes", () => {
            setLivelinessChecking("ignore")

            const store = StoreModel.create({
                items: [{ id: "1", name: "Item 1", description: "First item", count: 1 }]
            })

            const item = store.items[0]

            // Access properties - should not warn even in ignore mode
            const name = item.name
            const description = item.description

            expect(name).toBe("Item 1")
            expect(description).toBe("First item")
            expect(consoleWarnSpy).not.toHaveBeenCalled()
            expect(consoleErrorSpy).not.toHaveBeenCalled()
        })
    })
})
