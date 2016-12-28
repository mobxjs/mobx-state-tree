import {ModelFactory} from "../core/factories"
import {invariant, isPrimitive, extend} from "../utils"

export const primitiveFactory: ModelFactory = extend(
    function primitiveFactory(snapshot: any, env?: Object): any {
        // optimization: don't wrap primitive factory in action; it's overkill...
        invariant(isPrimitive(snapshot), `Expected primitive, got '${snapshot}'`)
        return snapshot
    } as any,
    {
        factoryName: "primitive-factory",
        isModelFactory: true,
        isPrimitiveFactory: true
    }
)
