import { start } from "./timer"
import { Treasure, Hero, Monster } from "../fixtures/fixture-models"
import { createTreasure, createHeros, createMonsters } from "../fixtures/fixture-data"

export interface IScenario {
    /** The number of records. */
    count: number
    /** Time it took to run in milliseconds. */
    elapsed: number
    /** Haxx to ensure tests don't optimize out stuff on us */
    sanity?: any
}

/**
 * Covers models with a trivial amount of fields.
 *
 * @param count The number of records to create.
 */
export function smallScenario(count: number): IScenario {
    const data = createTreasure(count) // ready?
    const time = start()
    const converted = data.map(d => Treasure.create(d)) // go
    const elapsed = time()
    const sanity = converted.length === count

    return { count, elapsed, sanity }
}

/**
 * Covers models with a moderate amount of fields + 1 computed field.
 * 
 * @param count The number of records to create.
 */
export function mediumScenario(count: number): IScenario {
    const data = createHeros(count) // ready?
    const time = start()
    const converted = data.map(d => Hero.create(d)) // go
    const elapsed = time()
    const sanity = converted.length === count

    return { count, elapsed, sanity }
}

/**
 * Covers models with a large amount of fields.
 * 
 * @param count The number of records to create.
 * @param smallChildren The number of small children contained within.
 * @param mediumChildren The number of medium children contained within.
 */
export function largeScenario(
    count: number,
    smallChildren: number,
    mediumChildren: number
): IScenario {
    const data = createMonsters(count, smallChildren, mediumChildren) // ready?
    const time = start()
    const converted = data.map(d => Monster.create(d)) // go
    const elapsed = time()
    const sanity = converted.length === count

    return { count, elapsed, sanity }
}
