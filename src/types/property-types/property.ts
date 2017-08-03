import { IStateTreeNode } from "../../core/"
import { IContext, IValidationResult } from "../type-checker"
import { IObjectChange, IObjectWillChange } from "mobx"

export abstract class Property {
    constructor(public name: string) {
        // empty
    }

    initializePrototype(prototype: any) {}
    initialize(targetInstance: IStateTreeNode, snapshot: any) {}

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        return null
    }

    didChange(change: IObjectChange) {}

    serialize(instance: IStateTreeNode, snapshot: any) {}
    deserialize(instance: IStateTreeNode, snapshot: any) {}
    abstract validate(snapshot: any, context: IContext): IValidationResult
}
