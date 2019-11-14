
### Handle circular dependencies between files and types using `late`

In the exporting file:

```javascript
export function LateStore() {
    return types.model({
        title: types.string
    })
}
```

In the importing file:

```javascript
import { LateStore } from "./circular-dep"

const Store = types.late(() => LateStore)
```

Thanks to function hoisting in combination with `types.late`, this lets you have circular dependencies between types, across files.

If you are using TypeScript and you get errors about circular or self-referencing types then you can partially fix it by doing:

```ts
const Node = types.model({
    x: 5, // as an example
    me: types.maybe(types.late((): IAnyModelType => Node))
})
```

In this case, while "me" will become any, any other properties (such as x) will be strongly typed, so you can typecast the self referencing properties (me in this case) once more to get typings. For example:

```ts
node.((me) as Instance<typeof Node>).x // x here will be number
```
