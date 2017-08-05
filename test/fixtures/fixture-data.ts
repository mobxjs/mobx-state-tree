import { HeroRoles } from "./fixture-models"

/**
 * Creates data containing very few fields.
 *
 * @param count The number of items to create.
 */
export function createTreasure(count: number) {
    const data: any[] = []
    let i = 0
    do {
        data.push({
            trapped: i % 2 === 0,
            gold: (count % 10 + 1) * 10
        })
        i++
    } while (i < count)
    return data
}

// why yes i DID graduate high school, why do you ask?
export const rando = () => (Math.random() > 0.5 ? 1 : 0)

const titles = ["Sir", "Lady", "Baron von", "Baroness", "Captain", "Dread", "Fancy"].sort(rando)
const givenNames = ["Abe", "Beth", "Chuck", "Dora", "Ernie", "Fran", "Gary", "Haily"].sort(rando)
const epicNames = ["Amazing", "Brauny", "Chafed", "Dapper", "Egomaniac", "Foul"].sort(rando)
const wtf = `Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt, 
    Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, 
    and Mother of Dragons. `

/**
 * Creates data with a medium number of fields and data.
 *
 * @param count The number of items to create.
 */
export function createHeros(count: number) {
    const data: any[] = []
    let i = 0
    let even = true
    let n1: string
    let n2: string
    let n3: string
    do {
        n1 = titles[i % titles.length]
        n2 = givenNames[i % givenNames.length]
        n3 = epicNames[i % epicNames.length]
        data.push({
            id: i,
            name: `${n1} ${n2} the ${n3}`,
            level: count % 100 + 1,
            role: HeroRoles[i % HeroRoles.length],
            description: `${wtf} ${wtf} ${wtf}`
        })
        even = !even
        i++
    } while (i < count)
    return data
}

/**
 * Creates data with a large amount of fields and data.
 *
 * @param count The number of items to create.
 * @param treasureCount The number of small children to create.
 * @param heroCount The number of medium children to create.
 */
export function createMonsters(count: number, treasureCount: number, heroCount: number) {
    const data: any[] = []
    let i = 0
    let even = true
    do {
        const treasures = createTreasure(treasureCount)
        const eatenHeroes = createHeros(heroCount)
        data.push({
            id: `omg-${i}-run!`,
            freestyle: `${wtf} ${wtf} ${wtf}${wtf} ${wtf} ${wtf}`,
            level: count % 100 + 1,
            hp: i % 2 === 0 ? 1 : 5 * i,
            maxHp: 5 * i,
            warning: "!!!!!!",
            createdAt: new Date(),
            hasFangs: even,
            hasClaws: even,
            hasWings: !even,
            hasGrowl: !even,
            fearsFire: even,
            fearsWater: !even,
            fearsWarriors: even,
            fearsClerics: !even,
            fearsMages: even,
            fearsThieves: !even,
            stenchLevel: i % 5,
            treasures,
            eatenHeroes
        })
        even = !even
        i++
    } while (i < count)
    return data
}
