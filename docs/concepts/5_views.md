
### Views

<i><a style="color: white; background:cornflowerblue;padding:5px;margin:5px;border-radius:2px" href="https://egghead.io/lessons/react-derive-information-from-models-using-views">egghead.io lesson 4: Derive Information from Models Using Views</a></i>

Any fact that can be derived from your state is called a "view" or "derivation".
See the [Mobx concepts & principles](https://mobx.js.org/intro/concepts.html) for some background.

Views come in two flavors: views with arguments and views without arguments. The latter are called computed values, based on the [computed](https://mobx.js.org/refguide/computed-decorator.html) concept in MobX. The main difference between the two is that computed properties create an explicit caching point, but later they work the same and any other computed value or MobX based reaction like [`@observer`](https://mobx.js.org/refguide/observer-component.html) components can react to them. Computed values are defined using _getter_ functions.

Example:

```javascript
import { autorun } from "mobx"

const UserStore = types
    .model({
        users: types.array(User)
    })
    .views(self => ({
        get numberOfChildren() {
            return self.users.filter(user => user.age < 18).length
        },
        numberOfPeopleOlderThan(age) {
            return self.users.filter(user => user.age > age).length
        }
    }))

const userStore = UserStore.create(/* */)

// Every time the userStore is updated in a relevant way, log messages will be printed
autorun(() => {
    console.log("There are now ", userStore.numberOfChildren, " children")
})
autorun(() => {
    console.log("There are now ", userStore.numberOfPeopleOlderThan(75), " pretty old people")
})
```

If you want to share volatile state between views and actions, use `.extend` instead of `.views` + `.actions`. See the [volatile state](#volatile-state) section.
