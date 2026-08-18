import { ISimpleType, union, literal, assertArg, devMode } from "../../internal"

// kept under its original name because it is exported; renaming it would be a breaking change.
/** @hidden */
export type UnionStringArray<T extends readonly (string | number)[]> = T[number]

// strongly typed enumeration forms for plain and readonly string or number arrays (when passed directly to the function).
// with these overloads, we get correct typing for native TS string enums when we use Object.values(Enum) as Enum[] as options.
// these overloads also allow both mutable and immutable arrays, making types.enumeration<Enum>(Object.values(Enum)) possible.
// the only case where this doesn't work is when passing to the function an array variable with a mutable type constraint;
// for these cases, it will just fallback and assume the type is a generic string or number.
export function enumeration<T extends string | number>(
    options: readonly T[]
): ISimpleType<UnionStringArray<T[]>>
export function enumeration<T extends string | number>(
    name: string,
    options: readonly T[]
): ISimpleType<UnionStringArray<T[]>>
/**
 * `types.enumeration` - Can be used to create a string or number based enumeration.
 * (note: this methods is just sugar for a union of string or number literals)
 *
 * Example:
 * ```ts
 * const TrafficLight = types.model({
 *   color: types.enumeration("Color", ["Red", "Orange", "Green"]),
 *   speedLimit: types.enumeration("SpeedLimit", [30, 50])
 * })
 * ```
 *
 * @param name descriptive name of the enumeration (optional)
 * @param options possible values this enumeration can have
 * @returns
 */
export function enumeration<T extends string | number>(
    name: string | readonly T[],
    options?: readonly T[]
): ISimpleType<T> {
    const realOptions: readonly T[] = typeof name === "string" ? options! : name
    // check all options
    if (devMode()) {
        realOptions.forEach((option, i) => {
            assertArg(
                option,
                o => typeof o === "string" || typeof o === "number",
                "string or number",
                i + 1
            )
        })
    }
    const type = union(...realOptions.map(option => literal(option)))
    if (typeof name === "string") type.name = name
    return type as ISimpleType<T>
}
