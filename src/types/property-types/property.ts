import { IObjectChange, IObjectWillChange } from "mobx"
import { IObjectInstance } from "../object"

export abstract class Property {
    constructor(public name: string) {
        // empty
    }

    initializePrototype(prototype: any) { }
    initialize(targetInstance: IObjectInstance, snapshot: any) { }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        return null
    }

    didChange(change: IObjectChange) { }

    serialize(instance: IObjectInstance, snapshot: any) { }
    deserialize(instance: IObjectInstance, snapshot: any) { }
    abstract isValidSnapshot(snapshot: any): boolean
}
