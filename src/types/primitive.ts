import {IModelFactory, createFactory} from "../core/factories"
import {invariant, isPrimitive, extend, identity} from "../utils"

export const primitiveFactory = createFactory(
        "primitive",
        "primitive",
        snapshot => isPrimitive(snapshot),
        snapshot => primitiveFactory,
        extend(
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
    )
