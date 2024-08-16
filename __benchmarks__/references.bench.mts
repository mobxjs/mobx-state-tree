import { withCodSpeed } from "@codspeed/tinybench-plugin"
import { Bench } from "tinybench"
import {
  applyPatch,
  onPatch,
  types,
  type Instance,
  type IDisposer,
  isValidReference,
  tryReference
} from "../src"
import { withBenchmark } from "./lib"
import * as path from "path"

const Model = types.model({
  string: types.string,
  number: types.number,
  integer: types.integer,
  float: types.float,
  boolean: types.boolean,
  date: types.Date
})

let m: Instance<typeof Model>
let disposer: IDisposer | undefined

const options: Parameters<Bench["add"]>[2] = {
  beforeEach() {
    m = Model.create({
      string: "string",
      number: 1,
      integer: 1,
      float: 1.1,
      boolean: true,
      date: new Date()
    })
  },

  afterEach() {
    disposer?.()
    disposer = undefined
  }
}

const Todo = types.model({
  id: types.identifier,
  title: types.string
})

const TodoStore = types.model({
  todos: types.array(Todo),
  selectedTodo: types.reference(Todo)
})

const Car = types.model("Car", {
  id: types.refinement(types.identifier, (identifier) => identifier.indexOf("Car_") === 0)
})

const CarStore = types.model("CarStore", {
  cars: types.array(Car),
  selectedCar: types.reference(Car)
})

const storeWithValidRef = TodoStore.create({
  todos: [
    {
      id: "47",
      title: "Get coffee"
    }
  ],
  selectedTodo: "47"
})

const storeWithInvalidRef = TodoStore.create({
  todos: [
    {
      id: "47",
      title: "Get coffee"
    }
  ],
  selectedTodo: "10"
})

const storeWithRefinedRef = CarStore.create({
  cars: [
    {
      id: "Car_47"
    }
  ],
  selectedCar: "Car_47"
})

await withBenchmark(path.parse(__filename).name, (suite) => {
  suite
    .add("types.reference", () => {
      return storeWithValidRef.selectedTodo.title
    })
    .add("types.refinement of a types.reference", () => {
      return storeWithRefinedRef.selectedCar.id
    })
    .add("invalid types.reference", () => {
      try {
        return storeWithInvalidRef.selectedTodo.id
      } catch (err) {
        return undefined
      }
    })
    .add("isValidReference with a valid reference", () => {
      isValidReference(() => storeWithValidRef.selectedTodo)
    })
    .add("isValidReference with an invalid reference", () => {
      isValidReference(() => storeWithInvalidRef.selectedTodo)
    })
    .add("tryReference with a valid reference", () => {
      tryReference(() => storeWithValidRef.selectedTodo)
    })
    .add("tryReference with an invalid reference", () => {
      tryReference(() => storeWithInvalidRef.selectedTodo)
    })
})
