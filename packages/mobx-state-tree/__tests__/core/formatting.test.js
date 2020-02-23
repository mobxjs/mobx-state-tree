const t = require("../../src").types

const statementModel = t.model("statement", {
    id: t.string,
    label: t.string,
    transactions: t.array(
        t.model("transaction", {
            id: t.string,
            amount: t.maybeNull(t.number),
            completed_on: t.model("dateSignature", {
                // YYYY-MM-DD
                date: t.refinement("serverDateFormat", t.string, value => {
                    return Boolean(value.match(/^[1-9]\d{3}-[01]\d-[0123]\d/))
                })
            })
        })
    )
})

test("outputs an expected error message format", () => {
    expect(() => {
        statementModel.create({
            id: "daf672da-9195-4804-b177-9d09c45d3b8e",
            label: ["October Week 1"],
            transactions: [
                {
                    id: "e10945f5-c426-49d2-b40e-18b7d5122085",
                    amount: 24.47
                },
                {
                    id: "c6f12693-41bb-4fdd-b450-667c52315d68",
                    amount: false
                },
                {
                    id: false,
                    amount: 51.68,
                    completed_on: {
                        date: "01/15/2020"
                    }
                }
            ]
        })
    }).toThrowError(
        `[mobx-state-tree] Error converting data to 'statement':

- Expected
+ Received

<statement>.label
- string (CoreType)
+ ["October Week 1"]
<statement>.transactions.0.completed_on
- dateSignature (ModelType)
+ undefined
<statement>.transactions.1.amount
- (number | null) (Union)
+ false
<statement>.transactions.1.completed_on
- dateSignature (ModelType)
+ undefined
<statement>.transactions.2.id
- string (CoreType)
+ false
<statement>.transactions.2.completed_on.date
- serverDateFormat (Refinement)
+ "01/15/2020"`
    )
})
