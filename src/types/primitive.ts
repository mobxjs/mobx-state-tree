import {IModelFactory} from "../core/factories"
import {invariant, isPrimitive, extend} from "../utils"

export interface IPrimitiveFactory extends IModelFactory<any, any> {
    <T>(value: T): T
}

export const primitiveFactory: IPrimitiveFactory = extend(
    function primitiveFactory(snapshot: any): any {
        // optimization: don't wrap primitive factory in action; it's overkill...
        invariant(isPrimitive(snapshot), `Expected primitive, got '${snapshot}'`)
        return snapshot
    } as IModelFactory<any, any>,
    {
        factoryName: "primitive-factory",
        isModelFactory: true,
        isPrimitiveFactory: true
    }
)
