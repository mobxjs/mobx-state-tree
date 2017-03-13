import { IObjectChange, IObjectWillChange } from "mobx"
import { IObjectInstance } from "../object"

export abstract class Property {
    constructor(public name: string) {
        // empty
    }

    initializePrototype(prototype: any) { }
    initialize(targetInstance: IObjectInstance) { }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        return null
    }

    didChange(change: IObjectChange) { }

    serialize(instance: IObjectInstance, snapshot) { }
    deserialize(instance: IObjectInstance, snapshot) { }
    abstract isValidSnapshot(snapshot): boolean
}
