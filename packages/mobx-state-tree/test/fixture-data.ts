import { test } from "ava"
import { rando, createHeros, createMonsters, createTreasure } from "./fixtures/fixture-data"
import { Hero, Monster, Treasure } from "./fixtures/fixture-models"

test("createHeros", t => {
    const data = createHeros(10)
    t.is(data.length, 10)
    const hero = Hero.create(data[0])
    t.true(hero.descriptionLength > 1)
})

test("createMonsters", t => {
    const data = createMonsters(10, 10, 10)
    t.is(data.length, 10)
    t.is(data[1].treasures.length, 10)
    t.is(data[0].eatenHeroes.length, 10)
    const monster = Monster.create(data[0])
    t.true(monster.eatenHeroes && monster.eatenHeroes.length === 10)
    t.true(monster.treasures.length === 10)
})

test("createTreasure", t => {
    const data = createTreasure(10)
    t.is(data.length, 10)
    const treasure = Treasure.create(data[1])
    t.true(treasure.gold > 0)
})

test("rando sorting", t => {
    // i'm going straight to hell for this test... must get coverage to 100%.... no matter the cost.
    let foundTrue = false
    let foundFalse = false
    let result
    do {
        result = rando()
        if (result) {
            foundTrue = true
        } else {
            foundFalse = true
        }
    } while (!foundTrue || !foundFalse)

    t.true(foundTrue)
    t.true(foundFalse)
})
