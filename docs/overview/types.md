
# Types overview

<i><a style="color: white; background:cornflowerblue;padding:5px;margin:5px;border-radius:2px" href="https://egghead.io/lessons/react-more-mobx-state-tree-types-map-literal-union-and-enumeration">egghead.io lesson 11: More mobx-state-tree Types: map, literal, union, and enumeration</a></i><br>
<i><a style="color: white; background:cornflowerblue;padding:5px;margin:5px;border-radius:2px" href="https://egghead.io/lessons/react-create-dynamic-types-and-use-type-composition-to-extract-common-functionality">egghead.io lesson 17: Create Dynamic Types and use Type Composition to Extract Common Functionality</a></i>

These are the types available in MST. All types can be found in the `types` namespace, e.g. `types.string`. See [Api Docs](docs/API/README.md) for examples.

## Complex types

-   `types.model(properties, actions)` Defines a "class like" type with properties and actions to operate on the object.
-   `types.array(type)` Declares an array of the specified type.
-   `types.map(type)` Declares a map of the specified type.

Note that since MST v3 `types.array` and `types.map` are wrapped in `types.optional` by default, with `[]` and `{}` set as their default values, respectively.

## Primitive types

-   `types.string`
-   `types.number`
-   `types.integer`
-   `types.boolean`
-   `types.Date`
-   `types.custom` creates a custom primitive type. This is useful to define your own types that map a serialized form one-to-one to an immutable object like a Decimal or Date.

## Utility types

-   `types.union(options?: { dispatcher?: (snapshot) => Type, eager?: boolean }, types...)` create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function to determine the type. When `eager` flag is set to `true` (default) - the first matching type will be used, if set to `false` the type check will pass only if exactly 1 type matches.
-   `types.optional(type, defaultValue, optionalValues?)` marks a value as being optional (in e.g. a model). If a value is not provided/`undefined` (or set to any of the primitive values passed as an optional `optionalValues` array) the `defaultValue` will be used instead. If `defaultValue` is a function, it will be evaluated. This can be used to generate, for example, IDs or timestamps upon creation.
-   `types.literal(value)` can be used to create a literal type, where the only possible value is specifically that value. This is very powerful in combination with `union`s. E.g. `temperature: types.union(types.literal("hot"), types.literal("cold"))`.
-   `types.enumeration(name?, options: string[])` creates an enumeration. This method is a shorthand for a union of string literals. If you are using typescript and want to create a type based on an string enum (e.g. `enum Color { ... }`) then use `types.enumeration<Color>("Color", Object.values(Color))`, where the `"Color"` name argument is optional.
-   `types.refinement(name?, baseType, (snapshot) => boolean)` creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.
-   `types.maybe(type)` makes a type optional and nullable, shorthand for `types.optional(types.union(type, types.literal(undefined)), undefined)`.
-   `types.maybeNull(type)` like `maybe`, but uses `null` to represent the absence of a value.
-   `types.null` the type of `null`.
-   `types.undefined` the type of `undefined`.
-   `types.late(() => type)` can be used to create recursive or circular types, or types that are spread over files in such a way that circular dependencies between files would be an issue otherwise.
-   `types.frozen(subType? | defaultValue?)` Accepts any kind of serializable value (both primitive and complex), but assumes that the value itself is **immutable** and **serializable**.
    `frozen` can be invoked in a few different ways:
    -   `types.frozen()` - behaves the same as types.frozen in MST 2.
    -   `types.frozen(subType)` - provide a valid MST type and frozen will check if the provided data conforms the snapshot for that type. Note that the type will not actually be instantiated, so it can only be used to check the shape of the data. Adding views or actions to SubType would be pointless.
    -   `types.frozen(someDefaultValue)` - provide a primitive value, object or array, and MST will infer the type from that object, and also make it the default value for the field
    -   (Typescript) `types.frozen<TypeScriptType>(...)` - provide a typescript type, to help in strongly typing the field (design time only)
-   `types.compose(name?, type1...typeX)`, creates a new model type by taking a bunch of existing types and combining them into a new one.
-   `types.reference(targetType)` creates a property that is a reference to another item of the given `targetType` somewhere in the same tree. See [references](#references) for more details.
-   `types.safeReference(targetType)` is like a standard reference, except that it accepts the undefined value by default and automatically sets itself to undefined (when the parent is a model) / removes itself from arrays and maps when the reference it is pointing to gets detached/destroyed. See [references](#references) for more details.
-   `types.snapshotProcessor(type, processors, name?)` runs a pre snapshot / post snapshot processor before/after serializing a given type. Example:
    ```ts
    const Todo1 = types.model({ text: types.string })
    // in the backend the text type must be null when empty
    interface BackendTodo {
        text: string | null
    }
    const Todo2 = types.snapshotProcessor(Todo1, {
        // from snapshot to instance
        preProcessor(sn: BackendTodo) {
            return {
                text: sn.text || "";
            }
        },
        // from instance to snapshot
        postProcessor(sn): BackendTodo {
            return {
                text: !sn.text ? null : sn.text
            }
        }
    })
    ```

## Property types

Property types can only be used as a direct member of a `types.model` type and not further composed (for now).

-   `types.identifier` Only one such member can exist in a `types.model` and should uniquely identify the object. See [identifiers](#identifiers) for more details. `subType` should be either `types.string` or `types.number`, defaulting to the first if not specified.
-   `types.identifierNumber` Similar to `types.identifier`. However, during serialization, the identifier value will be parsed from / serialized to a number.

