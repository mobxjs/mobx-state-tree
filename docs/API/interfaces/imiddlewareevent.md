> **[mobx-state-tree](../README.md)**

[IMiddlewareEvent](imiddlewareevent.md) /

# Interface: IMiddlewareEvent

## Hierarchy

* [IActionContext](iactioncontext.md)

  * **IMiddlewareEvent**

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

## Properties

###  allParentIds

• **allParentIds**: *number[]*

Id of all events, from root until current (excluding current)

___

###  args

• **args**: *any[]*

*Inherited from [IActionContext](iactioncontext.md).[args](iactioncontext.md#args)*

Event arguments in an array (action arguments for actions)

___

###  context

• **context**: *`IAnyStateTreeNode`*

*Inherited from [IActionContext](iactioncontext.md).[context](iactioncontext.md#context)*

Event context (node where the action was invoked)

___

###  id

• **id**: *number*

*Inherited from [IActionContext](iactioncontext.md).[id](iactioncontext.md#id)*

Event unique id

___

###  name

• **name**: *string*

*Inherited from [IActionContext](iactioncontext.md).[name](iactioncontext.md#name)*

Event name (action name for actions)

___

###  parentActionEvent

• **parentActionEvent**: *[IMiddlewareEvent](imiddlewareevent.md) | undefined*

*Inherited from [IActionContext](iactioncontext.md).[parentActionEvent](iactioncontext.md#parentactionevent)*

Parent action event object

___

###  parentEvent

• **parentEvent**: *[IMiddlewareEvent](imiddlewareevent.md) | undefined*

Parent event object

___

###  parentId

• **parentId**: *number*

Parent event unique id

___

###  rootId

• **rootId**: *number*

Root event unique id

___

###  tree

• **tree**: *`IAnyStateTreeNode`*

*Inherited from [IActionContext](iactioncontext.md).[tree](iactioncontext.md#tree)*

Event tree (root node of the node where the action was invoked)

___

###  type

• **type**: *[IMiddlewareEventType](../README.md#imiddlewareeventtype)*

Event type