---
id: "imiddlewareevent"
title: "IMiddlewareEvent"
sidebar_label: "IMiddlewareEvent"
---

[mobx-state-tree - v5.2.0-alpha.1](../index.md) › [IMiddlewareEvent](imiddlewareevent.md)

## Hierarchy

* [IActionContext](iactioncontext.md)

  ↳ **IMiddlewareEvent**

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

*Defined in [packages/mobx-state-tree/src/core/action.ts:37](https://github.com/mobxjs/mobx-state-tree/blob/bac4349d/packages/mobx-state-tree/src/core/action.ts#L37)*

Id of all events, from root until current (excluding current)

___

###  args

• **args**: *any[]*

*Inherited from [IActionContext](iactioncontext.md).[args](iactioncontext.md#args)*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:20](https://github.com/mobxjs/mobx-state-tree/blob/bac4349d/packages/mobx-state-tree/src/core/actionContext.ts#L20)*

Event arguments in an array (action arguments for actions)

___

###  context

• **context**: *IAnyStateTreeNode*

*Inherited from [IActionContext](iactioncontext.md).[context](iactioncontext.md#context)*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:15](https://github.com/mobxjs/mobx-state-tree/blob/bac4349d/packages/mobx-state-tree/src/core/actionContext.ts#L15)*

Event context (node where the action was invoked)

___

###  id

• **id**: *number*

*Inherited from [IActionContext](iactioncontext.md).[id](iactioncontext.md#id)*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:9](https://github.com/mobxjs/mobx-state-tree/blob/bac4349d/packages/mobx-state-tree/src/core/actionContext.ts#L9)*

Event unique id

___

###  name

• **name**: *string*

*Inherited from [IActionContext](iactioncontext.md).[name](iactioncontext.md#name)*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:6](https://github.com/mobxjs/mobx-state-tree/blob/bac4349d/packages/mobx-state-tree/src/core/actionContext.ts#L6)*

Event name (action name for actions)

___

###  parentActionEvent

• **parentActionEvent**: *[IMiddlewareEvent](imiddlewareevent.md) | undefined*

*Inherited from [IActionContext](iactioncontext.md).[parentActionEvent](iactioncontext.md#parentactionevent)*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:12](https://github.com/mobxjs/mobx-state-tree/blob/bac4349d/packages/mobx-state-tree/src/core/actionContext.ts#L12)*

Parent action event object

___

###  parentEvent

• **parentEvent**: *[IMiddlewareEvent](imiddlewareevent.md) | undefined*

*Defined in [packages/mobx-state-tree/src/core/action.ts:32](https://github.com/mobxjs/mobx-state-tree/blob/bac4349d/packages/mobx-state-tree/src/core/action.ts#L32)*

Parent event object

___

###  parentId

• **parentId**: *number*

*Defined in [packages/mobx-state-tree/src/core/action.ts:30](https://github.com/mobxjs/mobx-state-tree/blob/bac4349d/packages/mobx-state-tree/src/core/action.ts#L30)*

Parent event unique id

___

###  rootId

• **rootId**: *number*

*Defined in [packages/mobx-state-tree/src/core/action.ts:35](https://github.com/mobxjs/mobx-state-tree/blob/bac4349d/packages/mobx-state-tree/src/core/action.ts#L35)*

Root event unique id

___

###  tree

• **tree**: *IAnyStateTreeNode*

*Inherited from [IActionContext](iactioncontext.md).[tree](iactioncontext.md#tree)*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:17](https://github.com/mobxjs/mobx-state-tree/blob/bac4349d/packages/mobx-state-tree/src/core/actionContext.ts#L17)*

Event tree (root node of the node where the action was invoked)

___

###  type

• **type**: *[IMiddlewareEventType](../index.md#imiddlewareeventtype)*

*Defined in [packages/mobx-state-tree/src/core/action.ts:27](https://github.com/mobxjs/mobx-state-tree/blob/bac4349d/packages/mobx-state-tree/src/core/action.ts#L27)*

Event type
