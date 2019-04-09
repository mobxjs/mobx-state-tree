[mobx-state-tree](../README.md) > [IMiddlewareEvent](../interfaces/imiddlewareevent.md)

# Interface: IMiddlewareEvent

## Hierarchy

 [IActionContext](iactioncontext.md)

**↳ IMiddlewareEvent**

## Index

### Properties

* [allParentIds](imiddlewareevent.md#allparentids)
* [args](imiddlewareevent.md#args)
* [context](imiddlewareevent.md#context)
* [id](imiddlewareevent.md#id)
* [name](imiddlewareevent.md#name)
* [parentActionEvent](imiddlewareevent.md#parentactionevent)
* [parentEvent](imiddlewareevent.md#parentevent)
* [parentId](imiddlewareevent.md#parentid)
* [rootId](imiddlewareevent.md#rootid)
* [tree](imiddlewareevent.md#tree)
* [type](imiddlewareevent.md#type)

---

## Properties

<a id="allparentids"></a>

###  allParentIds

**● allParentIds**: *`number`[]*

Id of all events, from root until current (excluding current)

___
<a id="args"></a>

###  args

**● args**: *`any`[]*

Event arguments in an array (action arguments for actions)

___
<a id="context"></a>

###  context

**● context**: *`IAnyStateTreeNode`*

Event context (node where the action was invoked)

___
<a id="id"></a>

###  id

**● id**: *`number`*

Event unique id

___
<a id="name"></a>

###  name

**● name**: *`string`*

Event name (action name for actions)

___
<a id="parentactionevent"></a>

###  parentActionEvent

**● parentActionEvent**: *[IMiddlewareEvent](imiddlewareevent.md) \| `undefined`*

Parent action event object

___
<a id="parentevent"></a>

###  parentEvent

**● parentEvent**: *[IMiddlewareEvent](imiddlewareevent.md) \| `undefined`*

Parent event object

___
<a id="parentid"></a>

###  parentId

**● parentId**: *`number`*

Parent event unique id

___
<a id="rootid"></a>

###  rootId

**● rootId**: *`number`*

Root event unique id

___
<a id="tree"></a>

###  tree

**● tree**: *`IAnyStateTreeNode`*

Event tree (root node of the node where the action was invoked)

___
<a id="type"></a>

###  type

**● type**: *[IMiddlewareEventType](../#imiddlewareeventtype)*

Event type

___

