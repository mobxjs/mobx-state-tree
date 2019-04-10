[mobx-state-tree](../README.md) > [IActionContext](../interfaces/iactioncontext.md)

# Interface: IActionContext

## Hierarchy

**IActionContext**

↳  [IMiddlewareEvent](imiddlewareevent.md)

## Index

### Properties

* [args](iactioncontext.md#args)
* [context](iactioncontext.md#context)
* [id](iactioncontext.md#id)
* [name](iactioncontext.md#name)
* [parentActionEvent](iactioncontext.md#parentactionevent)
* [tree](iactioncontext.md#tree)

---

## Properties

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
<a id="tree"></a>

###  tree

**● tree**: *`IAnyStateTreeNode`*

Event tree (root node of the node where the action was invoked)

___

