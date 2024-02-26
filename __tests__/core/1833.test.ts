import { types, Instance, getRoot } from "../../src"
import { ITypeDispatcher } from "../../src/internal"

const Person = types
  .model("Person", {
    name: types.string
  })
  .views((self) => ({
    get isHappy() {
      const {
        food: { seeded }
      } = getRoot<IRoot>(self)
      return seeded
    }
  }))

const Fruit = types
  .model("Fruit", {
    weightInGrams: types.number
  })
  .views((self) => ({
    // note: this is not a getter! this is just a function that is evaluated
    isLarge() {
      return self.weightInGrams > 100
    }
  }))

// create a new type, based on Square
const Apple = Fruit.named("Apple").props({
  colour: types.optional(types.string, "red")
})

// create a new type, based on Square
const Orange = Fruit.named("Box").props({
  seeded: types.boolean
})

// no inheritance, but, union types and code reuse

const dispatcher: ITypeDispatcher = (food) => {
  if ("seeded" in food) {
    return Orange
  } else if ("colour" in food) {
    return Apple
  } else {
    return Fruit
  }
}
const Food = types.union({ dispatcher }, Fruit, Orange, Apple)

export const RootStore = types.model({
  food: Food,
  person: Person
})

interface IRoot extends Instance<typeof RootStore> {}
