import { IMSTNode } from "../../core/"
import { IContext, IValidationResult } from "../type-checker"
import { IObjectChange, IObjectWillChange } from "mobx"

export abstract class Property {
    constructor(public name: string) {
        // empty
    }

    initializePrototype(prototype: any) { }
    initialize(targetInstance: IMSTNode, snapshot: any) { }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        return null
    }

    didChange(change: IObjectChange) { }

    serialize(instance: IMSTNode, snapshot: any) { }
    deserialize(instance: IMSTNode, snapshot: any) { }
    abstract validate(snapshot: any, context: IContext): IValidationResult
}
