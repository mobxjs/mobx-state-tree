> **[mobx-state-tree](../README.md)**

[IActionContext](iactioncontext.md) /

# Interface: IActionContext

## Hierarchy

* **IActionContext**

  * [IMiddlewareEvent](imiddlewareevent.md)

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

Event arguments in an array (action arguments for actions)

___

###  context

• **context**: *`IAnyStateTreeNode`*

Event context (node where the action was invoked)

___

###  id

• **id**: *number*

Event unique id

___

###  name

• **name**: *string*

Event name (action name for actions)

___

###  parentActionEvent

• **parentActionEvent**: *[IMiddlewareEvent](imiddlewareevent.md) | undefined*

Parent action event object

___

###  tree

• **tree**: *`IAnyStateTreeNode`*

Event tree (root node of the node where the action was invoked)