import * as path from "path"
import { types } from "../src"
import { withBenchmark } from "./lib"

const User = types.model({
  id: types.identifier,
  name: types.string,
  age: types.number
})

const UserStore = types
  .model({
    users: types.array(User)
  })
  .views((self) => ({
    get numberOfChildren() {
      return self.users.filter((user) => user.age < 18).length
    },
    numberOfPeopleOlderThan(age: number) {
      return self.users.reduce((sum, user) => sum + (user.age > age ? 1 : 0), 0)
    }
  }))

const userStore = UserStore.create({
  users: [
    { id: "1", name: "John", age: 42 },
    { id: "2", name: "Jane", age: 47 }
  ]
})

await withBenchmark(path.parse(__filename).name, (suite) => {
  return suite
    .add("simple view once", () => userStore.numberOfChildren)
    .add(
      "simple view thrice",
      () => userStore.numberOfChildren + userStore.numberOfChildren + userStore.numberOfChildren
    )
    .add("view with param once", () => userStore.numberOfPeopleOlderThan(50))
    .add(
      "view with param thrice",
      () =>
        userStore.numberOfPeopleOlderThan(50) +
        userStore.numberOfPeopleOlderThan(50) +
        userStore.numberOfPeopleOlderThan(50)
    )
})
