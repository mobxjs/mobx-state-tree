import { IComplexValue } from "../../core/"
import { IContext, IValidationResult } from "../type-checker"
import { IObjectChange, IObjectWillChange } from "mobx"

export abstract class Property {
    constructor(public name: string) {
        // empty
    }

    initializePrototype(prototype: any) {}
    initialize(targetInstance: IComplexValue, snapshot: any) {}

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        return null
    }

    didChange(change: IObjectChange) {}

    serialize(instance: IComplexValue, snapshot: any) {}
    deserialize(instance: IComplexValue, snapshot: any) {}
    abstract validate(snapshot: any, context: IContext): IValidationResult
}
