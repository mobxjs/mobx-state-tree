import { ISimpleType, union, literal, assertIsString, devMode } from "../../internal"

/** @hidden */
export type UnionStringArray<T extends readonly string[]> = T[number]

// strongly typed enumeration forms for plain and readonly string arrays (when passed directly to the function).
// with these overloads, we get correct typing for native TS string enums when we use Object.values(Enum) as Enum[] as options.
// these overloads also allow both mutable and immutable arrays, making types.enumeration<Enum>(Object.values(Enum)) possible.
// the only case where this doesn't work is when passing to the function an array variable with a mutable type constraint;
// for these cases, it will just fallback and assume the type is a generic string.
export function enumeration<T extends readonly string[]>(
  options: T
): ISimpleType<UnionStringArray<T>>
export function enumeration<T extends string>(
  name: string,
  options: T[]
): ISimpleType<UnionStringArray<T[]>>

/**
 * `types.enumeration` - Can be used to create an string based enumeration.
 * (note: this methods is just sugar for a union of string literals)
 *
 * Example:
 * ```ts
 * const TrafficLight = types.model({
 *   color: types.enumeration("Color", ["Red", "Orange", "Green"])
 * })
 * ```
 *
 * @param name descriptive name of the enumeration (optional)
 * @param options possible values this enumeration can have
 * @returns
 */
export function enumeration(name: string | string[], options?: any): ISimpleType<string> {
  const realOptions: string[] = typeof name === "string" ? options! : name
  // check all options
  if (devMode()) {
    realOptions.forEach((option, i) => {
      assertIsString(option, i + 1)
    })
  }
  const type = union(...realOptions.map((option) => literal("" + option)))
  if (typeof name === "string") type.name = name
  return type
}
