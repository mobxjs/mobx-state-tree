---
id: "index"
title: "mobx-state-tree - v3.16.0"
sidebar_label: "Globals"
---

[mobx-state-tree - v3.16.0](index.md)

## Index

### Interfaces

-   [CustomTypeOptions](interfaces/customtypeoptions.md)
-   [IActionContext](interfaces/iactioncontext.md)
-   [IActionRecorder](interfaces/iactionrecorder.md)
-   [IActionTrackingMiddleware2Call](interfaces/iactiontrackingmiddleware2call.md)
-   [IActionTrackingMiddleware2Hooks](interfaces/iactiontrackingmiddleware2hooks.md)
-   [IActionTrackingMiddlewareHooks](interfaces/iactiontrackingmiddlewarehooks.md)
-   [IAnyComplexType](interfaces/ianycomplextype.md)
-   [IAnyModelType](interfaces/ianymodeltype.md)
-   [IAnyType](interfaces/ianytype.md)
-   [IHooks](interfaces/ihooks.md)
-   [IJsonPatch](interfaces/ijsonpatch.md)
-   [IMiddlewareEvent](interfaces/imiddlewareevent.md)
-   [IModelReflectionData](interfaces/imodelreflectiondata.md)
-   [IModelReflectionPropertiesData](interfaces/imodelreflectionpropertiesdata.md)
-   [IModelType](interfaces/imodeltype.md)
-   [IPatchRecorder](interfaces/ipatchrecorder.md)
-   [IReversibleJsonPatch](interfaces/ireversiblejsonpatch.md)
-   [ISerializedActionCall](interfaces/iserializedactioncall.md)
-   [ISimpleType](interfaces/isimpletype.md)
-   [ISnapshotProcessor](interfaces/isnapshotprocessor.md)
-   [ISnapshotProcessors](interfaces/isnapshotprocessors.md)
-   [IType](interfaces/itype.md)
-   [IValidationContextEntry](interfaces/ivalidationcontextentry.md)
-   [IValidationError](interfaces/ivalidationerror.md)
-   [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)
-   [ReferenceOptionsOnInvalidated](interfaces/referenceoptionsoninvalidated.md)
-   [UnionOptions](interfaces/unionoptions.md)

### Type aliases

