import {
    isStateTreeNode,
    getStateTreeNode,
    IValidationContext,
    IValidationResult,
    typeCheckSuccess,
    typeCheckFailure,
    isType,
    fail,
    TypeFlags,
    IAnyType,
    ExtractC,
    AnyObjectNode,
    BaseType,
    ExtractS,
    ExtractNodeType,
    assertIsType,
    ExtractTWithoutSTN,
    devMode
} from "../../internal"
import { assertIsString, assertIsFunction } from "../../utils"

class Refinement<IT extends IAnyType> extends BaseType<
    ExtractC<IT>,
    ExtractS<IT>,
    ExtractTWithoutSTN<IT>,
    ExtractNodeType<IT>
> {
    get flags() {
        return this._subtype.flags | TypeFlags.Refinement
    }

    constructor(
        name: string,
        private readonly _subtype: IT,
        private readonly _predicate: (v: ExtractC<IT>) => boolean,
        private readonly _message: (v: ExtractC<IT>) => string
    ) {
        super(name)
    }

    describe() {
        return this.name
    }

    instantiate(
        parent: AnyObjectNode | null,
        subpath: string,
        environment: any,
        initialValue: this["C"] | this["T"]
    ): this["N"] {
        // create the child type
        return this._subtype.instantiate(parent, subpath, environment, initialValue)
    }

    isAssignableFrom(type: IAnyType) {
        return this._subtype.isAssignableFrom(type)
    }

    isValidSnapshot(value: this["C"], context: IValidationContext): IValidationResult {
        const subtypeErrors = this._subtype.validate(value, context)
        if (subtypeErrors.length > 0) return subtypeErrors

        const snapshot = isStateTreeNode(value) ? getStateTreeNode(value).snapshot : value

        if (!this._predicate(snapshot)) {
            return typeCheckFailure(context, value, this._message(value))
        }

        return typeCheckSuccess()
    }

    reconcile(
        current: this["N"],
        newValue: this["C"] | this["T"],
        parent: AnyObjectNode,
        subpath: string
    ): this["N"] {
        return this._subtype.reconcile(current, newValue, parent, subpath)
    }

    getSubTypes() {
        return this._subtype
    }
}

export function refinement<IT extends IAnyType>(
    name: string,
    type: IT,
    predicate: (snapshot: ExtractC<IT>) => boolean,
    message?: string | ((v: ExtractC<IT>) => string)
): IT
export function refinement<IT extends IAnyType>(
    type: IT,
    predicate: (snapshot: ExtractC<IT>) => boolean,
    message?: string | ((v: ExtractC<IT>) => string)
): IT

/**
 * `types.refinement` - Creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.
 *
 * @param name
 * @param type
 * @param predicate
 * @returns
 */
export function refinement(...args: any[]): IAnyType {
    const name = typeof args[0] === "string" ? args.shift() : isType(args[0]) ? args[0].name : null
    const type = args[0]
    const predicate = args[1]
    const message = args[2]
        ? args[2]
        : (v: any) => "Value does not respect the refinement predicate"
    // ensures all parameters are correct
    assertIsType(type, [1, 2])
    assertIsString(name, 1)
    assertIsFunction(predicate, [2, 3])
    assertIsFunction(message, [3, 4])

    return new Refinement(name, type, predicate, message)
}

/**
 * Returns if a given value is a refinement type.
 *
 * @param type
 * @returns
 */
export function isRefinementType<IT extends IAnyType>(type: IT): type is IT {
    return (type.flags & TypeFlags.Refinement) > 0
}
