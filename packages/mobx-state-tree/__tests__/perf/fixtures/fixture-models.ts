const mst = require("../../../dist/mobx-state-tree.umd")
const { types } = mst

// tiny
export const Treasure = types.model("Treasure", {
    trapped: types.boolean,
    gold: types.optional(types.number, 0)
})
// medium
export const HeroRoles = ["warrior", "wizard", "cleric", "thief"]
export const Hero = types
    .model("Hero", {
        id: types.identifierNumber,
        name: types.string,
        description: types.string,
        level: types.optional(types.number, 1),
        role: types.union(...exports.HeroRoles.map(types.literal))
    })
    .views((self: any) => ({
        get descriptionLength() {
            return self.description.length
        }
    }))
// large
export const Monster = types
    .model("Monster", {
        id: types.identifier,
        freestyle: types.frozen(),
        level: types.number,
        maxHp: types.number,
        hp: types.number,
        warning: types.maybeNull(types.string),
        createdAt: types.maybeNull(types.Date),
        treasures: types.optional(types.array(exports.Treasure), []),
        eatenHeroes: types.maybeNull(types.array(exports.Hero)),
        hasFangs: types.optional(types.boolean, false),
        hasClaws: types.optional(types.boolean, false),
        hasWings: types.optional(types.boolean, false),
        hasGrowl: types.optional(types.boolean, false),
        stenchLevel: types.optional(types.number, 0),
        fearsFire: types.optional(types.boolean, false),
        fearsWater: types.optional(types.boolean, false),
        fearsWarriors: types.optional(types.boolean, false),
        fearsClerics: types.optional(types.boolean, false),
        fearsMages: types.optional(types.boolean, false),
        fearsThieves: types.optional(types.boolean, false),
        fearsProgrammers: types.optional(types.boolean, true)
    })
    .views((self: any) => ({
        get isAlive() {
            return self.hp > 0
        },
        get isFlashingRed() {
            return self.hp > 0 && self.hp < self.maxHp && self.hp === 1
        },
        get weight() {
            const victimWeight = self.eatenHeroes ? self.eatenHeroes.length : 0
            const fangWeight = self.hasFangs ? 10 : 5
            const wingWeight = self.hasWings ? 12 : 4
            return (victimWeight + fangWeight + wingWeight) * self.level > 5 ? 2 : 1
        }
    }))
