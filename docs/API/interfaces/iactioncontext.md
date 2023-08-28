---
id: "iactioncontext"
title: "IActionContext"
sidebar_label: "IActionContext"
---

[mobx-state-tree - v5.2.0-alpha.2](../index.md) › [IActionContext](iactioncontext.md)

## Hierarchy

* **IActionContext**

  ↳ [IMiddlewareEvent](imiddlewareevent.md)

## Index

### Properties

* [args](iactioncontext.md#args)
* [context](iactioncontext.md#context)
* [id](iactioncontext.md#id)
* [name](iactioncontext.md#name)
* [parentActionEvent](iactioncontext.md#parentactionevent)
* [tree](iactioncontext.md#tree)

## Properties

###  args

• **args**: *any[]*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:20](https://github.com/mobxjs/mobx-state-tree/blob/9757a738/packages/mobx-state-tree/src/core/actionContext.ts#L20)*

Event arguments in an array (action arguments for actions)

___

###  context

• **context**: *IAnyStateTreeNode*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:15](https://github.com/mobxjs/mobx-state-tree/blob/9757a738/packages/mobx-state-tree/src/core/actionContext.ts#L15)*

Event context (node where the action was invoked)

___

###  id

• **id**: *number*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:9](https://github.com/mobxjs/mobx-state-tree/blob/9757a738/packages/mobx-state-tree/src/core/actionContext.ts#L9)*

Event unique id

___

###  name

• **name**: *string*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:6](https://github.com/mobxjs/mobx-state-tree/blob/9757a738/packages/mobx-state-tree/src/core/actionContext.ts#L6)*

Event name (action name for actions)

___

###  parentActionEvent

• **parentActionEvent**: *[IMiddlewareEvent](imiddlewareevent.md) | undefined*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:12](https://github.com/mobxjs/mobx-state-tree/blob/9757a738/packages/mobx-state-tree/src/core/actionContext.ts#L12)*

Parent action event object

___

###  tree

• **tree**: *IAnyStateTreeNode*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:17](https://github.com/mobxjs/mobx-state-tree/blob/9757a738/packages/mobx-state-tree/src/core/actionContext.ts#L17)*

Event tree (root node of the node where the action was invoked)