-   [IDisposer](index.md#idisposer)
-   [IHooksGetter](index.md#ihooksgetter)
-   [IMiddlewareEventType](index.md#imiddlewareeventtype)
-   [IMiddlewareHandler](index.md#imiddlewarehandler)
-   [ITypeDispatcher](index.md#itypedispatcher)
-   [IValidationContext](index.md#ivalidationcontext)
-   [IValidationResult](index.md#ivalidationresult)
-   [Instance](index.md#instance)
-   [LivelinessMode](index.md#livelinessmode)
-   [OnReferenceInvalidated](index.md#onreferenceinvalidated)
-   [OnReferenceInvalidatedEvent](index.md#onreferenceinvalidatedevent)
-   [ReferenceIdentifier](index.md#referenceidentifier)
-   [ReferenceOptions](index.md#referenceoptions)
-   [SnapshotIn](index.md#snapshotin)
-   [SnapshotOrInstance](index.md#snapshotorinstance)
-   [SnapshotOut](index.md#snapshotout)

### Variables

-   [DatePrimitive](index.md#const-dateprimitive)
-   [boolean](index.md#const-boolean)
-   [identifier](index.md#const-identifier)
-   [identifierNumber](index.md#const-identifiernumber)
-   [integer](index.md#const-integer)
-   [nullType](index.md#const-nulltype)
-   [number](index.md#const-number)
-   [string](index.md#const-string)
-   [undefinedType](index.md#const-undefinedtype)

### Functions

-   [addDisposer](index.md#adddisposer)
-   [addMiddleware](index.md#addmiddleware)
-   [applyAction](index.md#applyaction)
-   [applyPatch](index.md#applypatch)
-   [applySnapshot](index.md#applysnapshot)
-   [array](index.md#array)
-   [cast](index.md#cast)
-   [castFlowReturn](index.md#castflowreturn)
-   [castToReferenceSnapshot](index.md#casttoreferencesnapshot)
-   [castToSnapshot](index.md#casttosnapshot)
-   [clone](index.md#clone)
-   [compose](index.md#compose)
-   [createActionTrackingMiddleware](index.md#createactiontrackingmiddleware)
-   [createActionTrackingMiddleware2](index.md#createactiontrackingmiddleware2)
-   [custom](index.md#custom)
-   [decorate](index.md#decorate)
-   [destroy](index.md#destroy)
-   [detach](index.md#detach)
-   [enumeration](index.md#enumeration)
-   [escapeJsonPath](index.md#escapejsonpath)
-   [flow](index.md#flow)
-   [frozen](index.md#frozen)
-   [getChildType](index.md#getchildtype)
-   [getEnv](index.md#getenv)
-   [getIdentifier](index.md#getidentifier)
-   [getLivelinessChecking](index.md#getlivelinesschecking)
-   [getMembers](index.md#getmembers)
-   [getNodeId](index.md#getnodeid)
-   [getParent](index.md#getparent)
-   [getParentOfType](index.md#getparentoftype)
-   [getPath](index.md#getpath)
-   [getPathParts](index.md#getpathparts)
-   [getPropertyMembers](index.md#getpropertymembers)
-   [getRelativePath](index.md#getrelativepath)
-   [getRoot](index.md#getroot)
-   [getRunningActionContext](index.md#getrunningactioncontext)
-   [getSnapshot](index.md#getsnapshot)
-   [getType](index.md#gettype)
-   [hasParent](index.md#hasparent)
-   [hasParentOfType](index.md#hasparentoftype)
-   [isActionContextChildOf](index.md#isactioncontextchildof)
-   [isActionContextThisOrChildOf](index.md#isactioncontextthisorchildof)
-   [isAlive](index.md#isalive)
-   [isArrayType](index.md#isarraytype)
-   [isFrozenType](index.md#isfrozentype)
-   [isIdentifierType](index.md#isidentifiertype)
-   [isLateType](index.md#islatetype)
-   [isLiteralType](index.md#isliteraltype)
-   [isMapType](index.md#ismaptype)
-   [isModelType](index.md#ismodeltype)
-   [isOptionalType](index.md#isoptionaltype)
-   [isPrimitiveType](index.md#isprimitivetype)
-   [isProtected](index.md#isprotected)
-   [isReferenceType](index.md#isreferencetype)
-   [isRefinementType](index.md#isrefinementtype)
-   [isRoot](index.md#isroot)
-   [isStateTreeNode](index.md#isstatetreenode)
-   [isType](index.md#istype)
-   [isUnionType](index.md#isuniontype)
-   [isValidReference](index.md#isvalidreference)
-   [joinJsonPath](index.md#joinjsonpath)
-   [late](index.md#late)
-   [literal](index.md#literal)
-   [map](index.md#map)
-   [maybe](index.md#maybe)
-   [maybeNull](index.md#maybenull)
-   [model](index.md#model)
-   [onAction](index.md#onaction)
-   [onPatch](index.md#onpatch)
-   [onSnapshot](index.md#onsnapshot)
-   [optional](index.md#optional)
-   [protect](index.md#protect)
-   [recordActions](index.md#recordactions)
-   [recordPatches](index.md#recordpatches)
-   [reference](index.md#reference)
-   [refinement](index.md#refinement)
-   [resolveIdentifier](index.md#resolveidentifier)
-   [resolvePath](index.md#resolvepath)
-   [safeReference](index.md#safereference)
-   [setLivelinessChecking](index.md#setlivelinesschecking)
-   [snapshotProcessor](index.md#snapshotprocessor)
-   [splitJsonPath](index.md#splitjsonpath)
-   [toGenerator](index.md#togenerator)
-   [toGeneratorFunction](index.md#togeneratorfunction)
-   [tryReference](index.md#tryreference)
-   [tryResolve](index.md#tryresolve)
-   [typecheck](index.md#typecheck)
-   [unescapeJsonPath](index.md#unescapejsonpath)
-   [union](index.md#union)
-   [unprotect](index.md#unprotect)
-   [walk](index.md#walk)

### Object literals

-   [types](index.md#const-types)

## Type aliases

### IDisposer

Ƭ **IDisposer**: _function_

_Defined in [packages/mobx-state-tree/src/utils.ts:33](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/utils.ts#L33)_

A generic disposer.

#### Type declaration:

▸ (): _void_

---

### IHooksGetter

Ƭ **IHooksGetter**: _function_

_Defined in [packages/mobx-state-tree/src/core/node/Hook.ts:19](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/node/Hook.ts#L19)_

#### Type declaration:

▸ (`self`: T): _[IHooks](interfaces/ihooks.md)_

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `self` | T    |

---

### IMiddlewareEventType

Ƭ **IMiddlewareEventType**: _"action" | "flow_spawn" | "flow_resume" | "flow_resume_error" | "flow_return" | "flow_throw"_

_Defined in [packages/mobx-state-tree/src/core/action.ts:16](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/action.ts#L16)_

---

### IMiddlewareHandler

Ƭ **IMiddlewareHandler**: _function_

_Defined in [packages/mobx-state-tree/src/core/action.ts:49](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/action.ts#L49)_

#### Type declaration:

▸ (`actionCall`: [IMiddlewareEvent](interfaces/imiddlewareevent.md), `next`: function, `abort`: function): _any_

**Parameters:**

▪ **actionCall**: _[IMiddlewareEvent](interfaces/imiddlewareevent.md)_

▪ **next**: _function_

▸ (`actionCall`: [IMiddlewareEvent](interfaces/imiddlewareevent.md), `callback?`: undefined | function): _void_

**Parameters:**

| Name         | Type                                               |
| ------------ | -------------------------------------------------- |
| `actionCall` | [IMiddlewareEvent](interfaces/imiddlewareevent.md) |
| `callback?`  | undefined &#124; function                          |

▪ **abort**: _function_

▸ (`value`: any): _void_

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `value` | any  |

---

### ITypeDispatcher

Ƭ **ITypeDispatcher**: _function_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:27](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L27)_

#### Type declaration:

▸ (`snapshot`: any): _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

| Name       | Type |
| ---------- | ---- |
| `snapshot` | any  |

---

### IValidationContext

Ƭ **IValidationContext**: _[IValidationContextEntry](interfaces/ivalidationcontextentry.md)[]_

_Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:23](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/type/type-checker.ts#L23)_

Array of validation context entries

---

### IValidationResult

Ƭ **IValidationResult**: _[IValidationError](interfaces/ivalidationerror.md)[]_

_Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:36](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/type/type-checker.ts#L36)_

Type validation result, which is an array of type validation errors

---

### Instance

Ƭ **Instance**: _T extends object ? T["Type"] : T_

_Defined in [packages/mobx-state-tree/src/core/type/type.ts:227](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/type/type.ts#L227)_

The instance representation of a given type.

---

### LivelinessMode

Ƭ **LivelinessMode**: _"warn" | "error" | "ignore"_

_Defined in [packages/mobx-state-tree/src/core/node/livelinessChecking.ts:7](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/node/livelinessChecking.ts#L7)_

Defines what MST should do when running into reads / writes to objects that have died.

-   `"warn"`: Print a warning (default).
-   `"error"`: Throw an exception.
-   "`ignore`": Do nothing.

---

### OnReferenceInvalidated

Ƭ **OnReferenceInvalidated**: _function_

_Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:43](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/reference.ts#L43)_

#### Type declaration:

▸ (`event`: [OnReferenceInvalidatedEvent](index.md#onreferenceinvalidatedevent)‹STN›): _void_

**Parameters:**

| Name    | Type                                                                     |
| ------- | ------------------------------------------------------------------------ |
| `event` | [OnReferenceInvalidatedEvent](index.md#onreferenceinvalidatedevent)‹STN› |

---

### OnReferenceInvalidatedEvent

Ƭ **OnReferenceInvalidatedEvent**: _object_

_Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:34](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/reference.ts#L34)_

#### Type declaration:

---

### ReferenceIdentifier

Ƭ **ReferenceIdentifier**: _string | number_

_Defined in [packages/mobx-state-tree/src/types/utility-types/identifier.ts:142](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/identifier.ts#L142)_

Valid types for identifiers.

---

### ReferenceOptions

Ƭ **ReferenceOptions**: _[ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)‹IT› | [ReferenceOptionsOnInvalidated](interfaces/referenceoptionsoninvalidated.md)‹IT› | [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)‹IT› & [ReferenceOptionsOnInvalidated](interfaces/referenceoptionsoninvalidated.md)‹IT›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:473](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/reference.ts#L473)_

---

### SnapshotIn

Ƭ **SnapshotIn**: _T extends object ? T["CreationType"] : T extends IStateTreeNode<infer IT> ? IT["CreationType"] : T_

_Defined in [packages/mobx-state-tree/src/core/type/type.ts:232](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/type/type.ts#L232)_

The input (creation) snapshot representation of a given type.

---

### SnapshotOrInstance

Ƭ **SnapshotOrInstance**: _[SnapshotIn](index.md#snapshotin)‹T› | [Instance](index.md#instance)‹T›_

_Defined in [packages/mobx-state-tree/src/core/type/type.ts:273](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/type/type.ts#L273)_

A type which is equivalent to the union of SnapshotIn and Instance types of a given typeof TYPE or typeof VARIABLE.
For primitives it defaults to the primitive itself.

For example:

-   `SnapshotOrInstance<typeof ModelA> = SnapshotIn<typeof ModelA> | Instance<typeof ModelA>`
-   `SnapshotOrInstance<typeof self.a (where self.a is a ModelA)> = SnapshotIn<typeof ModelA> | Instance<typeof ModelA>`

Usually you might want to use this when your model has a setter action that sets a property.

Example:

```ts
const ModelA = types.model({
    n: types.number
})

const ModelB = types
    .model({
        innerModel: ModelA
    })
    .actions((self) => ({
        // this will accept as property both the snapshot and the instance, whichever is preferred
        setInnerModel(m: SnapshotOrInstance<typeof self.innerModel>) {
            self.innerModel = cast(m)
        }
    }))
```

---

### SnapshotOut

Ƭ **SnapshotOut**: _T extends object ? T["SnapshotType"] : T extends IStateTreeNode<infer IT> ? IT["SnapshotType"] : T_

_Defined in [packages/mobx-state-tree/src/core/type/type.ts:241](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/type/type.ts#L241)_

The output snapshot representation of a given type.

## Variables

### `Const` DatePrimitive

• **DatePrimitive**: _[IType](interfaces/itype.md)‹number | Date, number, Date›_ = \_DatePrimitive

_Defined in [packages/mobx-state-tree/src/types/primitives.ts:178](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/primitives.ts#L178)_

`types.Date` - Creates a type that can only contain a javascript Date value.

Example:

```ts
const LogLine = types.model({
    timestamp: types.Date
})

LogLine.create({ timestamp: new Date() })
```

---

### `Const` boolean

• **boolean**: _[ISimpleType](interfaces/isimpletype.md)‹boolean›_ = new CoreType<boolean, boolean, boolean>(
"boolean",
TypeFlags.Boolean,
(v) => typeof v === "boolean"
)

_Defined in [packages/mobx-state-tree/src/types/primitives.ts:132](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/primitives.ts#L132)_

`types.boolean` - Creates a type that can only contain a boolean value.
This type is used for boolean values by default

Example:

```ts
const Thing = types.model({
    isCool: types.boolean,
    isAwesome: false
})
```

---

### `Const` identifier

• **identifier**: _[ISimpleType](interfaces/isimpletype.md)‹string›_ = new IdentifierType()

_Defined in [packages/mobx-state-tree/src/types/utility-types/identifier.ts:110](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/identifier.ts#L110)_

`types.identifier` - Identifiers are used to make references, lifecycle events and reconciling works.
Inside a state tree, for each type can exist only one instance for each given identifier.
For example there couldn't be 2 instances of user with id 1. If you need more, consider using references.
Identifier can be used only as type property of a model.
This type accepts as parameter the value type of the identifier field that can be either string or number.

Example:

```ts
const Todo = types.model("Todo", {
    id: types.identifier,
    title: types.string
})
```

**`returns`**

---

### `Const` identifierNumber

• **identifierNumber**: _[ISimpleType](interfaces/isimpletype.md)‹number›_ = new IdentifierNumberType()

_Defined in [packages/mobx-state-tree/src/types/utility-types/identifier.ts:125](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/identifier.ts#L125)_

`types.identifierNumber` - Similar to `types.identifier`. This one will serialize from / to a number when applying snapshots

Example:

```ts
const Todo = types.model("Todo", {
    id: types.identifierNumber,
    title: types.string
})
```

**`returns`**

---

### `Const` integer

• **integer**: _[ISimpleType](interfaces/isimpletype.md)‹number›_ = new CoreType<number, number, number>(
"integer",
TypeFlags.Integer,
(v) => isInteger(v)
)

_Defined in [packages/mobx-state-tree/src/types/primitives.ts:113](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/primitives.ts#L113)_

`types.integer` - Creates a type that can only contain an integer value.
This type is used for integer values by default

Example:

```ts
const Size = types.model({
    width: types.integer,
    height: 10
})
```

---

### `Const` nullType

• **nullType**: _[ISimpleType](interfaces/isimpletype.md)‹null›_ = new CoreType<null, null, null>(
"null",
TypeFlags.Null,
(v) => v === null
)

_Defined in [packages/mobx-state-tree/src/types/primitives.ts:141](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/primitives.ts#L141)_

`types.null` - The type of the value `null`

---

### `Const` number

• **number**: _[ISimpleType](interfaces/isimpletype.md)‹number›_ = new CoreType<number, number, number>(
"number",
TypeFlags.Number,
(v) => typeof v === "number"
)

_Defined in [packages/mobx-state-tree/src/types/primitives.ts:94](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/primitives.ts#L94)_

`types.number` - Creates a type that can only contain a numeric value.
This type is used for numeric values by default

Example:

```ts
const Vector = types.model({
    x: types.number,
    y: 1.5
})
```

---

### `Const` string

• **string**: _[ISimpleType](interfaces/isimpletype.md)‹string›_ = new CoreType<string, string, string>(
"string",
TypeFlags.String,
(v) => typeof v === "string"
)

_Defined in [packages/mobx-state-tree/src/types/primitives.ts:75](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/primitives.ts#L75)_

`types.string` - Creates a type that can only contain a string value.
This type is used for string values by default

Example:

```ts
const Person = types.model({
    firstName: types.string,
    lastName: "Doe"
})
```

---

### `Const` undefinedType

• **undefinedType**: _[ISimpleType](interfaces/isimpletype.md)‹undefined›_ = new CoreType<undefined, undefined, undefined>(
"undefined",
TypeFlags.Undefined,
(v) => v === undefined
)

_Defined in [packages/mobx-state-tree/src/types/primitives.ts:150](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/primitives.ts#L150)_

`types.undefined` - The type of the value `undefined`

## Functions

### addDisposer

▸ **addDisposer**(`target`: IAnyStateTreeNode, `disposer`: [IDisposer](index.md#idisposer)): _[IDisposer](index.md#idisposer)_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:753](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L753)_

Use this utility to register a function that should be called whenever the
targeted state tree node is destroyed. This is a useful alternative to managing
cleanup methods yourself using the `beforeDestroy` hook.

This methods returns the same disposer that was passed as argument.

Example:

```ts
const Todo = types
    .model({
        title: types.string
    })
    .actions((self) => ({
        afterCreate() {
            const autoSaveDisposer = reaction(
                () => getSnapshot(self),
                (snapshot) => sendSnapshotToServerSomehow(snapshot)
            )
            // stop sending updates to server if this
            // instance is destroyed
            addDisposer(self, autoSaveDisposer)
        }
    }))
```

**Parameters:**

| Name       | Type                            |
| ---------- | ------------------------------- |
| `target`   | IAnyStateTreeNode               |
| `disposer` | [IDisposer](index.md#idisposer) |

**Returns:** _[IDisposer](index.md#idisposer)_

The same disposer that was passed as argument

---

### addMiddleware

▸ **addMiddleware**(`target`: IAnyStateTreeNode, `handler`: [IMiddlewareHandler](index.md#imiddlewarehandler), `includeHooks`: boolean): _[IDisposer](index.md#idisposer)_

_Defined in [packages/mobx-state-tree/src/core/action.ts:157](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/action.ts#L157)_

Middleware can be used to intercept any action is invoked on the subtree where it is attached.
If a tree is protected (by default), this means that any mutation of the tree will pass through your middleware.

For more details, see the [middleware docs](concepts/middleware.md)

**Parameters:**

| Name           | Type                                              | Default | Description                      |
| -------------- | ------------------------------------------------- | ------- | -------------------------------- |
| `target`       | IAnyStateTreeNode                                 | -       | Node to apply the middleware to. |
| `handler`      | [IMiddlewareHandler](index.md#imiddlewarehandler) | -       | -                                |
| `includeHooks` | boolean                                           | true    | -                                |

**Returns:** _[IDisposer](index.md#idisposer)_

A callable function to dispose the middleware.

---

### applyAction

▸ **applyAction**(`target`: IAnyStateTreeNode, `actions`: [ISerializedActionCall](interfaces/iserializedactioncall.md) | [ISerializedActionCall](interfaces/iserializedactioncall.md)[]): _void_

_Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:89](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/middlewares/on-action.ts#L89)_

Applies an action or a series of actions in a single MobX transaction.
Does not return any value
Takes an action description as produced by the `onAction` middleware.

**Parameters:**

| Name      | Type                                                                                                                               | Description |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `target`  | IAnyStateTreeNode                                                                                                                  | -           |
| `actions` | [ISerializedActionCall](interfaces/iserializedactioncall.md) &#124; [ISerializedActionCall](interfaces/iserializedactioncall.md)[] |             |

**Returns:** _void_

---

### applyPatch

▸ **applyPatch**(`target`: IAnyStateTreeNode, `patch`: [IJsonPatch](interfaces/ijsonpatch.md) | ReadonlyArray‹[IJsonPatch](interfaces/ijsonpatch.md)›): _void_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:126](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L126)_

Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied
See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details.

Can apply a single past, or an array of patches.

**Parameters:**

| Name     | Type                                                                                                |
| -------- | --------------------------------------------------------------------------------------------------- |
| `target` | IAnyStateTreeNode                                                                                   |
| `patch`  | [IJsonPatch](interfaces/ijsonpatch.md) &#124; ReadonlyArray‹[IJsonPatch](interfaces/ijsonpatch.md)› |

**Returns:** _void_

---

### applySnapshot

▸ **applySnapshot**<**C**>(`target`: IStateTreeNode‹[IType](interfaces/itype.md)‹C, any, any››, `snapshot`: C): _void_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:323](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L323)_

Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.

**Type parameters:**

▪ **C**

**Parameters:**

| Name       | Type                                                      |
| ---------- | --------------------------------------------------------- |
| `target`   | IStateTreeNode‹[IType](interfaces/itype.md)‹C, any, any›› |
| `snapshot` | C                                                         |

**Returns:** _void_

---

### array

▸ **array**<**IT**>(`subtype`: IT): _IArrayType‹IT›_

_Defined in [packages/mobx-state-tree/src/types/complex-types/array.ts:336](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/array.ts#L336)_

`types.array` - Creates an index based collection type who's children are all of a uniform declared type.

This type will always produce [observable arrays](https://mobx.js.org/refguide/array.html)

Example:

```ts
const Todo = types.model({
    task: types.string
})

const TodoStore = types.model({
    todos: types.array(Todo)
})

const s = TodoStore.create({ todos: [] })
unprotect(s) // needed to allow modifying outside of an action
s.todos.push({ task: "Grab coffee" })
console.log(s.todos[0]) // prints: "Grab coffee"
```

**Type parameters:**

▪ **IT**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

| Name      | Type |
| --------- | ---- |
| `subtype` | IT   |

**Returns:** _IArrayType‹IT›_

---

### cast

▸ **cast**<**O**>(`snapshotOrInstance`: O): _O_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:872](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L872)_

Casts a node snapshot or instance type to an instance type so it can be assigned to a type instance.
Note that this is just a cast for the type system, this is, it won't actually convert a snapshot to an instance,
but just fool typescript into thinking so.
Either way, casting when outside an assignation operation won't compile.

Example:

```ts
const ModelA = types
    .model({
        n: types.number
    })
    .actions((self) => ({
        setN(aNumber: number) {
            self.n = aNumber
        }
    }))

const ModelB = types
    .model({
        innerModel: ModelA
    })
    .actions((self) => ({
        someAction() {
            // this will allow the compiler to assign a snapshot to the property
            self.innerModel = cast({ a: 5 })
        }
    }))
```

**Type parameters:**

▪ **O**: _string | number | boolean | null | undefined_

**Parameters:**

| Name                 | Type | Description          |
| -------------------- | ---- | -------------------- |
| `snapshotOrInstance` | O    | Snapshot or instance |

**Returns:** _O_

The same object casted as an instance

▸ **cast**<**O**>(`snapshotOrInstance`: TypeOfValue<O>["CreationType"] | TypeOfValue<O>["SnapshotType"] | TypeOfValue<O>["Type"]): _O_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:875](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L875)_

Casts a node snapshot or instance type to an instance type so it can be assigned to a type instance.
Note that this is just a cast for the type system, this is, it won't actually convert a snapshot to an instance,
but just fool typescript into thinking so.
Either way, casting when outside an assignation operation won't compile.

Example:

```ts
const ModelA = types
    .model({
        n: types.number
    })
    .actions((self) => ({
        setN(aNumber: number) {
            self.n = aNumber
        }
    }))

const ModelB = types
    .model({
        innerModel: ModelA
    })
    .actions((self) => ({
        someAction() {
            // this will allow the compiler to assign a snapshot to the property
            self.innerModel = cast({ a: 5 })
        }
    }))
```

**Type parameters:**

▪ **O**

**Parameters:**

| Name                 | Type                                                                                               | Description          |
| -------------------- | -------------------------------------------------------------------------------------------------- | -------------------- |
| `snapshotOrInstance` | TypeOfValue<O>["CreationType"] &#124; TypeOfValue<O>["SnapshotType"] &#124; TypeOfValue<O>["Type"] | Snapshot or instance |

**Returns:** _O_

The same object casted as an instance

---

### castFlowReturn

▸ **castFlowReturn**<**T**>(`val`: T): _T_

_Defined in [packages/mobx-state-tree/src/core/flow.ts:33](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/flow.ts#L33)_

**`deprecated`** Not needed since TS3.6.
Used for TypeScript to make flows that return a promise return the actual promise result.

**Type parameters:**

▪ **T**

**Parameters:**

| Name  | Type |
| ----- | ---- |
| `val` | T    |

**Returns:** _T_

---

### castToReferenceSnapshot

▸ **castToReferenceSnapshot**<**I**>(`instance`: I): _Extract<I, IAnyStateTreeNode> extends never ? I : ReferenceIdentifier_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:975](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L975)_

Casts a node instance type to a reference snapshot type so it can be assigned to a refernence snapshot (e.g. to be used inside a create call).
Note that this is just a cast for the type system, this is, it won't actually convert an instance to a refererence snapshot,
but just fool typescript into thinking so.

Example:

```ts
const ModelA = types
    .model({
        id: types.identifier,
        n: types.number
    })
    .actions((self) => ({
        setN(aNumber: number) {
            self.n = aNumber
        }
    }))

const ModelB = types.model({
    refA: types.reference(ModelA)
})

const a = ModelA.create({ id: "someId", n: 5 })
// this will allow the compiler to use a model as if it were a reference snapshot
const b = ModelB.create({ refA: castToReference(a) })
```

**Type parameters:**

▪ **I**

**Parameters:**

| Name       | Type | Description |
| ---------- | ---- | ----------- |
| `instance` | I    | Instance    |

**Returns:** _Extract<I, IAnyStateTreeNode> extends never ? I : ReferenceIdentifier_

The same object casted as an reference snapshot (string or number)

---

### castToSnapshot

▸ **castToSnapshot**<**I**>(`snapshotOrInstance`: I): _Extract<I, IAnyStateTreeNode> extends never ? I : TypeOfValue<I>["CreationType"]_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:941](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L941)_

Casts a node instance type to an snapshot type so it can be assigned to a type snapshot (e.g. to be used inside a create call).
Note that this is just a cast for the type system, this is, it won't actually convert an instance to a snapshot,
but just fool typescript into thinking so.

Example:

```ts
const ModelA = types
    .model({
        n: types.number
    })
    .actions((self) => ({
        setN(aNumber: number) {
            self.n = aNumber
        }
    }))

const ModelB = types.model({
    innerModel: ModelA
})

const a = ModelA.create({ n: 5 })
// this will allow the compiler to use a model as if it were a snapshot
const b = ModelB.create({ innerModel: castToSnapshot(a) })
```

**Type parameters:**

▪ **I**

**Parameters:**

| Name                 | Type | Description          |
| -------------------- | ---- | -------------------- |
| `snapshotOrInstance` | I    | Snapshot or instance |

**Returns:** _Extract<I, IAnyStateTreeNode> extends never ? I : TypeOfValue<I>["CreationType"]_

The same object casted as an input (creation) snapshot

---

### clone

▸ **clone**<**T**>(`source`: T, `keepEnvironment`: boolean | any): _T_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:668](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L668)_

Returns a deep copy of the given state tree node as new tree.
Short hand for `snapshot(x) = getType(x).create(getSnapshot(x))`

_Tip: clone will create a literal copy, including the same identifiers. To modify identifiers etc during cloning, don't use clone but take a snapshot of the tree, modify it, and create new instance_

**Type parameters:**

▪ **T**: _IAnyStateTreeNode_

**Parameters:**

| Name              | Type               | Default | Description                                                                                                                                                                                                                      |
| ----------------- | ------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`          | T                  | -       | -                                                                                                                                                                                                                                |
| `keepEnvironment` | boolean &#124; any | true    | indicates whether the clone should inherit the same environment (`true`, the default), or not have an environment (`false`). If an object is passed in as second argument, that will act as the environment for the cloned tree. |

**Returns:** _T_

---

### compose

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›): _[IModelType](interfaces/imodeltype.md)‹PA & PB, OA & OB, \_CustomJoin‹FCA, FCB›, \_CustomJoin‹FSA, FSB››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:763](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L763)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

**Parameters:**

| Name   | Type                                                     |
| ------ | -------------------------------------------------------- |
| `name` | string                                                   |
| `A`    | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`    | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB, OA & OB, \_CustomJoin‹FCA, FCB›, \_CustomJoin‹FSA, FSB››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›): _[IModelType](interfaces/imodeltype.md)‹PA & PB, OA & OB, \_CustomJoin‹FCA, FCB›, \_CustomJoin‹FSA, FSB››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:765](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L765)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB, OA & OB, \_CustomJoin‹FCA, FCB›, \_CustomJoin‹FSA, FSB››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›): _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC, OA & OB & OC, \_CustomJoin‹FCA, \_CustomJoin‹FCB, FCC››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, FSC›››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:767](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L767)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

**Parameters:**

| Name   | Type                                                     |
| ------ | -------------------------------------------------------- |
| `name` | string                                                   |
| `A`    | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`    | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`    | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC, OA & OB & OC, \_CustomJoin‹FCA, \_CustomJoin‹FCB, FCC››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, FSC›››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›): _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC, OA & OB & OC, \_CustomJoin‹FCA, \_CustomJoin‹FCB, FCC››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, FSC›››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:769](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L769)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`  | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC, OA & OB & OC, \_CustomJoin‹FCA, \_CustomJoin‹FCB, FCC››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, FSC›››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›): _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD, OA & OB & OC & OD, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, FCD›››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, FSD››››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:771](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L771)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

**Parameters:**

| Name   | Type                                                     |
| ------ | -------------------------------------------------------- |
| `name` | string                                                   |
| `A`    | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`    | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`    | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`    | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD, OA & OB & OC & OD, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, FCD›››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, FSD››››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›): _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD, OA & OB & OC & OD, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, FCD›››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, FSD››››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:773](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L773)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`  | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`  | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD, OA & OB & OC & OD, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, FCD›››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, FSD››››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›): _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, FCE››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, FSE›››››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:775](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L775)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

**Parameters:**

| Name   | Type                                                     |
| ------ | -------------------------------------------------------- |
| `name` | string                                                   |
| `A`    | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`    | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`    | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`    | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`    | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, FCE››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, FSE›››››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›): _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, FCE››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, FSE›››››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:777](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L777)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`  | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`  | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`  | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, FCE››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, FSE›››››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›): _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, FCF›››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, FSF››››››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:781](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L781)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

**Parameters:**

| Name   | Type                                                     |
| ------ | -------------------------------------------------------- |
| `name` | string                                                   |
| `A`    | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`    | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`    | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`    | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`    | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`    | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, FCF›››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, FSF››››››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›): _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, FCF›››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, FSF››››››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:784](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L784)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`  | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`  | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`  | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`  | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, FCF›››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, FSF››››››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›): _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, \_CustomJoin‹FCF, FCG››››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, \_CustomJoin‹FSF, FSG›››››››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:787](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L787)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: _ModelProperties_

▪ **OG**

▪ **FCG**

▪ **FSG**

**Parameters:**

| Name   | Type                                                     |
| ------ | -------------------------------------------------------- |
| `name` | string                                                   |
| `A`    | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`    | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`    | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`    | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`    | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`    | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
| `G`    | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, \_CustomJoin‹FCF, FCG››››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, \_CustomJoin‹FSF, FSG›››››››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›): _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, \_CustomJoin‹FCF, FCG››››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, \_CustomJoin‹FSF, FSG›››››››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:790](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L790)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: _ModelProperties_

▪ **OG**

▪ **FCG**

▪ **FSG**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`  | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`  | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`  | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`  | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
| `G`  | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, \_CustomJoin‹FCF, FCG››››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, \_CustomJoin‹FSF, FSG›››››››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›, `H`: [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH›): _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, \_CustomJoin‹FCF, \_CustomJoin‹FCG, FCH›››››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, \_CustomJoin‹FSF, \_CustomJoin‹FSG, FSH››››››››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:793](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L793)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: _ModelProperties_

▪ **OG**

▪ **FCG**

▪ **FSG**

▪ **PH**: _ModelProperties_

▪ **OH**

▪ **FCH**

▪ **FSH**

**Parameters:**

| Name   | Type                                                     |
| ------ | -------------------------------------------------------- |
| `name` | string                                                   |
| `A`    | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`    | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`    | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`    | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`    | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`    | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
| `G`    | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |
| `H`    | [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, \_CustomJoin‹FCF, \_CustomJoin‹FCG, FCH›››››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, \_CustomJoin‹FSF, \_CustomJoin‹FSG, FSH››››››››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›, `H`: [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH›): _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, \_CustomJoin‹FCF, \_CustomJoin‹FCG, FCH›››››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, \_CustomJoin‹FSF, \_CustomJoin‹FSG, FSH››››››››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:796](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L796)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: _ModelProperties_

▪ **OG**

▪ **FCG**

▪ **FSG**

▪ **PH**: _ModelProperties_

▪ **OH**

▪ **FCH**

▪ **FSH**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`  | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`  | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`  | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`  | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
| `G`  | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |
| `H`  | [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, \_CustomJoin‹FCF, \_CustomJoin‹FCG, FCH›››››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, \_CustomJoin‹FSF, \_CustomJoin‹FSG, FSH››››››››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**, **PI**, **OI**, **FCI**, **FSI**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›, `H`: [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH›, `I`: [IModelType](interfaces/imodeltype.md)‹PI, OI, FCI, FSI›): _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, \_CustomJoin‹FCF, \_CustomJoin‹FCG, \_CustomJoin‹FCH, FCI››››››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, \_CustomJoin‹FSF, \_CustomJoin‹FSG, \_CustomJoin‹FSH, FSI›››››››››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:799](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L799)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: _ModelProperties_

▪ **OG**

▪ **FCG**

▪ **FSG**

▪ **PH**: _ModelProperties_

▪ **OH**

▪ **FCH**

▪ **FSH**

▪ **PI**: _ModelProperties_

▪ **OI**

▪ **FCI**

▪ **FSI**

**Parameters:**

| Name   | Type                                                     |
| ------ | -------------------------------------------------------- |
| `name` | string                                                   |
| `A`    | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`    | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`    | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`    | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`    | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`    | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
| `G`    | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |
| `H`    | [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH› |
| `I`    | [IModelType](interfaces/imodeltype.md)‹PI, OI, FCI, FSI› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, \_CustomJoin‹FCF, \_CustomJoin‹FCG, \_CustomJoin‹FCH, FCI››››››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, \_CustomJoin‹FSF, \_CustomJoin‹FSG, \_CustomJoin‹FSH, FSI›››››››››_

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**, **PI**, **OI**, **FCI**, **FSI**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›, `H`: [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH›, `I`: [IModelType](interfaces/imodeltype.md)‹PI, OI, FCI, FSI›): _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, \_CustomJoin‹FCF, \_CustomJoin‹FCG, \_CustomJoin‹FCH, FCI››››››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, \_CustomJoin‹FSF, \_CustomJoin‹FSG, \_CustomJoin‹FSH, FSI›››››››››_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:802](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L802)_

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: _ModelProperties_

▪ **OG**

▪ **FCG**

▪ **FSG**

▪ **PH**: _ModelProperties_

▪ **OH**

▪ **FCH**

▪ **FSH**

▪ **PI**: _ModelProperties_

▪ **OI**

▪ **FCI**

▪ **FSI**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`  | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`  | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`  | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`  | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
| `G`  | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |
| `H`  | [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH› |
| `I`  | [IModelType](interfaces/imodeltype.md)‹PI, OI, FCI, FSI› |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, \_CustomJoin‹FCA, \_CustomJoin‹FCB, \_CustomJoin‹FCC, \_CustomJoin‹FCD, \_CustomJoin‹FCE, \_CustomJoin‹FCF, \_CustomJoin‹FCG, \_CustomJoin‹FCH, FCI››››››››, \_CustomJoin‹FSA, \_CustomJoin‹FSB, \_CustomJoin‹FSC, \_CustomJoin‹FSD, \_CustomJoin‹FSE, \_CustomJoin‹FSF, \_CustomJoin‹FSG, \_CustomJoin‹FSH, FSI›››››››››_

---

### createActionTrackingMiddleware

▸ **createActionTrackingMiddleware**<**T**>(`hooks`: [IActionTrackingMiddlewareHooks](interfaces/iactiontrackingmiddlewarehooks.md)‹T›): _[IMiddlewareHandler](index.md#imiddlewarehandler)_

_Defined in [packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts:28](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts#L28)_

Note: Consider migrating to `createActionTrackingMiddleware2`, it is easier to use.

Convenience utility to create action based middleware that supports async processes more easily.
All hooks are called for both synchronous and asynchronous actions. Except that either `onSuccess` or `onFail` is called

The create middleware tracks the process of an action (assuming it passes the `filter`).
`onResume` can return any value, which will be passed as second argument to any other hook. This makes it possible to keep state during a process.

See the `atomic` middleware for an example

**Type parameters:**

▪ **T**

**Parameters:**

| Name    | Type                                                                              |
| ------- | --------------------------------------------------------------------------------- |
| `hooks` | [IActionTrackingMiddlewareHooks](interfaces/iactiontrackingmiddlewarehooks.md)‹T› |

**Returns:** _[IMiddlewareHandler](index.md#imiddlewarehandler)_

---

### createActionTrackingMiddleware2

▸ **createActionTrackingMiddleware2**<**TEnv**>(`middlewareHooks`: [IActionTrackingMiddleware2Hooks](interfaces/iactiontrackingmiddleware2hooks.md)‹TEnv›): _[IMiddlewareHandler](index.md#imiddlewarehandler)_

_Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:74](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L74)_

Convenience utility to create action based middleware that supports async processes more easily.
The flow is like this:

-   for each action: if filter passes -> `onStart` -> (inner actions recursively) -> `onFinish`

Example: if we had an action `a` that called inside an action `b1`, then `b2` the flow would be:

-   `filter(a)`
-   `onStart(a)`
    -   `filter(b1)`
    -   `onStart(b1)`
    -   `onFinish(b1)`
    -   `filter(b2)`
    -   `onStart(b2)`
    -   `onFinish(b2)`
-   `onFinish(a)`

The flow is the same no matter if the actions are sync or async.

See the `atomic` middleware for an example

**Type parameters:**

▪ **TEnv**

**Parameters:**

| Name              | Type                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------- |
| `middlewareHooks` | [IActionTrackingMiddleware2Hooks](interfaces/iactiontrackingmiddleware2hooks.md)‹TEnv› |

**Returns:** _[IMiddlewareHandler](index.md#imiddlewarehandler)_

---

### custom

▸ **custom**<**S**, **T**>(`options`: [CustomTypeOptions](interfaces/customtypeoptions.md)‹S, T›): _[IType](interfaces/itype.md)‹S | T, S, T›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/custom.ts:74](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/custom.ts#L74)_

`types.custom` - Creates a custom type. Custom types can be used for arbitrary immutable values, that have a serializable representation. For example, to create your own Date representation, Decimal type etc.

The signature of the options is:

```ts
export interface CustomTypeOptions<S, T> {
    // Friendly name
    name: string
    // given a serialized value and environment, how to turn it into the target type
    fromSnapshot(snapshot: S, env: any): T
    // return the serialization of the current value
    toSnapshot(value: T): S
    // if true, this is a converted value, if false, it's a snapshot
    isTargetType(value: T | S): value is T
    // a non empty string is assumed to be a validation error
    getValidationMessage?(snapshot: S): string
}
```

Example:

```ts
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
    getValidationMessage(value: string): string {
        if (/^-?\d+\.\d+$/.test(value)) return "" // OK
        return `'${value}' doesn't look like a valid decimal number`
    }
})

const Wallet = types.model({
    balance: DecimalPrimitive
})
```

**Type parameters:**

▪ **S**

▪ **T**

**Parameters:**

| Name      | Type                                                       |
| --------- | ---------------------------------------------------------- |
| `options` | [CustomTypeOptions](interfaces/customtypeoptions.md)‹S, T› |

**Returns:** _[IType](interfaces/itype.md)‹S | T, S, T›_

---

### decorate

▸ **decorate**<**T**>(`handler`: [IMiddlewareHandler](index.md#imiddlewarehandler), `fn`: T, `includeHooks`: boolean): _T_

_Defined in [packages/mobx-state-tree/src/core/action.ts:196](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/action.ts#L196)_

Binds middleware to a specific action.

Example:

```ts
type.actions((self) => {
    function takeA____() {
        self.toilet.donate()
        self.wipe()
        self.wipe()
        self.toilet.flush()
    }
    return {
        takeA____: decorate(atomic, takeA____)
    }
})
```

**Type parameters:**

▪ **T**: _Function_

**Parameters:**

| Name           | Type                                              | Default |
| -------------- | ------------------------------------------------- | ------- |
| `handler`      | [IMiddlewareHandler](index.md#imiddlewarehandler) | -       |
| `fn`           | T                                                 | -       |
| `includeHooks` | boolean                                           | true    |

**Returns:** _T_

The original function

---

### destroy

▸ **destroy**(`target`: IAnyStateTreeNode): _void_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:700](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L700)_

Removes a model element from the state tree, and mark it as end-of-life; the element should not be used anymore

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `target` | IAnyStateTreeNode |

**Returns:** _void_

---

### detach

▸ **detach**<**T**>(`target`: T): _T_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:689](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L689)_

Removes a model element from the state tree, and let it live on as a new state tree

**Type parameters:**

▪ **T**: _IAnyStateTreeNode_

**Parameters:**

| Name     | Type |
| -------- | ---- |
| `target` | T    |

**Returns:** _T_

---

### enumeration

▸ **enumeration**<**T**>(`options`: T[]): _[ISimpleType](interfaces/isimpletype.md)‹UnionStringArray‹T[]››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/enumeration.ts:11](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/enumeration.ts#L11)_

`types.enumeration` - Can be used to create an string based enumeration.
(note: this methods is just sugar for a union of string literals)

Example:

```ts
const TrafficLight = types.model({
    color: types.enumeration("Color", ["Red", "Orange", "Green"])
})
```

**Type parameters:**

▪ **T**: _string_

**Parameters:**

| Name      | Type | Description                               |
| --------- | ---- | ----------------------------------------- |
| `options` | T[]  | possible values this enumeration can have |

**Returns:** _[ISimpleType](interfaces/isimpletype.md)‹UnionStringArray‹T[]››_

▸ **enumeration**<**T**>(`name`: string, `options`: T[]): _[ISimpleType](interfaces/isimpletype.md)‹UnionStringArray‹T[]››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/enumeration.ts:12](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/enumeration.ts#L12)_

`types.enumeration` - Can be used to create an string based enumeration.
(note: this methods is just sugar for a union of string literals)

Example:

```ts
const TrafficLight = types.model({
    color: types.enumeration("Color", ["Red", "Orange", "Green"])
})
```

**Type parameters:**

▪ **T**: _string_

**Parameters:**

| Name      | Type   | Description                                    |
| --------- | ------ | ---------------------------------------------- |
| `name`    | string | descriptive name of the enumeration (optional) |
| `options` | T[]    | possible values this enumeration can have      |

**Returns:** _[ISimpleType](interfaces/isimpletype.md)‹UnionStringArray‹T[]››_

---

### escapeJsonPath

▸ **escapeJsonPath**(`path`: string): _string_

_Defined in [packages/mobx-state-tree/src/core/json-patch.ts:77](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/json-patch.ts#L77)_

Escape slashes and backslashes.

http://tools.ietf.org/html/rfc6901

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `path` | string |

**Returns:** _string_

---

### flow

▸ **flow**<**R**, **Args**>(`generator`: function): _function_

_Defined in [packages/mobx-state-tree/src/core/flow.ts:20](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/flow.ts#L20)_

See [asynchronous actions](concepts/async-actions.md).

**Type parameters:**

▪ **R**

▪ **Args**: _any[]_

**Parameters:**

▪ **generator**: _function_

▸ (...`args`: Args): _Generator‹Promise‹any›, R, any›_

**Parameters:**

| Name      | Type |
| --------- | ---- |
| `...args` | Args |

**Returns:** _function_

The flow as a promise.

▸ (...`args`: Args): _Promise‹FlowReturn‹R››_

**Parameters:**

| Name      | Type |
| --------- | ---- |
| `...args` | Args |

---

### frozen

▸ **frozen**<**C**>(`subType`: [IType](interfaces/itype.md)‹C, any, any›): _[IType](interfaces/itype.md)‹C, C, C›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/frozen.ts:58](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/frozen.ts#L58)_

`types.frozen` - Frozen can be used to store any value that is serializable in itself (that is valid JSON).
Frozen values need to be immutable or treated as if immutable. They need be serializable as well.
Values stored in frozen will snapshotted as-is by MST, and internal changes will not be tracked.

This is useful to store complex, but immutable values like vectors etc. It can form a powerful bridge to parts of your application that should be immutable, or that assume data to be immutable.

Note: if you want to store free-form state that is mutable, or not serializeable, consider using volatile state instead.

Frozen properties can be defined in three different ways

1. `types.frozen(SubType)` - provide a valid MST type and frozen will check if the provided data conforms the snapshot for that type
2. `types.frozen({ someDefaultValue: true})` - provide a primitive value, object or array, and MST will infer the type from that object, and also make it the default value for the field
3. `types.frozen<TypeScriptType>()` - provide a typescript type, to help in strongly typing the field (design time only)

Example:

```ts
const GameCharacter = types.model({
    name: string,
    location: types.frozen({ x: 0, y: 0 })
})

const hero = GameCharacter.create({
    name: "Mario",
    location: { x: 7, y: 4 }
})

hero.location = { x: 10, y: 2 } // OK
hero.location.x = 7 // Not ok!
```

```ts
type Point = { x: number; y: number }
const Mouse = types.model({
    loc: types.frozen<Point>()
})
```

**Type parameters:**

▪ **C**

**Parameters:**

| Name      | Type                                      |
| --------- | ----------------------------------------- |
| `subType` | [IType](interfaces/itype.md)‹C, any, any› |

**Returns:** _[IType](interfaces/itype.md)‹C, C, C›_

▸ **frozen**<**T**>(`defaultValue`: T): _[IType](interfaces/itype.md)‹T | undefined | null, T, T›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/frozen.ts:59](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/frozen.ts#L59)_

`types.frozen` - Frozen can be used to store any value that is serializable in itself (that is valid JSON).
Frozen values need to be immutable or treated as if immutable. They need be serializable as well.
Values stored in frozen will snapshotted as-is by MST, and internal changes will not be tracked.

This is useful to store complex, but immutable values like vectors etc. It can form a powerful bridge to parts of your application that should be immutable, or that assume data to be immutable.

Note: if you want to store free-form state that is mutable, or not serializeable, consider using volatile state instead.

Frozen properties can be defined in three different ways

1. `types.frozen(SubType)` - provide a valid MST type and frozen will check if the provided data conforms the snapshot for that type
2. `types.frozen({ someDefaultValue: true})` - provide a primitive value, object or array, and MST will infer the type from that object, and also make it the default value for the field
3. `types.frozen<TypeScriptType>()` - provide a typescript type, to help in strongly typing the field (design time only)

Example:

```ts
const GameCharacter = types.model({
    name: string,
    location: types.frozen({ x: 0, y: 0 })
})

const hero = GameCharacter.create({
    name: "Mario",
    location: { x: 7, y: 4 }
})

hero.location = { x: 10, y: 2 } // OK
hero.location.x = 7 // Not ok!
```

```ts
type Point = { x: number; y: number }
const Mouse = types.model({
    loc: types.frozen<Point>()
})
```

**Type parameters:**

▪ **T**

**Parameters:**

| Name           | Type |
| -------------- | ---- |
| `defaultValue` | T    |

**Returns:** _[IType](interfaces/itype.md)‹T | undefined | null, T, T›_

▸ **frozen**<**T**>(): _[IType](interfaces/itype.md)‹T, T, T›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/frozen.ts:60](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/frozen.ts#L60)_

`types.frozen` - Frozen can be used to store any value that is serializable in itself (that is valid JSON).
Frozen values need to be immutable or treated as if immutable. They need be serializable as well.
Values stored in frozen will snapshotted as-is by MST, and internal changes will not be tracked.

This is useful to store complex, but immutable values like vectors etc. It can form a powerful bridge to parts of your application that should be immutable, or that assume data to be immutable.

Note: if you want to store free-form state that is mutable, or not serializeable, consider using volatile state instead.

Frozen properties can be defined in three different ways

1. `types.frozen(SubType)` - provide a valid MST type and frozen will check if the provided data conforms the snapshot for that type
2. `types.frozen({ someDefaultValue: true})` - provide a primitive value, object or array, and MST will infer the type from that object, and also make it the default value for the field
3. `types.frozen<TypeScriptType>()` - provide a typescript type, to help in strongly typing the field (design time only)

Example:

```ts
const GameCharacter = types.model({
    name: string,
    location: types.frozen({ x: 0, y: 0 })
})

const hero = GameCharacter.create({
    name: "Mario",
    location: { x: 7, y: 4 }
})

hero.location = { x: 10, y: 2 } // OK
hero.location.x = 7 // Not ok!
```

```ts
type Point = { x: number; y: number }
const Mouse = types.model({
    loc: types.frozen<Point>()
})
```

**Type parameters:**

▪ **T**

**Returns:** _[IType](interfaces/itype.md)‹T, T, T›_

---

### getChildType

▸ **getChildType**(`object`: IAnyStateTreeNode, `propertyName?`: undefined | string): _[IAnyType](interfaces/ianytype.md)_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:70](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L70)_

Returns the _declared_ type of the given sub property of an object, array or map.
In the case of arrays and maps the property name is optional and will be ignored.

Example:

```ts
const Box = types.model({ x: 0, y: 0 })
const box = Box.create()

console.log(getChildType(box, "x").name) // 'number'
```

**Parameters:**

| Name            | Type                    |
| --------------- | ----------------------- |
| `object`        | IAnyStateTreeNode       |
| `propertyName?` | undefined &#124; string |

**Returns:** _[IAnyType](interfaces/ianytype.md)_

---

### getEnv

▸ **getEnv**<**T**>(`target`: IAnyStateTreeNode): _T_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:775](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L775)_

Returns the environment of the current state tree. For more info on environments,
see [Dependency injection](https://github.com/mobxjs/mobx-state-tree#dependency-injection)

Please note that in child nodes access to the root is only possible
once the `afterAttach` hook has fired

Returns an empty environment if the tree wasn't initialized with an environment

**Type parameters:**

▪ **T**

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `target` | IAnyStateTreeNode |

**Returns:** _T_

---

### getIdentifier

▸ **getIdentifier**(`target`: IAnyStateTreeNode): _string | null_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:551](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L551)_

Returns the identifier of the target node.
This is the _string normalized_ identifier, which might not match the type of the identifier attribute

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `target` | IAnyStateTreeNode |

**Returns:** _string | null_

---

### getLivelinessChecking

▸ **getLivelinessChecking**(): _[LivelinessMode](index.md#livelinessmode)_

_Defined in [packages/mobx-state-tree/src/core/node/livelinessChecking.ts:27](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/node/livelinessChecking.ts#L27)_

Returns the current liveliness checking mode.

**Returns:** _[LivelinessMode](index.md#livelinessmode)_

`"warn"`, `"error"` or `"ignore"`

---

### getMembers

▸ **getMembers**(`target`: IAnyStateTreeNode): _[IModelReflectionData](interfaces/imodelreflectiondata.md)_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:846](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L846)_

Returns a reflection of the model node, including name, properties, views, volatile and actions.

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `target` | IAnyStateTreeNode |

**Returns:** _[IModelReflectionData](interfaces/imodelreflectiondata.md)_

---

### getNodeId

▸ **getNodeId**(`target`: IAnyStateTreeNode): _number_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:990](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L990)_

Returns the unique node id (not to be confused with the instance identifier) for a
given instance.
This id is a number that is unique for each instance.

**`export`**

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `target` | IAnyStateTreeNode |

**Returns:** _number_

---

### getParent

▸ **getParent**<**IT**>(`target`: IAnyStateTreeNode, `depth`: number): _TypeOrStateTreeNodeToStateTreeNode‹IT›_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:384](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L384)_

Returns the immediate parent of this object, or throws.

Note that the immediate parent can be either an object, map or array, and
doesn't necessarily refer to the parent model.

Please note that in child nodes access to the root is only possible
once the `afterAttach` hook has fired.

**Type parameters:**

▪ **IT**: _IAnyStateTreeNode | [IAnyComplexType](interfaces/ianycomplextype.md)_

**Parameters:**

| Name     | Type              | Default | Description                                  |
| -------- | ----------------- | ------- | -------------------------------------------- |
| `target` | IAnyStateTreeNode | -       | -                                            |
| `depth`  | number            | 1       | How far should we look upward? 1 by default. |

**Returns:** _TypeOrStateTreeNodeToStateTreeNode‹IT›_

---

### getParentOfType

▸ **getParentOfType**<**IT**>(`target`: IAnyStateTreeNode, `type`: IT): _IT["Type"]_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:428](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L428)_

Returns the target's parent of a given type, or throws.

**Type parameters:**

▪ **IT**: _[IAnyComplexType](interfaces/ianycomplextype.md)_

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `target` | IAnyStateTreeNode |
| `type`   | IT                |

**Returns:** _IT["Type"]_

---

### getPath

▸ **getPath**(`target`: IAnyStateTreeNode): _string_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:468](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L468)_

Returns the path of the given object in the model tree

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `target` | IAnyStateTreeNode |

**Returns:** _string_

---

### getPathParts

▸ **getPathParts**(`target`: IAnyStateTreeNode): _string[]_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:481](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L481)_

Returns the path of the given object as unescaped string array.

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `target` | IAnyStateTreeNode |

**Returns:** _string[]_

---

### getPropertyMembers

▸ **getPropertyMembers**(`typeOrNode`: [IAnyModelType](interfaces/ianymodeltype.md) | IAnyStateTreeNode): _[IModelReflectionPropertiesData](interfaces/imodelreflectionpropertiesdata.md)_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:815](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L815)_

Returns a reflection of the model type properties and name for either a model type or model node.

**Parameters:**

| Name         | Type                                                                  |
| ------------ | --------------------------------------------------------------------- |
| `typeOrNode` | [IAnyModelType](interfaces/ianymodeltype.md) &#124; IAnyStateTreeNode |

**Returns:** _[IModelReflectionPropertiesData](interfaces/imodelreflectionpropertiesdata.md)_

---

### getRelativePath

▸ **getRelativePath**(`base`: IAnyStateTreeNode, `target`: IAnyStateTreeNode): _string_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:650](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L650)_

Given two state tree nodes that are part of the same tree,
returns the shortest jsonpath needed to navigate from the one to the other

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `base`   | IAnyStateTreeNode |
| `target` | IAnyStateTreeNode |

**Returns:** _string_

---

### getRoot

▸ **getRoot**<**IT**>(`target`: IAnyStateTreeNode): _TypeOrStateTreeNodeToStateTreeNode‹IT›_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:453](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L453)_

Given an object in a model tree, returns the root object of that tree.

Please note that in child nodes access to the root is only possible
once the `afterAttach` hook has fired.

**Type parameters:**

▪ **IT**: _[IAnyComplexType](interfaces/ianycomplextype.md) | IAnyStateTreeNode_

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `target` | IAnyStateTreeNode |

**Returns:** _TypeOrStateTreeNodeToStateTreeNode‹IT›_

---

### getRunningActionContext

▸ **getRunningActionContext**(): _[IActionContext](interfaces/iactioncontext.md) | undefined_

_Defined in [packages/mobx-state-tree/src/core/actionContext.ts:26](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/actionContext.ts#L26)_

Returns the currently executing MST action context, or undefined if none.

**Returns:** _[IActionContext](interfaces/iactioncontext.md) | undefined_

---

### getSnapshot

▸ **getSnapshot**<**S**>(`target`: IStateTreeNode‹[IType](interfaces/itype.md)‹any, S, any››, `applyPostProcess`: boolean): _S_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:338](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L338)_

Calculates a snapshot from the given model instance. The snapshot will always reflect the latest state but use
structural sharing where possible. Doesn't require MobX transactions to be completed.

**Type parameters:**

▪ **S**

**Parameters:**

| Name               | Type                                                      | Default | Description                                                  |
| ------------------ | --------------------------------------------------------- | ------- | ------------------------------------------------------------ |
| `target`           | IStateTreeNode‹[IType](interfaces/itype.md)‹any, S, any›› | -       | -                                                            |
| `applyPostProcess` | boolean                                                   | true    | If true (the default) then postProcessSnapshot gets applied. |

**Returns:** _S_

---

### getType

▸ **getType**(`object`: IAnyStateTreeNode): _[IAnyComplexType](interfaces/ianycomplextype.md)_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:48](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L48)_

Returns the _actual_ type of the given tree node. (Or throws)

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `object` | IAnyStateTreeNode |

**Returns:** _[IAnyComplexType](interfaces/ianycomplextype.md)_

---

### hasParent

▸ **hasParent**(`target`: IAnyStateTreeNode, `depth`: number): _boolean_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:358](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L358)_

Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array.

**Parameters:**

| Name     | Type              | Default | Description                                  |
| -------- | ----------------- | ------- | -------------------------------------------- |
| `target` | IAnyStateTreeNode | -       | -                                            |
| `depth`  | number            | 1       | How far should we look upward? 1 by default. |

**Returns:** _boolean_

---

### hasParentOfType

▸ **hasParentOfType**(`target`: IAnyStateTreeNode, `type`: [IAnyComplexType](interfaces/ianycomplextype.md)): _boolean_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:408](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L408)_

Given a model instance, returns `true` if the object has a parent of given type, that is, is part of another object, map or array

**Parameters:**

| Name     | Type                                             |
| -------- | ------------------------------------------------ |
| `target` | IAnyStateTreeNode                                |
| `type`   | [IAnyComplexType](interfaces/ianycomplextype.md) |

**Returns:** _boolean_

---

### isActionContextChildOf

▸ **isActionContextChildOf**(`actionContext`: [IActionContext](interfaces/iactioncontext.md), `parent`: number | [IActionContext](interfaces/iactioncontext.md) | [IMiddlewareEvent](interfaces/imiddlewareevent.md)): _boolean_

_Defined in [packages/mobx-state-tree/src/core/actionContext.ts:56](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/actionContext.ts#L56)_

Returns if the given action context is a parent of this action context.

**Parameters:**

| Name            | Type                                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `actionContext` | [IActionContext](interfaces/iactioncontext.md)                                                                         |
| `parent`        | number &#124; [IActionContext](interfaces/iactioncontext.md) &#124; [IMiddlewareEvent](interfaces/imiddlewareevent.md) |

**Returns:** _boolean_

---

### isActionContextThisOrChildOf

▸ **isActionContextThisOrChildOf**(`actionContext`: [IActionContext](interfaces/iactioncontext.md), `parentOrThis`: number | [IActionContext](interfaces/iactioncontext.md) | [IMiddlewareEvent](interfaces/imiddlewareevent.md)): _boolean_

_Defined in [packages/mobx-state-tree/src/core/actionContext.ts:66](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/actionContext.ts#L66)_

Returns if the given action context is this or a parent of this action context.

**Parameters:**

| Name            | Type                                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `actionContext` | [IActionContext](interfaces/iactioncontext.md)                                                                         |
| `parentOrThis`  | number &#124; [IActionContext](interfaces/iactioncontext.md) &#124; [IMiddlewareEvent](interfaces/imiddlewareevent.md) |

**Returns:** _boolean_

---

### isAlive

▸ **isAlive**(`target`: IAnyStateTreeNode): _boolean_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:718](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L718)_

Returns true if the given state tree node is not killed yet.
This means that the node is still a part of a tree, and that `destroy`
has not been called. If a node is not alive anymore, the only thing one can do with it
is requesting it's last path and snapshot

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `target` | IAnyStateTreeNode |

**Returns:** _boolean_

---

### isArrayType

▸ **isArrayType**<**Items**>(`type`: [IAnyType](interfaces/ianytype.md)): _type is IArrayType<Items>_

_Defined in [packages/mobx-state-tree/src/types/complex-types/array.ts:496](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/array.ts#L496)_

Returns if a given value represents an array type.

**Type parameters:**

▪ **Items**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

| Name   | Type                               |
| ------ | ---------------------------------- |
| `type` | [IAnyType](interfaces/ianytype.md) |

**Returns:** _type is IArrayType<Items>_

`true` if the type is an array type.

---

### isFrozenType

▸ **isFrozenType**<**IT**, **T**>(`type`: IT): _type is IT_

_Defined in [packages/mobx-state-tree/src/types/utility-types/frozen.ts:113](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/frozen.ts#L113)_

Returns if a given value represents a frozen type.

**Type parameters:**

▪ **IT**: _[IType](interfaces/itype.md)‹T | any, T, T›_

▪ **T**

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `type` | IT   |

**Returns:** _type is IT_

---

### isIdentifierType

▸ **isIdentifierType**<**IT**>(`type`: IT): _type is IT_

_Defined in [packages/mobx-state-tree/src/types/utility-types/identifier.ts:133](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/identifier.ts#L133)_

Returns if a given value represents an identifier type.

**Type parameters:**

▪ **IT**: _[ISimpleType](interfaces/isimpletype.md) | [ISimpleType](interfaces/isimpletype.md)_

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `type` | IT   |

**Returns:** _type is IT_

---

### isLateType

▸ **isLateType**<**IT**>(`type`: IT): _type is IT_

_Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:141](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/late.ts#L141)_

Returns if a given value represents a late type.

**Type parameters:**

▪ **IT**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `type` | IT   |

**Returns:** _type is IT_

---

### isLiteralType

▸ **isLiteralType**<**IT**>(`type`: IT): _type is IT_

_Defined in [packages/mobx-state-tree/src/types/utility-types/literal.ts:86](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/literal.ts#L86)_

Returns if a given value represents a literal type.

**Type parameters:**

▪ **IT**: _[ISimpleType](interfaces/isimpletype.md)‹any›_

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `type` | IT   |

**Returns:** _type is IT_

---

### isMapType

▸ **isMapType**<**Items**>(`type`: [IAnyType](interfaces/ianytype.md)): _type is IMapType<Items>_

_Defined in [packages/mobx-state-tree/src/types/complex-types/map.ts:527](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/map.ts#L527)_

Returns if a given value represents a map type.

**Type parameters:**

▪ **Items**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

| Name   | Type                               |
| ------ | ---------------------------------- |
| `type` | [IAnyType](interfaces/ianytype.md) |

**Returns:** _type is IMapType<Items>_

`true` if it is a map type.

---

### isModelType

▸ **isModelType**<**IT**>(`type`: [IAnyType](interfaces/ianytype.md)): _type is IT_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:848](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L848)_

Returns if a given value represents a model type.

**Type parameters:**

▪ **IT**: _[IAnyModelType](interfaces/ianymodeltype.md)_

**Parameters:**

| Name   | Type                               |
| ------ | ---------------------------------- |
| `type` | [IAnyType](interfaces/ianytype.md) |

**Returns:** _type is IT_

---

### isOptionalType

▸ **isOptionalType**<**IT**>(`type`: IT): _type is IT_

_Defined in [packages/mobx-state-tree/src/types/utility-types/optional.ts:234](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/optional.ts#L234)_

Returns if a value represents an optional type.

**`template`** IT

**Type parameters:**

▪ **IT**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `type` | IT   |

**Returns:** _type is IT_

---

### isPrimitiveType

▸ **isPrimitiveType**<**IT**>(`type`: IT): _type is IT_

_Defined in [packages/mobx-state-tree/src/types/primitives.ts:204](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/primitives.ts#L204)_

Returns if a given value represents a primitive type.

**Type parameters:**

▪ **IT**: _[ISimpleType](interfaces/isimpletype.md)‹string› | [ISimpleType](interfaces/isimpletype.md)‹number› | [ISimpleType](interfaces/isimpletype.md)‹boolean› | [IType](interfaces/itype.md)_

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `type` | IT   |

**Returns:** _type is IT_

---

### isProtected

▸ **isProtected**(`target`: IAnyStateTreeNode): _boolean_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:312](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L312)_

Returns true if the object is in protected mode, @see protect

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `target` | IAnyStateTreeNode |

**Returns:** _boolean_

---

### isReferenceType

▸ **isReferenceType**<**IT**>(`type`: IT): _type is IT_

_Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:533](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/reference.ts#L533)_

Returns if a given value represents a reference type.

**Type parameters:**

▪ **IT**: _IReferenceType‹any›_

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `type` | IT   |

**Returns:** _type is IT_

---

### isRefinementType

▸ **isRefinementType**<**IT**>(`type`: IT): _type is IT_

_Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:126](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L126)_

Returns if a given value is a refinement type.

**Type parameters:**

▪ **IT**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `type` | IT   |

**Returns:** _type is IT_

---

### isRoot

▸ **isRoot**(`target`: IAnyStateTreeNode): _boolean_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:494](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L494)_

Returns true if the given object is the root of a model tree.

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `target` | IAnyStateTreeNode |

**Returns:** _boolean_

---

### isStateTreeNode

▸ **isStateTreeNode**<**IT**>(`value`: any): _value is STNValue<Instance<IT>, IT>_

_Defined in [packages/mobx-state-tree/src/core/node/node-utils.ts:68](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/node/node-utils.ts#L68)_

Returns true if the given value is a node in a state tree.
More precisely, that is, if the value is an instance of a
`types.model`, `types.array` or `types.map`.

**Type parameters:**

▪ **IT**: _[IAnyComplexType](interfaces/ianycomplextype.md)_

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `value` | any  |

**Returns:** _value is STNValue<Instance<IT>, IT>_

true if the value is a state tree node.

---

### isType

▸ **isType**(`value`: any): _value is IAnyType_

_Defined in [packages/mobx-state-tree/src/core/type/type.ts:529](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/type/type.ts#L529)_

Returns if a given value represents a type.

**Parameters:**

| Name    | Type | Description     |
| ------- | ---- | --------------- |
| `value` | any  | Value to check. |

**Returns:** _value is IAnyType_

`true` if the value is a type.

---

### isUnionType

▸ **isUnionType**<**IT**>(`type`: IT): _type is IT_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:282](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L282)_

Returns if a given value represents a union type.

**Type parameters:**

▪ **IT**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `type` | IT   |

**Returns:** _type is IT_

---

### isValidReference

▸ **isValidReference**<**N**>(`getter`: function, `checkIfAlive`: boolean): _boolean_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:598](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L598)_

Tests if a reference is valid (pointing to an existing node and optionally if alive) and returns if the check passes or not.

**Type parameters:**

▪ **N**: _IAnyStateTreeNode_

**Parameters:**

▪ **getter**: _function_

Function to access the reference.

▸ (): _N | null | undefined_

▪`Default value` **checkIfAlive**: _boolean_= true

true to also make sure the referenced node is alive (default), false to skip this check.

**Returns:** _boolean_

---

### joinJsonPath

▸ **joinJsonPath**(`path`: string[]): _string_

_Defined in [packages/mobx-state-tree/src/core/json-patch.ts:98](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/json-patch.ts#L98)_

Generates a json-path compliant json path from path parts.

**Parameters:**

| Name   | Type     |
| ------ | -------- |
| `path` | string[] |

**Returns:** _string_

---

### late

▸ **late**<**T**>(`type`: function): _T_

_Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:103](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/late.ts#L103)_

`types.late` - Defines a type that gets implemented later. This is useful when you have to deal with circular dependencies.
Please notice that when defining circular dependencies TypeScript isn't smart enough to inference them.

Example:

```ts
// TypeScript isn't smart enough to infer self referencing types.
const Node = types.model({
    children: types.array(types.late((): IAnyModelType => Node)) // then typecast each array element to Instance<typeof Node>
})
```

**Type parameters:**

▪ **T**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

▪ **type**: _function_

A function that returns the type that will be defined.

▸ (): _T_

**Returns:** _T_

▸ **late**<**T**>(`name`: string, `type`: function): _T_

_Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:104](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/late.ts#L104)_

`types.late` - Defines a type that gets implemented later. This is useful when you have to deal with circular dependencies.
Please notice that when defining circular dependencies TypeScript isn't smart enough to inference them.

Example:

```ts
// TypeScript isn't smart enough to infer self referencing types.
const Node = types.model({
    children: types.array(types.late((): IAnyModelType => Node)) // then typecast each array element to Instance<typeof Node>
})
```

**Type parameters:**

▪ **T**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

▪ **name**: _string_

The name to use for the type that will be returned.

▪ **type**: _function_

A function that returns the type that will be defined.

▸ (): _T_

**Returns:** _T_

---

### late

▸ **late**<**T**>(`type`: function): _T_

_Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:103](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/late.ts#L103)_

`types.late` - Defines a type that gets implemented later. This is useful when you have to deal with circular dependencies.
Please notice that when defining circular dependencies TypeScript isn't smart enough to inference them.

Example:

```ts
// TypeScript isn't smart enough to infer self referencing types.
const Node = types.model({
    children: types.array(types.late((): IAnyModelType => Node)) // then typecast each array element to Instance<typeof Node>
})
```

**Type parameters:**

▪ **T**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

▪ **type**: _function_

A function that returns the type that will be defined.

▸ (): _T_

**Returns:** _T_

▸ **lazy**<**T**>(`name`: string, `type`: function): _T_

_Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:104](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/late.ts#L104)_

`types.lazy` - Defines a type that gets implemented later. This is useful when you have to deal with circular dependencies.
Please notice that when defining circular dependencies TypeScript isn't smart enough to inference them.

Example:

```ts
// TypeScript isn't smart enough to infer self referencing types.
const Node = types.model({
    children: types.array(types.late((): IAnyModelType => Node)) // then typecast each array element to Instance<typeof Node>
})
```

**Type parameters:**

▪ **T**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

▪ **name**: _string_

The name to use for the type that will be returned.

▪ **type**: _function_

A function that returns the type that will be defined.

▸ (): _T_

**Returns:** _T_

---

### literal

▸ **literal**<**S**>(`value`: S): _[ISimpleType](interfaces/isimpletype.md)‹S›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/literal.ts:73](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/literal.ts#L73)_

`types.literal` - The literal type will return a type that will match only the exact given type.
The given value must be a primitive, in order to be serialized to a snapshot correctly.
You can use literal to match exact strings for example the exact male or female string.

Example:

```ts
const Person = types.model({
    name: types.string,
    gender: types.union(types.literal("male"), types.literal("female"))
})
```

**Type parameters:**

▪ **S**: _Primitives_

**Parameters:**

| Name    | Type | Description                                |
| ------- | ---- | ------------------------------------------ |
| `value` | S    | The value to use in the strict equal check |

**Returns:** _[ISimpleType](interfaces/isimpletype.md)‹S›_

---

### map

▸ **map**<**IT**>(`subtype`: IT): _IMapType‹IT›_

_Defined in [packages/mobx-state-tree/src/types/complex-types/map.ts:517](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/map.ts#L517)_

`types.map` - Creates a key based collection type who's children are all of a uniform declared type.
If the type stored in a map has an identifier, it is mandatory to store the child under that identifier in the map.

This type will always produce [observable maps](https://mobx.js.org/refguide/map.html)

Example:

```ts
const Todo = types.model({
    id: types.identifier,
    task: types.string
})

const TodoStore = types.model({
    todos: types.map(Todo)
})

const s = TodoStore.create({ todos: {} })
unprotect(s)
s.todos.set(17, { task: "Grab coffee", id: 17 })
s.todos.put({ task: "Grab cookie", id: 18 }) // put will infer key from the identifier
console.log(s.todos.get(17).task) // prints: "Grab coffee"
```

**Type parameters:**

▪ **IT**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

| Name      | Type |
| --------- | ---- |
| `subtype` | IT   |

**Returns:** _IMapType‹IT›_

---

### maybe

▸ **maybe**<**IT**>(`type`: IT): _IMaybe‹IT›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/maybe.ts:31](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/maybe.ts#L31)_

`types.maybe` - Maybe will make a type nullable, and also optional.
The value `undefined` will be used to represent nullability.

**Type parameters:**

▪ **IT**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `type` | IT   |

**Returns:** _IMaybe‹IT›_

---

### maybeNull

▸ **maybeNull**<**IT**>(`type`: IT): _IMaybeNull‹IT›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/maybe.ts:44](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/maybe.ts#L44)_

`types.maybeNull` - Maybe will make a type nullable, and also optional.
The value `null` will be used to represent no value.

**Type parameters:**

▪ **IT**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `type` | IT   |

**Returns:** _IMaybeNull‹IT›_

---

### model

▸ **model**<**P**>(`name`: string, `properties?`: [P](undefined)): _[IModelType](interfaces/imodeltype.md)‹ModelPropertiesDeclarationToProperties‹P›, \_\_type›_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:738](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L738)_

`types.model` - Creates a new model type by providing a name, properties, volatile state and actions.

See the [model type](/concepts/trees#creating-models) description or the [getting started](intro/getting-started.md#getting-started-1) tutorial.

**Type parameters:**

▪ **P**: _ModelPropertiesDeclaration_

**Parameters:**

| Name          | Type           |
| ------------- | -------------- |
| `name`        | string         |
| `properties?` | [P](undefined) |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹ModelPropertiesDeclarationToProperties‹P›, \_\_type›_

▸ **model**<**P**>(`properties?`: [P](undefined)): _[IModelType](interfaces/imodeltype.md)‹ModelPropertiesDeclarationToProperties‹P›, \_\_type›_

_Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:742](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/complex-types/model.ts#L742)_

`types.model` - Creates a new model type by providing a name, properties, volatile state and actions.

See the [model type](/concepts/trees#creating-models) description or the [getting started](intro/getting-started.md#getting-started-1) tutorial.

**Type parameters:**

▪ **P**: _ModelPropertiesDeclaration_

**Parameters:**

| Name          | Type           |
| ------------- | -------------- |
| `properties?` | [P](undefined) |

**Returns:** _[IModelType](interfaces/imodeltype.md)‹ModelPropertiesDeclarationToProperties‹P›, \_\_type›_

---

### onAction

▸ **onAction**(`target`: IAnyStateTreeNode, `listener`: function, `attachAfter`: boolean): _[IDisposer](index.md#idisposer)_

_Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:226](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/middlewares/on-action.ts#L226)_

Registers a function that will be invoked for each action that is called on the provided model instance, or to any of its children.
See [actions](https://github.com/mobxjs/mobx-state-tree#actions) for more details. onAction events are emitted only for the outermost called action in the stack.
Action can also be intercepted by middleware using addMiddleware to change the function call before it will be run.

Not all action arguments might be serializable. For unserializable arguments, a struct like `{ $MST_UNSERIALIZABLE: true, type: "someType" }` will be generated.
MST Nodes are considered non-serializable as well (they could be serialized as there snapshot, but it is uncertain whether an replaying party will be able to handle such a non-instantiated snapshot).
Rather, when using `onAction` middleware, one should consider in passing arguments which are 1: an id, 2: a (relative) path, or 3: a snapshot. Instead of a real MST node.

Example:

```ts
const Todo = types.model({
    task: types.string
})

const TodoStore = types
    .model({
        todos: types.array(Todo)
    })
    .actions((self) => ({
        add(todo) {
            self.todos.push(todo)
        }
    }))

const s = TodoStore.create({ todos: [] })

let disposer = onAction(s, (call) => {
    console.log(call)
})

s.add({ task: "Grab a coffee" })
// Logs: { name: "add", path: "", args: [{ task: "Grab a coffee" }] }
```

**Parameters:**

▪ **target**: _IAnyStateTreeNode_

▪ **listener**: _function_

▸ (`call`: [ISerializedActionCall](interfaces/iserializedactioncall.md)): _void_

**Parameters:**

| Name   | Type                                                         |
| ------ | ------------------------------------------------------------ |
| `call` | [ISerializedActionCall](interfaces/iserializedactioncall.md) |

▪`Default value` **attachAfter**: _boolean_= false

(default false) fires the listener _after_ the action has executed instead of before.

**Returns:** _[IDisposer](index.md#idisposer)_

---

### onPatch

▸ **onPatch**(`target`: IAnyStateTreeNode, `callback`: function): _[IDisposer](index.md#idisposer)_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:85](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L85)_

Registers a function that will be invoked for each mutation that is applied to the provided model instance, or to any of its children.
See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details. onPatch events are emitted immediately and will not await the end of a transaction.
Patches can be used to deep observe a model tree.

**Parameters:**

▪ **target**: _IAnyStateTreeNode_

the model instance from which to receive patches

▪ **callback**: _function_

the callback that is invoked for each patch. The reversePatch is a patch that would actually undo the emitted patch

▸ (`patch`: [IJsonPatch](interfaces/ijsonpatch.md), `reversePatch`: [IJsonPatch](interfaces/ijsonpatch.md)): _void_

**Parameters:**

| Name           | Type                                   |
| -------------- | -------------------------------------- |
| `patch`        | [IJsonPatch](interfaces/ijsonpatch.md) |
| `reversePatch` | [IJsonPatch](interfaces/ijsonpatch.md) |

**Returns:** _[IDisposer](index.md#idisposer)_

function to remove the listener

---

### onSnapshot

▸ **onSnapshot**<**S**>(`target`: IStateTreeNode‹[IType](interfaces/itype.md)‹any, S, any››, `callback`: function): _[IDisposer](index.md#idisposer)_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:105](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L105)_

Registers a function that is invoked whenever a new snapshot for the given model instance is available.
The listener will only be fire at the end of the current MobX (trans)action.
See [snapshots](https://github.com/mobxjs/mobx-state-tree#snapshots) for more details.

**Type parameters:**

▪ **S**

**Parameters:**

▪ **target**: _IStateTreeNode‹[IType](interfaces/itype.md)‹any, S, any››_

▪ **callback**: _function_

▸ (`snapshot`: S): _void_

**Parameters:**

| Name       | Type |
| ---------- | ---- |
| `snapshot` | S    |

**Returns:** _[IDisposer](index.md#idisposer)_

---

### optional

▸ **optional**<**IT**>(`type`: IT, `defaultValueOrFunction`: OptionalDefaultValueOrFunction‹IT›): _IOptionalIType‹IT, [undefined]›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/optional.ts:160](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/optional.ts#L160)_

`types.optional` - Can be used to create a property with a default value.

Depending on the third argument (`optionalValues`) there are two ways of operation:

-   If the argument is not provided, then if a value is not provided in the snapshot (`undefined` or missing),
    it will default to the provided `defaultValue`
-   If the argument is provided, then if the value in the snapshot matches one of the optional values inside the array then it will
    default to the provided `defaultValue`. Additionally, if one of the optional values inside the array is `undefined` then a missing
    property is also valid.

    Note that it is also possible to include values of the same type as the intended subtype as optional values,
    in this case the optional value will be transformed into the `defaultValue` (e.g. `types.optional(types.string, "unnamed", [undefined, ""])`
    will transform the snapshot values `undefined` (and therefore missing) and empty strings into the string `"unnamed"` when it gets
    instantiated).

If `defaultValue` is a function, the function will be invoked for every new instance.
Applying a snapshot in which the optional value is one of the optional values (or `undefined`/_not_ present if none are provided) causes the
value to be reset.

Example:

```ts
const Todo = types.model({
    title: types.string,
    subtitle1: types.optional(types.string, "", [null]),
    subtitle2: types.optional(types.string, "", [null, undefined]),
    done: types.optional(types.boolean, false),
    created: types.optional(types.Date, () => new Date())
})

// if done is missing / undefined it will become false
// if created is missing / undefined it will get a freshly generated timestamp
// if subtitle1 is null it will default to "", but it cannot be missing or undefined
// if subtitle2 is null or undefined it will default to ""; since it can be undefined it can also be missing
const todo = Todo.create({ title: "Get coffee", subtitle1: null })
```

**Type parameters:**

▪ **IT**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

| Name                     | Type                               |
| ------------------------ | ---------------------------------- |
| `type`                   | IT                                 |
| `defaultValueOrFunction` | OptionalDefaultValueOrFunction‹IT› |

**Returns:** _IOptionalIType‹IT, [undefined]›_

▸ **optional**<**IT**, **OptionalVals**>(`type`: IT, `defaultValueOrFunction`: OptionalDefaultValueOrFunction‹IT›, `optionalValues`: OptionalVals): _IOptionalIType‹IT, OptionalVals›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/optional.ts:164](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/optional.ts#L164)_

`types.optional` - Can be used to create a property with a default value.

Depending on the third argument (`optionalValues`) there are two ways of operation:

-   If the argument is not provided, then if a value is not provided in the snapshot (`undefined` or missing),
    it will default to the provided `defaultValue`
-   If the argument is provided, then if the value in the snapshot matches one of the optional values inside the array then it will
    default to the provided `defaultValue`. Additionally, if one of the optional values inside the array is `undefined` then a missing
    property is also valid.

    Note that it is also possible to include values of the same type as the intended subtype as optional values,
    in this case the optional value will be transformed into the `defaultValue` (e.g. `types.optional(types.string, "unnamed", [undefined, ""])`
    will transform the snapshot values `undefined` (and therefore missing) and empty strings into the string `"unnamed"` when it gets
    instantiated).

If `defaultValue` is a function, the function will be invoked for every new instance.
Applying a snapshot in which the optional value is one of the optional values (or `undefined`/_not_ present if none are provided) causes the
value to be reset.

Example:

```ts
const Todo = types.model({
    title: types.string,
    subtitle1: types.optional(types.string, "", [null]),
    subtitle2: types.optional(types.string, "", [null, undefined]),
    done: types.optional(types.boolean, false),
    created: types.optional(types.Date, () => new Date())
})

// if done is missing / undefined it will become false
// if created is missing / undefined it will get a freshly generated timestamp
// if subtitle1 is null it will default to "", but it cannot be missing or undefined
// if subtitle2 is null or undefined it will default to ""; since it can be undefined it can also be missing
const todo = Todo.create({ title: "Get coffee", subtitle1: null })
```

**Type parameters:**

▪ **IT**: _[IAnyType](interfaces/ianytype.md)_

▪ **OptionalVals**: _ValidOptionalValues_

**Parameters:**

| Name                     | Type                               | Description                                                                                                                                                                                 |
| ------------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                   | IT                                 | -                                                                                                                                                                                           |
| `defaultValueOrFunction` | OptionalDefaultValueOrFunction‹IT› | -                                                                                                                                                                                           |
| `optionalValues`         | OptionalVals                       | an optional array with zero or more primitive values (string, number, boolean, null or undefined) that will be converted into the default. `[ undefined ]` is assumed when none is provided |

**Returns:** _IOptionalIType‹IT, OptionalVals›_

---

### protect

▸ **protect**(`target`: IAnyStateTreeNode): _void_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:267](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L267)_

The inverse of `unprotect`.

**Parameters:**

| Name     | Type              | Description |
| -------- | ----------------- | ----------- |
| `target` | IAnyStateTreeNode |             |

**Returns:** _void_

---

### recordActions

▸ **recordActions**(`subject`: IAnyStateTreeNode, `filter?`: undefined | function): _[IActionRecorder](interfaces/iactionrecorder.md)_

_Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:148](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/middlewares/on-action.ts#L148)_

Small abstraction around `onAction` and `applyAction`, attaches an action listener to a tree and records all the actions emitted.
Returns an recorder object with the following signature:

Example:

```ts
export interface IActionRecorder {
    // the recorded actions
    actions: ISerializedActionCall[]
    // true if currently recording
    recording: boolean
    // stop recording actions
    stop(): void
    // resume recording actions
    resume(): void
    // apply all the recorded actions on the given object
    replay(target: IAnyStateTreeNode): void
}
```

The optional filter function allows to skip recording certain actions.

**Parameters:**

| Name      | Type                      |
| --------- | ------------------------- |
| `subject` | IAnyStateTreeNode         |
| `filter?` | undefined &#124; function |

**Returns:** _[IActionRecorder](interfaces/iactionrecorder.md)_

---

### recordPatches

▸ **recordPatches**(`subject`: IAnyStateTreeNode, `filter?`: undefined | function): _[IPatchRecorder](interfaces/ipatchrecorder.md)_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:179](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L179)_

Small abstraction around `onPatch` and `applyPatch`, attaches a patch listener to a tree and records all the patches.
Returns an recorder object with the following signature:

Example:

```ts
export interface IPatchRecorder {
    // the recorded patches
    patches: IJsonPatch[]
    // the inverse of the recorded patches
    inversePatches: IJsonPatch[]
    // true if currently recording
    recording: boolean
    // stop recording patches
    stop(): void
    // resume recording patches
    resume(): void
    // apply all the recorded patches on the given target (the original subject if omitted)
    replay(target?: IAnyStateTreeNode): void
    // reverse apply the recorded patches on the given target  (the original subject if omitted)
    // stops the recorder if not already stopped
    undo(): void
}
```

The optional filter function allows to skip recording certain patches.

**Parameters:**

| Name      | Type                      |
| --------- | ------------------------- |
| `subject` | IAnyStateTreeNode         |
| `filter?` | undefined &#124; function |

**Returns:** _[IPatchRecorder](interfaces/ipatchrecorder.md)_

---

### reference

▸ **reference**<**IT**>(`subType`: IT, `options?`: [ReferenceOptions](index.md#referenceoptions)‹IT›): _IReferenceType‹IT›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:486](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/reference.ts#L486)_

`types.reference` - Creates a reference to another type, which should have defined an identifier.
See also the [reference and identifiers](https://github.com/mobxjs/mobx-state-tree#references-and-identifiers) section.

**Type parameters:**

▪ **IT**: _[IAnyComplexType](interfaces/ianycomplextype.md)_

**Parameters:**

| Name       | Type                                              |
| ---------- | ------------------------------------------------- |
| `subType`  | IT                                                |
| `options?` | [ReferenceOptions](index.md#referenceoptions)‹IT› |

**Returns:** _IReferenceType‹IT›_

---

### refinement

▸ **refinement**<**IT**>(`name`: string, `type`: IT, `predicate`: function, `message?`: string | function): _IT_

_Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:84](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L84)_

`types.refinement` - Creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.

**Type parameters:**

▪ **IT**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

▪ **name**: _string_

▪ **type**: _IT_

▪ **predicate**: _function_

▸ (`snapshot`: IT["CreationType"]): _boolean_

**Parameters:**

| Name       | Type               |
| ---------- | ------------------ |
| `snapshot` | IT["CreationType"] |

▪`Optional` **message**: _string | function_

**Returns:** _IT_

▸ **refinement**<**IT**>(`type`: IT, `predicate`: function, `message?`: string | function): _IT_

_Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:90](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L90)_

`types.refinement` - Creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.

**Type parameters:**

▪ **IT**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

▪ **type**: _IT_

▪ **predicate**: _function_

▸ (`snapshot`: IT["CreationType"]): _boolean_

**Parameters:**

| Name       | Type               |
| ---------- | ------------------ |
| `snapshot` | IT["CreationType"] |

▪`Optional` **message**: _string | function_

**Returns:** _IT_

---

### resolveIdentifier

▸ **resolveIdentifier**<**IT**>(`type`: IT, `target`: IAnyStateTreeNode, `identifier`: [ReferenceIdentifier](index.md#referenceidentifier)): _IT["Type"] | undefined_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:527](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L527)_

Resolves a model instance given a root target, the type and the identifier you are searching for.
Returns undefined if no value can be found.

**Type parameters:**

▪ **IT**: _[IAnyModelType](interfaces/ianymodeltype.md)_

**Parameters:**

| Name         | Type                                                |
| ------------ | --------------------------------------------------- |
| `type`       | IT                                                  |
| `target`     | IAnyStateTreeNode                                   |
| `identifier` | [ReferenceIdentifier](index.md#referenceidentifier) |

**Returns:** _IT["Type"] | undefined_

---

### resolvePath

▸ **resolvePath**(`target`: IAnyStateTreeNode, `path`: string): _any_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:509](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L509)_

Resolves a path relatively to a given object.
Returns undefined if no value can be found.

**Parameters:**

| Name     | Type              | Description       |
| -------- | ----------------- | ----------------- |
| `target` | IAnyStateTreeNode | -                 |
| `path`   | string            | escaped json path |

**Returns:** _any_

---

### safeReference

▸ **safeReference**<**IT**>(`subType`: IT, `options`: \_\_type | [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)‹IT› & object): _IReferenceType‹IT›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:537](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/reference.ts#L537)_

`types.safeReference` - A safe reference is like a standard reference, except that it accepts the undefined value by default
and automatically sets itself to undefined (when the parent is a model) / removes itself from arrays and maps
when the reference it is pointing to gets detached/destroyed.

The optional options parameter object accepts a parameter named `acceptsUndefined`, which is set to true by default, so it is suitable
for model properties.
When used inside collections (arrays/maps), it is recommended to set this option to false so it can't take undefined as value,
which is usually the desired in those cases.

Strictly speaking it is a `types.maybe(types.reference(X))` (when `acceptsUndefined` is set to true, the default) and
`types.reference(X)` (when `acceptsUndefined` is set to false), both of them with a customized `onInvalidated` option.

**Type parameters:**

▪ **IT**: _[IAnyComplexType](interfaces/ianycomplextype.md)_

**Parameters:**

| Name      | Type                                                                                        |
| --------- | ------------------------------------------------------------------------------------------- |
| `subType` | IT                                                                                          |
| `options` | \_\_type &#124; [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)‹IT› & object |

**Returns:** _IReferenceType‹IT›_

▸ **safeReference**<**IT**>(`subType`: IT, `options?`: \_\_type | [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)‹IT› & object): _IMaybe‹IReferenceType‹IT››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:541](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/reference.ts#L541)_

`types.safeReference` - A safe reference is like a standard reference, except that it accepts the undefined value by default
and automatically sets itself to undefined (when the parent is a model) / removes itself from arrays and maps
when the reference it is pointing to gets detached/destroyed.

The optional options parameter object accepts a parameter named `acceptsUndefined`, which is set to true by default, so it is suitable
for model properties.
When used inside collections (arrays/maps), it is recommended to set this option to false so it can't take undefined as value,
which is usually the desired in those cases.

Strictly speaking it is a `types.maybe(types.reference(X))` (when `acceptsUndefined` is set to true, the default) and
`types.reference(X)` (when `acceptsUndefined` is set to false), both of them with a customized `onInvalidated` option.

**Type parameters:**

▪ **IT**: _[IAnyComplexType](interfaces/ianycomplextype.md)_

**Parameters:**

| Name       | Type                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------- |
| `subType`  | IT                                                                                          |
| `options?` | \_\_type &#124; [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)‹IT› & object |

**Returns:** _IMaybe‹IReferenceType‹IT››_

---

### setLivelinessChecking

▸ **setLivelinessChecking**(`mode`: [LivelinessMode](index.md#livelinessmode)): _void_

_Defined in [packages/mobx-state-tree/src/core/node/livelinessChecking.ts:18](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/node/livelinessChecking.ts#L18)_

Defines what MST should do when running into reads / writes to objects that have died.
By default it will print a warning.
Use the `"error"` option to easy debugging to see where the error was thrown and when the offending read / write took place

**Parameters:**

| Name   | Type                                      | Description                       |
| ------ | ----------------------------------------- | --------------------------------- |
| `mode` | [LivelinessMode](index.md#livelinessmode) | `"warn"`, `"error"` or `"ignore"` |

**Returns:** _void_

---

### snapshotProcessor

▸ **snapshotProcessor**<**IT**, **CustomC**, **CustomS**>(`type`: IT, `processors`: [ISnapshotProcessors](interfaces/isnapshotprocessors.md)‹IT["CreationType"], CustomC, IT["SnapshotType"], CustomS›, `name?`: undefined | string): _[ISnapshotProcessor](interfaces/isnapshotprocessor.md)‹IT, CustomC, CustomS›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:209](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L209)_

`types.snapshotProcessor` - Runs a pre/post snapshot processor before/after serializing a given type.

Example:

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

**Type parameters:**

▪ **IT**: _[IAnyType](interfaces/ianytype.md)_

▪ **CustomC**

▪ **CustomS**

**Parameters:**

| Name         | Type                                                                                                               | Description                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| `type`       | IT                                                                                                                 | Type to run the processors over.                       |
| `processors` | [ISnapshotProcessors](interfaces/isnapshotprocessors.md)‹IT["CreationType"], CustomC, IT["SnapshotType"], CustomS› | Processors to run.                                     |
| `name?`      | undefined &#124; string                                                                                            | Type name, or undefined to inherit the inner type one. |

**Returns:** _[ISnapshotProcessor](interfaces/isnapshotprocessor.md)‹IT, CustomC, CustomS›_

---

### splitJsonPath

▸ **splitJsonPath**(`path`: string): _string[]_

_Defined in [packages/mobx-state-tree/src/core/json-patch.ts:118](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/json-patch.ts#L118)_

Splits and decodes a json path into several parts.

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `path` | string |

**Returns:** _string[]_

---

### toGenerator

▸ **toGenerator**<**R**>(`p`: Promise‹R›): _Generator‹Promise‹R›, R, R›_

_Defined in [packages/mobx-state-tree/src/core/flow.ts:86](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/flow.ts#L86)_

**`experimental`**
experimental api - might change on minor/patch releases

Convert a promise to a generator yielding that promise
This is intended to allow for usage of `yield*` in async actions to
retain the promise return type.

Example:

```ts
function getDataAsync(input: string): Promise<number> { ... }

const someModel.actions(self => ({
  someAction: flow(function*() {
    // value is typed as number
    const value = yield* toGenerator(getDataAsync("input value"));
    ...
  })
}))
```

**Type parameters:**

▪ **R**

**Parameters:**

| Name | Type       |
| ---- | ---------- |
| `p`  | Promise‹R› |

**Returns:** _Generator‹Promise‹R›, R, R›_

---

### toGeneratorFunction

▸ **toGeneratorFunction**<**R**, **Args**>(`p`: function): _(Anonymous function)_

_Defined in [packages/mobx-state-tree/src/core/flow.ts:59](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/flow.ts#L59)_

**`experimental`**
experimental api - might change on minor/patch releases

Convert a promise-returning function to a generator-returning one.
This is intended to allow for usage of `yield*` in async actions to
retain the promise return type.

Example:

```ts
function getDataAsync(input: string): Promise<number> { ... }
const getDataGen = toGeneratorFunction(getDataAsync);

const someModel.actions(self => ({
  someAction: flow(function*() {
    // value is typed as number
    const value = yield* getDataGen("input value");
    ...
  })
}))
```

**Type parameters:**

▪ **R**

▪ **Args**: _any[]_

**Parameters:**

▪ **p**: _function_

▸ (...`args`: Args): _Promise‹R›_

**Parameters:**

| Name      | Type |
| --------- | ---- |
| `...args` | Args |

**Returns:** _(Anonymous function)_

---

### tryReference

▸ **tryReference**<**N**>(`getter`: function, `checkIfAlive`: boolean): _N | undefined_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:566](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L566)_

Tests if a reference is valid (pointing to an existing node and optionally if alive) and returns such reference if it the check passes,
else it returns undefined.

**Type parameters:**

▪ **N**: _IAnyStateTreeNode_

**Parameters:**

▪ **getter**: _function_

Function to access the reference.

▸ (): _N | null | undefined_

▪`Default value` **checkIfAlive**: _boolean_= true

true to also make sure the referenced node is alive (default), false to skip this check.

**Returns:** _N | undefined_

---

### tryResolve

▸ **tryResolve**(`target`: IAnyStateTreeNode, `path`: string): _any_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:626](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L626)_

Try to resolve a given path relative to a given node.

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `target` | IAnyStateTreeNode |
| `path`   | string            |

**Returns:** _any_

---

### typecheck

▸ **typecheck**<**IT**>(`type`: IT, `value`: ExtractCSTWithSTN‹IT›): _void_

_Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:166](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/type/type-checker.ts#L166)_

Run's the typechecker for the given type on the given value, which can be a snapshot or an instance.
Throws if the given value is not according the provided type specification.
Use this if you need typechecks even in a production build (by default all automatic runtime type checks will be skipped in production builds)

**Type parameters:**

▪ **IT**: _[IAnyType](interfaces/ianytype.md)_

**Parameters:**

| Name    | Type                  | Description                                            |
| ------- | --------------------- | ------------------------------------------------------ |
| `type`  | IT                    | Type to check against.                                 |
| `value` | ExtractCSTWithSTN‹IT› | Value to be checked, either a snapshot or an instance. |

**Returns:** _void_

---

### unescapeJsonPath

▸ **unescapeJsonPath**(`path`: string): _string_

_Defined in [packages/mobx-state-tree/src/core/json-patch.ts:88](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/json-patch.ts#L88)_

Unescape slashes and backslashes.

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| `path` | string |

**Returns:** _string_

---

### union

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:159](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L159)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:161](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L161)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

**Parameters:**

| Name      | Type                                                     |
| --------- | -------------------------------------------------------- |
| `options` | [UnionOptions](interfaces/unionoptions.md)               |
| `A`       | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`       | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:164](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L164)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`  | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:166](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L166)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

**Parameters:**

| Name      | Type                                                     |
| --------- | -------------------------------------------------------- |
| `options` | [UnionOptions](interfaces/unionoptions.md)               |
| `A`       | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`       | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`       | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:168](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L168)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`  | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`  | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:171](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L171)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

**Parameters:**

| Name      | Type                                                     |
| --------- | -------------------------------------------------------- |
| `options` | [UnionOptions](interfaces/unionoptions.md)               |
| `A`       | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`       | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`       | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`       | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:174](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L174)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`  | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`  | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`  | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:177](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L177)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

**Parameters:**

| Name      | Type                                                     |
| --------- | -------------------------------------------------------- |
| `options` | [UnionOptions](interfaces/unionoptions.md)               |
| `A`       | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`       | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`       | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`       | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`       | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:180](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L180)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`  | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`  | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`  | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`  | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:183](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L183)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

**Parameters:**

| Name      | Type                                                     |
| --------- | -------------------------------------------------------- |
| `options` | [UnionOptions](interfaces/unionoptions.md)               |
| `A`       | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`       | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`       | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`       | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`       | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`       | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:186](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L186)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: _ModelProperties_

▪ **OG**

▪ **FCG**

▪ **FSG**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`  | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`  | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`  | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`  | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
| `G`  | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:189](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L189)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: _ModelProperties_

▪ **OG**

▪ **FCG**

▪ **FSG**

**Parameters:**

| Name      | Type                                                     |
| --------- | -------------------------------------------------------- |
| `options` | [UnionOptions](interfaces/unionoptions.md)               |
| `A`       | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`       | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`       | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`       | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`       | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`       | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
| `G`       | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›, `H`: [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:193](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L193)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: _ModelProperties_

▪ **OG**

▪ **FCG**

▪ **FSG**

▪ **PH**: _ModelProperties_

▪ **OH**

▪ **FCH**

▪ **FSH**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`  | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`  | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`  | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`  | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
| `G`  | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |
| `H`  | [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›, `H`: [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:196](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L196)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: _ModelProperties_

▪ **OG**

▪ **FCG**

▪ **FSG**

▪ **PH**: _ModelProperties_

▪ **OH**

▪ **FCH**

▪ **FSH**

**Parameters:**

| Name      | Type                                                     |
| --------- | -------------------------------------------------------- |
| `options` | [UnionOptions](interfaces/unionoptions.md)               |
| `A`       | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`       | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`       | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`       | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`       | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`       | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
| `G`       | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |
| `H`       | [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**, **PI**, **OI**, **FCI**, **FSI**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›, `H`: [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH›, `I`: [IModelType](interfaces/imodeltype.md)‹PI, OI, FCI, FSI›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH› | ModelCreationType2‹PI, FCI›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH› | ModelSnapshotType2‹PI, FSI›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH› | ModelInstanceType‹PI, OI››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:200](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L200)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: _ModelProperties_

▪ **OG**

▪ **FCG**

▪ **FSG**

▪ **PH**: _ModelProperties_

▪ **OH**

▪ **FCH**

▪ **FSH**

▪ **PI**: _ModelProperties_

▪ **OI**

▪ **FCI**

▪ **FSI**

**Parameters:**

| Name | Type                                                     |
| ---- | -------------------------------------------------------- |
| `A`  | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`  | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`  | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`  | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`  | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`  | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
| `G`  | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |
| `H`  | [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH› |
| `I`  | [IModelType](interfaces/imodeltype.md)‹PI, OI, FCI, FSI› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH› | ModelCreationType2‹PI, FCI›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH› | ModelSnapshotType2‹PI, FSI›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH› | ModelInstanceType‹PI, OI››_

▸ **union**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**, **PI**, **OI**, **FCI**, **FSI**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›, `H`: [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH›, `I`: [IModelType](interfaces/imodeltype.md)‹PI, OI, FCI, FSI›): _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH› | ModelCreationType2‹PI, FCI›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH› | ModelSnapshotType2‹PI, FSI›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH› | ModelInstanceType‹PI, OI››_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:203](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L203)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **PA**: _ModelProperties_

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: _ModelProperties_

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: _ModelProperties_

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: _ModelProperties_

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: _ModelProperties_

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: _ModelProperties_

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: _ModelProperties_

▪ **OG**

▪ **FCG**

▪ **FSG**

▪ **PH**: _ModelProperties_

▪ **OH**

▪ **FCH**

▪ **FSH**

▪ **PI**: _ModelProperties_

▪ **OI**

▪ **FCI**

▪ **FSI**

**Parameters:**

| Name      | Type                                                     |
| --------- | -------------------------------------------------------- |
| `options` | [UnionOptions](interfaces/unionoptions.md)               |
| `A`       | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
| `B`       | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
| `C`       | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
| `D`       | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
| `E`       | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
| `F`       | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
| `G`       | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |
| `H`       | [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH› |
| `I`       | [IModelType](interfaces/imodeltype.md)‹PI, OI, FCI, FSI› |

**Returns:** _ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH› | ModelCreationType2‹PI, FCI›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH› | ModelSnapshotType2‹PI, FSI›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH› | ModelInstanceType‹PI, OI››_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**>(`A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›): _ITypeUnion‹CA | CB, SA | SB, TA | TB›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:207](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L207)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

**Parameters:**

| Name | Type                                     |
| ---- | ---------------------------------------- |
| `A`  | [IType](interfaces/itype.md)‹CA, SA, TA› |
| `B`  | [IType](interfaces/itype.md)‹CB, SB, TB› |

**Returns:** _ITypeUnion‹CA | CB, SA | SB, TA | TB›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›): _ITypeUnion‹CA | CB, SA | SB, TA | TB›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:209](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L209)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

**Parameters:**

| Name      | Type                                       |
| --------- | ------------------------------------------ |
| `options` | [UnionOptions](interfaces/unionoptions.md) |
| `A`       | [IType](interfaces/itype.md)‹CA, SA, TA›   |
| `B`       | [IType](interfaces/itype.md)‹CB, SB, TB›   |

**Returns:** _ITypeUnion‹CA | CB, SA | SB, TA | TB›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**>(`A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›, `C`: [IType](interfaces/itype.md)‹CC, SC, TC›): _ITypeUnion‹CA | CB | CC, SA | SB | SC, TA | TB | TC›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:211](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L211)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

**Parameters:**

| Name | Type                                     |
| ---- | ---------------------------------------- |
| `A`  | [IType](interfaces/itype.md)‹CA, SA, TA› |
| `B`  | [IType](interfaces/itype.md)‹CB, SB, TB› |
| `C`  | [IType](interfaces/itype.md)‹CC, SC, TC› |

**Returns:** _ITypeUnion‹CA | CB | CC, SA | SB | SC, TA | TB | TC›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›, `C`: [IType](interfaces/itype.md)‹CC, SC, TC›): _ITypeUnion‹CA | CB | CC, SA | SB | SC, TA | TB | TC›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:213](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L213)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

**Parameters:**

| Name      | Type                                       |
| --------- | ------------------------------------------ |
| `options` | [UnionOptions](interfaces/unionoptions.md) |
| `A`       | [IType](interfaces/itype.md)‹CA, SA, TA›   |
| `B`       | [IType](interfaces/itype.md)‹CB, SB, TB›   |
| `C`       | [IType](interfaces/itype.md)‹CC, SC, TC›   |

**Returns:** _ITypeUnion‹CA | CB | CC, SA | SB | SC, TA | TB | TC›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**>(`A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›, `C`: [IType](interfaces/itype.md)‹CC, SC, TC›, `D`: [IType](interfaces/itype.md)‹CD, SD, TD›): _ITypeUnion‹CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:215](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L215)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

**Parameters:**

| Name | Type                                     |
| ---- | ---------------------------------------- |
| `A`  | [IType](interfaces/itype.md)‹CA, SA, TA› |
| `B`  | [IType](interfaces/itype.md)‹CB, SB, TB› |
| `C`  | [IType](interfaces/itype.md)‹CC, SC, TC› |
| `D`  | [IType](interfaces/itype.md)‹CD, SD, TD› |

**Returns:** _ITypeUnion‹CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›, `C`: [IType](interfaces/itype.md)‹CC, SC, TC›, `D`: [IType](interfaces/itype.md)‹CD, SD, TD›): _ITypeUnion‹CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:218](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L218)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

**Parameters:**

| Name      | Type                                       |
| --------- | ------------------------------------------ |
| `options` | [UnionOptions](interfaces/unionoptions.md) |
| `A`       | [IType](interfaces/itype.md)‹CA, SA, TA›   |
| `B`       | [IType](interfaces/itype.md)‹CB, SB, TB›   |
| `C`       | [IType](interfaces/itype.md)‹CC, SC, TC›   |
| `D`       | [IType](interfaces/itype.md)‹CD, SD, TD›   |

**Returns:** _ITypeUnion‹CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**>(`A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›, `C`: [IType](interfaces/itype.md)‹CC, SC, TC›, `D`: [IType](interfaces/itype.md)‹CD, SD, TD›, `E`: [IType](interfaces/itype.md)‹CE, SE, TE›): _ITypeUnion‹CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:220](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L220)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

**Parameters:**

| Name | Type                                     |
| ---- | ---------------------------------------- |
| `A`  | [IType](interfaces/itype.md)‹CA, SA, TA› |
| `B`  | [IType](interfaces/itype.md)‹CB, SB, TB› |
| `C`  | [IType](interfaces/itype.md)‹CC, SC, TC› |
| `D`  | [IType](interfaces/itype.md)‹CD, SD, TD› |
| `E`  | [IType](interfaces/itype.md)‹CE, SE, TE› |

**Returns:** _ITypeUnion‹CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›, `C`: [IType](interfaces/itype.md)‹CC, SC, TC›, `D`: [IType](interfaces/itype.md)‹CD, SD, TD›, `E`: [IType](interfaces/itype.md)‹CE, SE, TE›): _ITypeUnion‹CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:222](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L222)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

**Parameters:**

| Name      | Type                                       |
| --------- | ------------------------------------------ |
| `options` | [UnionOptions](interfaces/unionoptions.md) |
| `A`       | [IType](interfaces/itype.md)‹CA, SA, TA›   |
| `B`       | [IType](interfaces/itype.md)‹CB, SB, TB›   |
| `C`       | [IType](interfaces/itype.md)‹CC, SC, TC›   |
| `D`       | [IType](interfaces/itype.md)‹CD, SD, TD›   |
| `E`       | [IType](interfaces/itype.md)‹CE, SE, TE›   |

**Returns:** _ITypeUnion‹CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**>(`A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›, `C`: [IType](interfaces/itype.md)‹CC, SC, TC›, `D`: [IType](interfaces/itype.md)‹CD, SD, TD›, `E`: [IType](interfaces/itype.md)‹CE, SE, TE›, `F`: [IType](interfaces/itype.md)‹CF, SF, TF›): _ITypeUnion‹CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:224](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L224)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

**Parameters:**

| Name | Type                                     |
| ---- | ---------------------------------------- |
| `A`  | [IType](interfaces/itype.md)‹CA, SA, TA› |
| `B`  | [IType](interfaces/itype.md)‹CB, SB, TB› |
| `C`  | [IType](interfaces/itype.md)‹CC, SC, TC› |
| `D`  | [IType](interfaces/itype.md)‹CD, SD, TD› |
| `E`  | [IType](interfaces/itype.md)‹CE, SE, TE› |
| `F`  | [IType](interfaces/itype.md)‹CF, SF, TF› |

**Returns:** _ITypeUnion‹CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›, `C`: [IType](interfaces/itype.md)‹CC, SC, TC›, `D`: [IType](interfaces/itype.md)‹CD, SD, TD›, `E`: [IType](interfaces/itype.md)‹CE, SE, TE›, `F`: [IType](interfaces/itype.md)‹CF, SF, TF›): _ITypeUnion‹CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:226](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L226)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

**Parameters:**

| Name      | Type                                       |
| --------- | ------------------------------------------ |
| `options` | [UnionOptions](interfaces/unionoptions.md) |
| `A`       | [IType](interfaces/itype.md)‹CA, SA, TA›   |
| `B`       | [IType](interfaces/itype.md)‹CB, SB, TB›   |
| `C`       | [IType](interfaces/itype.md)‹CC, SC, TC›   |
| `D`       | [IType](interfaces/itype.md)‹CD, SD, TD›   |
| `E`       | [IType](interfaces/itype.md)‹CE, SE, TE›   |
| `F`       | [IType](interfaces/itype.md)‹CF, SF, TF›   |

**Returns:** _ITypeUnion‹CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**, **CG**, **SG**, **TG**>(`A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›, `C`: [IType](interfaces/itype.md)‹CC, SC, TC›, `D`: [IType](interfaces/itype.md)‹CD, SD, TD›, `E`: [IType](interfaces/itype.md)‹CE, SE, TE›, `F`: [IType](interfaces/itype.md)‹CF, SF, TF›, `G`: [IType](interfaces/itype.md)‹CG, SG, TG›): _ITypeUnion‹CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:228](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L228)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

▪ **CG**

▪ **SG**

▪ **TG**

**Parameters:**

| Name | Type                                     |
| ---- | ---------------------------------------- |
| `A`  | [IType](interfaces/itype.md)‹CA, SA, TA› |
| `B`  | [IType](interfaces/itype.md)‹CB, SB, TB› |
| `C`  | [IType](interfaces/itype.md)‹CC, SC, TC› |
| `D`  | [IType](interfaces/itype.md)‹CD, SD, TD› |
| `E`  | [IType](interfaces/itype.md)‹CE, SE, TE› |
| `F`  | [IType](interfaces/itype.md)‹CF, SF, TF› |
| `G`  | [IType](interfaces/itype.md)‹CG, SG, TG› |

**Returns:** _ITypeUnion‹CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**, **CG**, **SG**, **TG**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›, `C`: [IType](interfaces/itype.md)‹CC, SC, TC›, `D`: [IType](interfaces/itype.md)‹CD, SD, TD›, `E`: [IType](interfaces/itype.md)‹CE, SE, TE›, `F`: [IType](interfaces/itype.md)‹CF, SF, TF›, `G`: [IType](interfaces/itype.md)‹CG, SG, TG›): _ITypeUnion‹CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:231](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L231)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

▪ **CG**

▪ **SG**

▪ **TG**

**Parameters:**

| Name      | Type                                       |
| --------- | ------------------------------------------ |
| `options` | [UnionOptions](interfaces/unionoptions.md) |
| `A`       | [IType](interfaces/itype.md)‹CA, SA, TA›   |
| `B`       | [IType](interfaces/itype.md)‹CB, SB, TB›   |
| `C`       | [IType](interfaces/itype.md)‹CC, SC, TC›   |
| `D`       | [IType](interfaces/itype.md)‹CD, SD, TD›   |
| `E`       | [IType](interfaces/itype.md)‹CE, SE, TE›   |
| `F`       | [IType](interfaces/itype.md)‹CF, SF, TF›   |
| `G`       | [IType](interfaces/itype.md)‹CG, SG, TG›   |

**Returns:** _ITypeUnion‹CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**, **CG**, **SG**, **TG**, **CH**, **SH**, **TH**>(`A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›, `C`: [IType](interfaces/itype.md)‹CC, SC, TC›, `D`: [IType](interfaces/itype.md)‹CD, SD, TD›, `E`: [IType](interfaces/itype.md)‹CE, SE, TE›, `F`: [IType](interfaces/itype.md)‹CF, SF, TF›, `G`: [IType](interfaces/itype.md)‹CG, SG, TG›, `H`: [IType](interfaces/itype.md)‹CH, SH, TH›): _ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:233](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L233)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

▪ **CG**

▪ **SG**

▪ **TG**

▪ **CH**

▪ **SH**

▪ **TH**

**Parameters:**

| Name | Type                                     |
| ---- | ---------------------------------------- |
| `A`  | [IType](interfaces/itype.md)‹CA, SA, TA› |
| `B`  | [IType](interfaces/itype.md)‹CB, SB, TB› |
| `C`  | [IType](interfaces/itype.md)‹CC, SC, TC› |
| `D`  | [IType](interfaces/itype.md)‹CD, SD, TD› |
| `E`  | [IType](interfaces/itype.md)‹CE, SE, TE› |
| `F`  | [IType](interfaces/itype.md)‹CF, SF, TF› |
| `G`  | [IType](interfaces/itype.md)‹CG, SG, TG› |
| `H`  | [IType](interfaces/itype.md)‹CH, SH, TH› |

**Returns:** _ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**, **CG**, **SG**, **TG**, **CH**, **SH**, **TH**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›, `C`: [IType](interfaces/itype.md)‹CC, SC, TC›, `D`: [IType](interfaces/itype.md)‹CD, SD, TD›, `E`: [IType](interfaces/itype.md)‹CE, SE, TE›, `F`: [IType](interfaces/itype.md)‹CF, SF, TF›, `G`: [IType](interfaces/itype.md)‹CG, SG, TG›, `H`: [IType](interfaces/itype.md)‹CH, SH, TH›): _ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:236](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L236)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

▪ **CG**

▪ **SG**

▪ **TG**

▪ **CH**

▪ **SH**

▪ **TH**

**Parameters:**

| Name      | Type                                       |
| --------- | ------------------------------------------ |
| `options` | [UnionOptions](interfaces/unionoptions.md) |
| `A`       | [IType](interfaces/itype.md)‹CA, SA, TA›   |
| `B`       | [IType](interfaces/itype.md)‹CB, SB, TB›   |
| `C`       | [IType](interfaces/itype.md)‹CC, SC, TC›   |
| `D`       | [IType](interfaces/itype.md)‹CD, SD, TD›   |
| `E`       | [IType](interfaces/itype.md)‹CE, SE, TE›   |
| `F`       | [IType](interfaces/itype.md)‹CF, SF, TF›   |
| `G`       | [IType](interfaces/itype.md)‹CG, SG, TG›   |
| `H`       | [IType](interfaces/itype.md)‹CH, SH, TH›   |

**Returns:** _ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**, **CG**, **SG**, **TG**, **CH**, **SH**, **TH**, **CI**, **SI**, **TI**>(`A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›, `C`: [IType](interfaces/itype.md)‹CC, SC, TC›, `D`: [IType](interfaces/itype.md)‹CD, SD, TD›, `E`: [IType](interfaces/itype.md)‹CE, SE, TE›, `F`: [IType](interfaces/itype.md)‹CF, SF, TF›, `G`: [IType](interfaces/itype.md)‹CG, SG, TG›, `H`: [IType](interfaces/itype.md)‹CH, SH, TH›, `I`: [IType](interfaces/itype.md)‹CI, SI, TI›): _ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:239](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L239)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

▪ **CG**

▪ **SG**

▪ **TG**

▪ **CH**

▪ **SH**

▪ **TH**

▪ **CI**

▪ **SI**

▪ **TI**

**Parameters:**

| Name | Type                                     |
| ---- | ---------------------------------------- |
| `A`  | [IType](interfaces/itype.md)‹CA, SA, TA› |
| `B`  | [IType](interfaces/itype.md)‹CB, SB, TB› |
| `C`  | [IType](interfaces/itype.md)‹CC, SC, TC› |
| `D`  | [IType](interfaces/itype.md)‹CD, SD, TD› |
| `E`  | [IType](interfaces/itype.md)‹CE, SE, TE› |
| `F`  | [IType](interfaces/itype.md)‹CF, SF, TF› |
| `G`  | [IType](interfaces/itype.md)‹CG, SG, TG› |
| `H`  | [IType](interfaces/itype.md)‹CH, SH, TH› |
| `I`  | [IType](interfaces/itype.md)‹CI, SI, TI› |

**Returns:** _ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI›_

▸ **union**<**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**, **CG**, **SG**, **TG**, **CH**, **SH**, **TH**, **CI**, **SI**, **TI**>(`options`: [UnionOptions](interfaces/unionoptions.md), `A`: [IType](interfaces/itype.md)‹CA, SA, TA›, `B`: [IType](interfaces/itype.md)‹CB, SB, TB›, `C`: [IType](interfaces/itype.md)‹CC, SC, TC›, `D`: [IType](interfaces/itype.md)‹CD, SD, TD›, `E`: [IType](interfaces/itype.md)‹CE, SE, TE›, `F`: [IType](interfaces/itype.md)‹CF, SF, TF›, `G`: [IType](interfaces/itype.md)‹CG, SG, TG›, `H`: [IType](interfaces/itype.md)‹CH, SH, TH›, `I`: [IType](interfaces/itype.md)‹CI, SI, TI›): _ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI›_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:242](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L242)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

▪ **CG**

▪ **SG**

▪ **TG**

▪ **CH**

▪ **SH**

▪ **TH**

▪ **CI**

▪ **SI**

▪ **TI**

**Parameters:**

| Name      | Type                                       |
| --------- | ------------------------------------------ |
| `options` | [UnionOptions](interfaces/unionoptions.md) |
| `A`       | [IType](interfaces/itype.md)‹CA, SA, TA›   |
| `B`       | [IType](interfaces/itype.md)‹CB, SB, TB›   |
| `C`       | [IType](interfaces/itype.md)‹CC, SC, TC›   |
| `D`       | [IType](interfaces/itype.md)‹CD, SD, TD›   |
| `E`       | [IType](interfaces/itype.md)‹CE, SE, TE›   |
| `F`       | [IType](interfaces/itype.md)‹CF, SF, TF›   |
| `G`       | [IType](interfaces/itype.md)‹CG, SG, TG›   |
| `H`       | [IType](interfaces/itype.md)‹CH, SH, TH›   |
| `I`       | [IType](interfaces/itype.md)‹CI, SI, TI›   |

**Returns:** _ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI›_

▸ **union**(...`types`: [IAnyType](interfaces/ianytype.md)[]): _[IAnyType](interfaces/ianytype.md)_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:245](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L245)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Parameters:**

| Name       | Type                                 |
| ---------- | ------------------------------------ |
| `...types` | [IAnyType](interfaces/ianytype.md)[] |

**Returns:** _[IAnyType](interfaces/ianytype.md)_

▸ **union**(`dispatchOrType`: [UnionOptions](interfaces/unionoptions.md) | [IAnyType](interfaces/ianytype.md), ...`otherTypes`: [IAnyType](interfaces/ianytype.md)[]): _[IAnyType](interfaces/ianytype.md)_

_Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:246](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/utility-types/union.ts#L246)_

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Parameters:**

| Name             | Type                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------ |
| `dispatchOrType` | [UnionOptions](interfaces/unionoptions.md) &#124; [IAnyType](interfaces/ianytype.md) |
| `...otherTypes`  | [IAnyType](interfaces/ianytype.md)[]                                                 |

**Returns:** _[IAnyType](interfaces/ianytype.md)_

---

### unprotect

▸ **unprotect**(`target`: IAnyStateTreeNode): _void_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:300](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L300)_

By default it is not allowed to directly modify a model. Models can only be modified through actions.
However, in some cases you don't care about the advantages (like replayability, traceability, etc) this yields.
For example because you are building a PoC or don't have any middleware attached to your tree.

In that case you can disable this protection by calling `unprotect` on the root of your tree.

Example:

```ts
const Todo = types
    .model({
        done: false
    })
    .actions((self) => ({
        toggle() {
            self.done = !self.done
        }
    }))

const todo = Todo.create()
todo.done = true // throws!
todo.toggle() // OK
unprotect(todo)
todo.done = false // OK
```

**Parameters:**

| Name     | Type              |
| -------- | ----------------- |
| `target` | IAnyStateTreeNode |

**Returns:** _void_

---

### walk

▸ **walk**(`target`: IAnyStateTreeNode, `processor`: function): _void_

_Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:788](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/core/mst-operations.ts#L788)_

Performs a depth first walk through a tree.

**Parameters:**

▪ **target**: _IAnyStateTreeNode_

▪ **processor**: _function_

▸ (`item`: IAnyStateTreeNode): _void_

**Parameters:**

| Name   | Type              |
| ------ | ----------------- |
| `item` | IAnyStateTreeNode |

**Returns:** _void_

## Object literals

### `Const` types

### ▪ **types**: _object_

_Defined in [packages/mobx-state-tree/src/types/index.ts:31](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L31)_

### Date

• **Date**: _[IType](interfaces/itype.md)‹number | Date, number, Date›_ = DatePrimitive

_Defined in [packages/mobx-state-tree/src/types/index.ts:48](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L48)_

### array

• **array**: _[array](index.md#array)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:50](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L50)_

### boolean

• **boolean**: _[ISimpleType](interfaces/isimpletype.md)‹boolean›_

_Defined in [packages/mobx-state-tree/src/types/index.ts:45](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L45)_

### compose

• **compose**: _[compose](index.md#compose)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:34](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L34)_

### custom

• **custom**: _[custom](index.md#custom)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:35](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L35)_

### enumeration

• **enumeration**: _[enumeration](index.md#enumeration)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:32](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L32)_

### frozen

• **frozen**: _[frozen](index.md#frozen)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:51](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L51)_

### identifier

• **identifier**: _[ISimpleType](interfaces/isimpletype.md)‹string›_

_Defined in [packages/mobx-state-tree/src/types/index.ts:52](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L52)_

### identifierNumber

• **identifierNumber**: _[ISimpleType](interfaces/isimpletype.md)‹number›_

_Defined in [packages/mobx-state-tree/src/types/index.ts:53](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L53)_

### integer

• **integer**: _[ISimpleType](interfaces/isimpletype.md)‹number›_

_Defined in [packages/mobx-state-tree/src/types/index.ts:47](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L47)_

### late

• **late**: _[late](index.md#late)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:54](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L54)_

### literal

• **literal**: _[literal](index.md#literal)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:40](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L40)_

### map

• **map**: _[map](index.md#map)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:49](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L49)_

### maybe

• **maybe**: _[maybe](index.md#maybe)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:41](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L41)_

### maybeNull

• **maybeNull**: _[maybeNull](index.md#maybenull)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:42](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L42)_

### model

• **model**: _[model](index.md#model)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:33](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L33)_

### null

• **null**: _[ISimpleType](interfaces/isimpletype.md)‹null›_ = nullType

_Defined in [packages/mobx-state-tree/src/types/index.ts:56](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L56)_

### number

• **number**: _[ISimpleType](interfaces/isimpletype.md)‹number›_

_Defined in [packages/mobx-state-tree/src/types/index.ts:46](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L46)_

### optional

• **optional**: _[optional](index.md#optional)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:39](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L39)_

### reference

• **reference**: _[reference](index.md#reference)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:36](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L36)_

### refinement

• **refinement**: _[refinement](index.md#refinement)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:43](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L43)_

### safeReference

• **safeReference**: _[safeReference](index.md#safereference)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:37](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L37)_

### snapshotProcessor

• **snapshotProcessor**: _[snapshotProcessor](index.md#snapshotprocessor)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:57](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L57)_

### string

• **string**: _[ISimpleType](interfaces/isimpletype.md)‹string›_

_Defined in [packages/mobx-state-tree/src/types/index.ts:44](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L44)_

### undefined

• **undefined**: _[ISimpleType](interfaces/isimpletype.md)‹undefined›_ = undefinedType

_Defined in [packages/mobx-state-tree/src/types/index.ts:55](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L55)_

### union

• **union**: _[union](index.md#union)_

_Defined in [packages/mobx-state-tree/src/types/index.ts:38](https://github.com/mobxjs/mobx-state-tree/blob/126ab41a/packages/mobx-state-tree/src/types/index.ts#L38)_
