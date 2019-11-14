### Generate MST models from JSON

The following service can generate MST models based on JSON: https://transform.now.sh/json-to-mobx-state-tree

### `optionals` and default value functions

`types.optional` can take an optional function parameter which will be invoked each time a default value is needed. This is useful to generate timestamps, identifiers or even complex objects, for example:

`createdDate: types.optional(types.Date, () => new Date())`

### `toJSON()` for debugging

For debugging you might want to use `getSnapshot(model, applyPostProcess)` to print the state of a model. If you didn't import `getSnapshot` while debugging in some debugger, don't worry, `model.toJSON()` will produce the same snapshot. (For API consistency, this feature is not part of the typed API).

#### Optional/empty maps/arrays

Since v3, maps and arrays are optional by default, this is:

```javascript
types.map(OtherType)
// is the same as
types.optional(types.map(OtherType), {})

types.array(OtherType)
// is the same as
types.optional(types.array(OtherType), [])
```

### Building with production environment

MobX-state-tree provides a lot of dev-only checks. They check the correctness of function calls and perform runtime type-checks over your models. It is recommended to disable them in production builds. To do so, you should use webpack's DefinePlugin to set environment as production and remove them. More information could be found in the [official webpack guides](https://webpack.js.org/plugins/environment-plugin/#usage).


