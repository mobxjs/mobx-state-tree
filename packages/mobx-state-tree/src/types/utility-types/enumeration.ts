import { ISimpleType, union, literal, fail } from "../../internal"

export type UnionStringArray<T extends string[]> =
    | T[0]
    | T[1]
    | T[2]
    | T[3]
    | T[4]
    | T[5]
    | T[6]
    | T[7]
    | T[8]
    | T[9]
    | T[10]
    | T[11]
    | T[12]
    | T[13]
    | T[14]
    | T[15]
    | T[16]
    | T[17]
    | T[18]
    | T[19]
    | T[20]
    | T[21]
    | T[22]
    | T[23]
    | T[24]
    | T[25]
    | T[26]
    | T[27]
    | T[28]
    | T[29]
    | T[30]
    | T[31]
    | T[32]
    | T[33]
    | T[34]
    | T[35]
    | T[36]
    | T[37]
    | T[38]
    | T[39]
    | T[40]
    | T[41]
    | T[42]
    | T[43]
    | T[44]
    | T[45]
    | T[46]
    | T[47]
    | T[48]
    | T[49]

export function enumeration<T extends string[]>(options: T): ISimpleType<UnionStringArray<T>>
export function enumeration<T extends string[]>(
    name: string,
    options: T
): ISimpleType<UnionStringArray<T>>
/**
 * Can be used to create an string based enumeration.
 * (note: this methods is just sugar for a union of string literals)
 *
 * @example
 * const TrafficLight = types.model({
 *   color: types.enumeration("Color", ["Red", "Orange", "Green"])
 * })
 *
 * @export
 * @alias types.enumeration
 * @param {string} name descriptive name of the enumeration (optional)
 * @param {string[]} options possible values this enumeration can have
 * @returns {ISimpleType<string>}
 */
export function enumeration(name: string | string[], options?: any): ISimpleType<string> {
    const realOptions: string[] = typeof name === "string" ? options! : name
    // check all options
    if (process.env.NODE_ENV !== "production") {
        realOptions.forEach(option => {
            if (typeof option !== "string")
                fail("expected all options to be string, got " + type + " instead")
        })
    }
    const type = union(...realOptions.map(option => literal("" + option)))
    if (typeof name === "string") type.name = name
    return type
}
