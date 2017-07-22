import { ISimpleType } from "../type"
import { union } from "./union"
import { literal } from "./literal"

export function enumeration(options: string[]): ISimpleType<string>
export function enumeration(name: string, options: string[]): ISimpleType<string>
/**
 * Can be used to create an string based enumeration.
 * (note: this methods is just sugar for a union of string literals)
 *
 * @example
 * ```javascript
 * const TrafficLight = types.model({
 *   color: types.enum("Color", ["Red", "Orange", "Green"])
 * })
 * ```
 *
 * @export
 * @alias types.enumeration
 * @param {string} name descriptive name of the enumeration (optional)
 * @param {string[]} options possible values this enumeration can have
 * @returns {ISimpleType<string>}
 */
export function enumeration(name: string | string[], options?: string[]): ISimpleType<string> {
    const realOptions: string[] = typeof name === "string" ? options! : name
    const type = union(...realOptions.map(option => literal("" + option)))
    if (typeof name === "string") type.name = name
    return type
}
