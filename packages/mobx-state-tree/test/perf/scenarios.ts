import { start } from "./timer"
import { Treasure, Hero, Monster } from "../fixtures/fixture-models"
import { createTreasure, createHeros, createMonsters } from "../fixtures/fixture-data"

/**
 * Covers models with a trivial number of fields.
 *
 * @param count The number of records to create.
 */
export const smallScenario = function smallScenario(count: number) {
    const data = createTreasure(count) // ready?
    const time = start()
    const converted = data.map(d => Treasure.create(d)) // go
    const elapsed = time()
    const sanity = converted.length === count
    return { count, elapsed, sanity }
}
/**
 * Covers models with a moderate number of fields + 1 computed field.
 *
 * @param count The number of records to create.
 */
export const mediumScenario = function mediumScenario(count: number) {
    const data = createHeros(count) // ready?
    const time = start()
    const converted = data.map(d => Hero.create(d)) // go
    const elapsed = time()
    const sanity = converted.length === count
    return { count, elapsed, sanity }
}
/**
 * Covers models with a large number of fields.
 *
 * @param count The number of records to create.
 * @param smallChildren The number of small children contained within.
 * @param mediumChildren The number of medium children contained within.
 */
export const largeScenario = function largeScenario(
    count: number,
    smallChildren: number,
    mediumChildren: number
) {
    const data = createMonsters(count, smallChildren, mediumChildren) // ready?
    const time = start()
    const converted = data.map(d => Monster.create(d)) // go
    const elapsed = time()
    const sanity = converted.length === count
    return { count, elapsed, sanity }
}
