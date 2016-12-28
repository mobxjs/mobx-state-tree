import {createFactoryHelper, ModelFactory} from "../core/factories"
import {invariant, isPrimitive} from "../utils"

export const primitiveFactory: ModelFactory = createFactoryHelper(
    "primitive-factory",
    function primitiveFactory(snapshot: any, env?: Object): any {
        // optimization: don't wrap primitive factory in action; it's overkill...
        invariant(isPrimitive(snapshot), `Expected primitive, got '${snapshot}'`)
        return snapshot
    }
)
