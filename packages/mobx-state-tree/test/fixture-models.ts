import { test } from "ava"
import { Hero, Monster, Treasure } from "./fixtures/fixture-models"
import { unprotect } from "../src"

const SAMPLE_HERO = {
    id: 1,
    name: "jimmy",
    level: 1,
    role: "cleric",
    description: "hi"
}

test("Hero computed fields", t => {
    const hero = Hero.create(SAMPLE_HERO)
    t.is(hero.descriptionLength, 2)
})

test("Tresure", t => {
    const treasure = Treasure.create({ gold: 1, trapped: true })
    t.true(treasure.trapped)
    t.is(treasure.gold, 1)
})

test("Monster computed fields", t => {
    const monster = Monster.create({
        id: "foo",
        level: 1,
        maxHp: 3,
        hp: 1,
        warning: "boo!",
        createdAt: new Date(),
        treasures: [{ gold: 2, trapped: true }, { gold: 3, trapped: true }],
        eatenHeroes: [SAMPLE_HERO],
        hasFangs: true,
        hasClaws: true,
        hasWings: true,
        hasGrowl: true
    })
    t.true(monster.isAlive)
    t.true(monster.isFlashingRed)
    unprotect(monster)
    t.is(monster.weight, 2)
    monster.level = 0
    monster.hasFangs = false
    monster.hasWings = false
    monster.eatenHeroes = null
    t.is(monster.weight, 1)
    monster.hp = 0
    t.false(monster.isFlashingRed)
    t.false(monster.isAlive)
})
