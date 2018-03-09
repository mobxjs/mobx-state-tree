import { reaction, when } from "mobx"
import {
    types,
    recordPatches,
    getSnapshot,
    applySnapshot,
    applyPatch,
    unprotect,
    getRoot,
    onSnapshot,
    flow
} from "../src"

class Decimal {
    public number: number
    public fraction: number

    constructor(value: string) {
        const parts = value.split(".")
        this.number = parseInt(parts[0])
        this.fraction = parseInt(parts[1])
    }

    toNumber() {
        return this.number + parseInt("0." + this.fraction)
    }

    toString() {
        return `${this.number}.${this.fraction}`
    }
}

const DecimalPrimitive = types.custom<string, Decimal>({
    name: "Decimal",
    fromSnapshot(value: string) {
        return new Decimal(value)
    },
    toSnapshot(value: Decimal) {
        return value.toString()
    },
    isTargetType(value: string | Decimal): boolean {
        return value instanceof Decimal
    },
    isValidSnapshot(value: string): string {
        if (/^-?\d+\.\d+$/.test(value)) return "" // OK
        return `'${value}' doesn't look like a valid decimal number`
    }
})

const Wallet = types.model({
    balance: DecimalPrimitive
})

test("it should allow for custom primitive types", () => {
    const w1 = Wallet.create({
        balance: new Decimal("2.5")
    })

    expect(w1.balance.number).toBe(2)
    expect(w1.balance.fraction).toBe(5)

    const w2 = Wallet.create({ balance: "3.5" })
    expect(w2.balance.number).toBe(3)
    expect(w2.balance.fraction).toBe(5)

    expect(() => Wallet.create({ balance: "two point one" })).toThrow(
        "(Invalid value for type 'Decimal': 'two point one' doesn't look like a valid decimal number)"
    )
})

// test reassignment / conversion

// test reconcile

// test snapshot

// test patches

// test complex representation
