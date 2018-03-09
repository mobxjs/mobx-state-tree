import { types, recordPatches, onSnapshot, unprotect, applySnapshot, applyPatch } from "../src"

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

{
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

        if (process.env.NODE_ENV !== "production")
            expect(() => Wallet.create({ balance: "two point one" })).toThrow(
                "(Invalid value for type 'Decimal': 'two point one' doesn't look like a valid decimal number)"
            )
    })

    // test reassignment / reconcilation / conversion works
    test("reassignments will work", () => {
        const w1 = Wallet.create({ balance: "2.5" })
        unprotect(w1)

        const p = recordPatches(w1)
        const snapshots: any[] = []
        onSnapshot(w1, s => {
            snapshots.push(s)
        })

        const b1 = w1.balance
        expect(b1).toBeInstanceOf(Decimal)

        w1.balance = "2.5" as any
        expect(b1).toBeInstanceOf(Decimal)
        expect(w1.balance).toBe(b1) // reconciled

        w1.balance = new Decimal("2.5") // not reconciling! // TODO: introduce custom hook for that?
        expect(b1).toBeInstanceOf(Decimal)

        w1.balance = new Decimal("3.5")
        expect(b1).toBeInstanceOf(Decimal)

        w1.balance = "4.5" as any
        expect(b1).toBeInstanceOf(Decimal)

        // patches & snapshots
        expect(snapshots).toMatchSnapshot()
        p.stop()
        expect(p.patches).toMatchSnapshot()
    })
}

{
    test("complex representation", () => {})

    const DecimalTuple = types.custom<[number, number], Decimal>({
        name: "DecimalTuple",
        fromSnapshot(value: [number, number]) {
            return new Decimal(value[0] + "." + value[1])
        },
        toSnapshot(value: Decimal) {
            return [value.number, value.fraction]
        },
        isTargetType(value: [number, number] | Decimal): boolean {
            return value instanceof Decimal
        },
        isValidSnapshot(value: [number, number]): string {
            if (Array.isArray(value) && value.length === 2) return "" // OK
            return `'${JSON.stringify(value)}' doesn't look like a valid decimal number`
        }
    })

    const Wallet = types.model({ balance: DecimalTuple })

    test("it should allow for complex custom primitive types", () => {
        const w1 = Wallet.create({
            balance: new Decimal("2.5")
        })

        expect(w1.balance.number).toBe(2)
        expect(w1.balance.fraction).toBe(5)

        const w2 = Wallet.create({ balance: [3, 5] })
        expect(w2.balance.number).toBe(3)
        expect(w2.balance.fraction).toBe(5)

        if (process.env.NODE_ENV !== "production")
            expect(() => Wallet.create({ balance: "two point one" })).toThrow(
                "(Invalid value for type 'DecimalTuple': '\"two point one\"' doesn't look like a valid decimal number)"
            )
    })

    // test reassignment / reconcilation / conversion works
    test("complex reassignments will work", () => {
        const w1 = Wallet.create({ balance: [2, 5] })
        unprotect(w1)

        const p = recordPatches(w1)
        const snapshots: any[] = []
        onSnapshot(w1, s => {
            snapshots.push(s)
        })

        const b1 = w1.balance
        expect(b1).toBeInstanceOf(Decimal)

        w1.balance = [2, 5] as any
        expect(b1).toBeInstanceOf(Decimal)
        expect(w1.balance).not.toBe(b1) // not reconciled, balance is not deep equaled (TODO: future feature?)

        w1.balance = new Decimal("2.5") // not reconciling!
        expect(b1).toBeInstanceOf(Decimal)

        w1.balance = new Decimal("3.5")
        expect(b1).toBeInstanceOf(Decimal)

        w1.balance = [4, 5] as any
        expect(b1).toBeInstanceOf(Decimal)

        // patches & snapshots
        expect(snapshots).toMatchSnapshot()
        p.stop()
        expect(p.patches).toMatchSnapshot()
    })

    test("can apply snapshot and patch", () => {
        const w1 = Wallet.create({ balance: [3, 0] })
        applySnapshot(w1, { balance: [4, 5] })
        expect(w1.balance).toBeInstanceOf(Decimal)
        expect(w1.balance.toString()).toBe("4.5")

        applyPatch(w1, {
            op: "replace",
            path: "balance",
            value: [5, 0]
        })
        expect(w1.balance.toString()).toBe("5.0")
    })
}
