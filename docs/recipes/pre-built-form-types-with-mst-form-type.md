---
id: pre-built-form-types-with-mst-form-type
title: Pre-built Form Types with MST Form Type
---

Find the `mst-form-type` library on npm: https://www.npmjs.com/package/mst-form-type.

## Introduction

Libraries like [Ant Design](https://ant.design/) have a built-in `Form` component that holds field status and validation rules. Integrating a `Form` component with MobX State Tree models can pose significant challenges as business logic become more complex.

That's where a solution like `mst-form-type` library comes into play. It models the Ant design field management like a conventional MobX-State-Tree type definition. Users can still use the UI of a component library and keep logic inside MobX-State-Tree, instead of syncing status changes between `Form` component and model.

Please note: The `mst-form-type` library primarily provides model types for the form structure. It does not encompass business logic related to field interactions.

## Setup

Setting up and utilizing the `mst-form-type` library is straightforward:

1. Install the `mst-form-type` library via npm:

```sh
npm install mst-form-type
```

2. Ensure you have `mobx-state-tree ^5.0.0` installed:

```sh
npm install mobx-state-tree@^5.0.0
```

Now that the general installation is complete, let's explore how to use it through a simple example. Although mobx-state-tree is designed to handle complex web application states, you might find the example a bit over-designed. However, the aim is to illustrate the idea of why using mst-form-type is helpful, so I've kept the logic as simple as possible.

## Example

To demonstrate the difference between mst-form-type and the Form component, I've created a comparative example. The form is straightforward, featuring two static fields and a dynamic field group with two fields inside. Certain fields have validation rules to illustrate how validation functions. Additionally, the value of a static field changes when the number of dynamic fields reaches a certain threshold.

### Ant Design `Form` component

I've utilized the [Ant Design](https://ant.design/) `Form` component for the example, although other libraries should have very similar implementations. Let's take a look at the Ant Design version first.

```tsx
import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button, InputNumber } from 'antd'

const { Option } = Select

const MyForm = () => {
  const [form] = Form.useForm()
  // extra state to handle field interaction logic
  const [members, setMembers] = useState([{ name: '', age: '' }])
  const [planValue, setPlanValue] = useState('')

  useEffect(() => {
    // handle field interaction in effect
    if (members.length > 1 && planValue === 'A') {
      form.setFieldsValue({ plan: 'B' })
    }

    if (members.length > 3 && planValue !== 'C') {
      form.setFieldsValue({ plan: 'C' })
    }
  }, [members, planValue, form])

  const onFinish = values => {
    console.log('Received values:', values)
  }

  // handle field interaction by another set of onChange events
  const handleAddMember = cb => {
    if (members.length <= 5) {
      setMembers([...members, { name: '', age: '' }])
      cb()
    }
  }

  const handleRemoveMember = (index, cb) => {
    const updatedMembers = [...members]
    updatedMembers.splice(index, 1)
    setMembers(updatedMembers)
    cb(index)
  }

  const handlePlanChange = value => {
    setPlanValue(value)
  }

  return (
    {/* useForm hook provides a form instance to hold field status */}
    <Form form={form} onFinish={onFinish}>
      {/* field need name props for form instance */}
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input your name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="plan"
        label="Plan"
        rules={[{ required: true, message: 'Please select a plan!' }]}
      >
        {/* extra event handler for field logic */}
        <Select onChange={handlePlanChange}>
          <Option value="A" disabled={members.length > 1}>
            A
          </Option>
          <Option value="B" disabled={members.length >= 3}>
            B
          </Option>
          <Option value="C">C</Option>
        </Select>
      </Form.Item>
      <Form.List name="members">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div key={key}>
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  label="Member Name"
                  rules={[{ required: true, message: 'Please input member name!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'age']} label="Member Age">
                  <InputNumber />
                </Form.Item>
                {/* extra event handler for field logic */}
                <Button type="link" onClick={() => handleRemoveMember(index, remove)}>
                  Remove
                </Button>
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  // pass form instance method as callback
                  handleAddMember(add)
                }}
                style={{ width: '100%' }}
              >
                Add Member
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default MyForm
```

The code reveals that to manage field logic, we need to maintain a second copy of the field value in React state and attach additional event handlers to Input or other components. Subsequently, we handle the logic within useEffect hooks using form instance APIs.

However, this approach can quickly become unmaintainable as the logic complexity increases. Furthermore, it is challenging to integrate with other application states in MST. This is because MST does not inherently manage field statuses; instead, the form instance does so.

### mst-form-type

Now, let's examine how the same example looks when using mst-form-type. The code can be split into two files: one for the UI and the other for the model. Let's start by reviewing the model file.

```typescript
// model.ts
import { types } from "mobx-state-tree"
import createForm from "mst-form-type"

// define form in schema
export const FormSchema = {
  static: [
    {
      id: "name",
      default: "",
      validator: "required"
    },
    {
      id: "plan",
      default: "A"
    }
  ],
  dynamic: [
    {
      id: "member",
      limit: 5,
      schema: [
        {
          id: "name",
          default: "",
          validator: "required"
        },
        {
          id: "age",
          default: "",
          validator: "required"
        }
      ],
      default: [{ name: "John", age: 20 }],
      onAdd: (i) => {
        // hooks run when add dynamic fields
        console.log("add", i)
      },
      onRemove: (i) => {
        // hooks run when remove dynamic fields
        console.log("remove", i)
      },
      onEdit: (i) => {
        // hooks run when edit dynamic fields, only be called when edit field by form action
        console.log("edit", i)
      }
    }
  ]
}

// App model
export const Example = types
  .model("FormExample")
  .props({
    form: createForm(FormSchema) // form as a model type
  })
  .views((self) => ({
    get disableA() {
      return self.form.member.size > 1
    },
    get disableB() {
      return self.form.member.size > 3
    }
  }))
  .actions((self) => ({
    onAddFields() {
      // field logic
      if (self.form.member.size > 1 && self.form.plan.value === "A") {
        self.form.plan.setValue("B")
      } else if (self.form.member.size > 3 && self.form.plan.value !== "C") {
        self.form.plan.setValue("C")
      }
    }
  }))
```

In the model file, we declare a form schema and create the form model. Subsequently, all relevant field models are created within the form model. An action is added to the model to handle field logic, illustrating that mst-form-type doesn't manage business logic but solely holds form and field statuses.

Now, let's examine how the model is utilized by the UI, which is still built using Ant Design.

```tsx
// model.ts
import React, { useContext } from 'react'
import { Form, Input, Select, Button, InputNumber } from 'antd'
import { model, ModelContext } from '~/models'
import { observer } from 'mobx-react-lite'

const { Option } = Select

const MyForm = () => {
  // get model instance via context
  const model = useContext(ModelContext)

  const onFinish = values => {
    // 在这里计算价格
    console.log('Received values:', model.form.submit())
  }

  return (
    {/* no form instance need */}
    <Form onFinish={onFinish}>
      {/* get field status from MST */}
      <Form.Item
        label="Name"
        validateStatus={model.form.name.invalid && 'error'}
        help={model.form.name.invalid && model.form.name.msg}
      >
        {/* controlled component using MST props and action */}
        <Input
          value={model.form.name.value}
          onChange={e => model.form.name.setValue(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Plan">
        <Select value={model.form.plan.value} onChange={value => model.form.plan.setValue(value)}>
        {/* computed value */}
          <Option value="A" disabled={model.disableA}>
            A
          </Option>
          <Option value="B" disabled={model.disableB}>
            B
          </Option>
          <Option value="C">C</Option>
        </Select>
      </Form.Item>
      <>
        {/* render dynamic fields */}
        {model.form.member.fields.map(({ id, ...field }) => {
          return (
            <div key={id}>
              {/* access individual dynamic fields */}
              <Form.Item label="Member Name">
                <Input
                  value={field.name.value}
                  onChange={e => {
                    field.name.setValue(e.target.value)
                  }}
                />
              </Form.Item>
              <Form.Item label="Member Age">
                <InputNumber
                  value={field.age.value}
                  onChange={e => field.age.setValue(e.target.value)}
                />
              </Form.Item>
              <Button
                type="link"
                onClick={() => {
                  // dynamic fields built-in action
                  model.form.member.removeFields(id)
                }}
              >
                Remove
              </Button>
            </div>
          )
        })}
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => {
              model.form.member.addFields({ name: '', age: 20 })
              // handle business logic
              model.onAddFields()
            }}
          >
            Add Member
          </Button>
        </Form.Item>
      </>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
// wrap the component by mobx observer
export default observer(MyForm)
```

Essentially, `mst-form-type` eliminates the need for a form instance, allowing us to have only one copy of field status, which resides within the MST. Components no longer need to manage form-related states; instead, they simply read state from the MST and render accordingly.

There are two methods to retrieve or set field values. One involves using actions on each field instance, as demonstrated in the example code. The other method utilizes actions on the form type instance, specifying the field id defined in the form schema. Refer to the "APIs" section below for more details.

## How It Works

The `mst-form-type` library exports a function which creates a form model (based on the base form model under the hood) using the provided schema and an optional name. Each form type model create its own type, and then instance by MST, which makes every attribute and method independent. So that you can have multiple form type `props` in a single MST model. User can conveniently interact with the form field via form props, or apply the form model actions to directly get or set field values. Let's see the architecture of `mst-form-type` first, and then we will go through most of the useful APIs

### Architecture

The library defines three model types under the hood:

- **Field Model**: Contains props and actions of a form field, such as `value`, `default`, `id`, `valid()`, etc.

- **Group Model**: Built for handling a collection of field models as dynamic fields. Each dynamic field group should maintain uniformity in structure. The model also provides actions as life cycle hooks for adding, editing, and removing dynamic fields.

- **Base Form Model**: Encapsulates all field and group models and the associated form methods. The exported function will build a form model with fields defined in schema on top of the base form model.

### APIs

**default export**

The default exported method will generate a new custom types.model with all the fields in the schema as props, based on a base model type. The newly created form type will automatically initialize with the schema upon creation. Optionally, a name can be passed for tracking purposes; otherwise, it will default to the base model name.

```typescript
type TValidator = "required" | ((...args: any[]) => boolean) | RegExp | undefined | null

type TValue = string | boolean | number | Record<string, string> | Array<any>

interface FieldSchema {
  id: string
  type?: "string" | "number" | "boolean" | "object" | "array"
  default: TValue
  validator?: TValidator
  msg?: string
}
```

#### Field

##### schema

```typescript
type TValidator = "required" | ((...args: any[]) => boolean) | RegExp | undefined | null

type TValue = string | boolean | number | Record<string, string> | Array<any>

interface FieldSchema {
  id: string
  type?: "string" | "number" | "boolean" | "object" | "array"
  default: TValue
  validator?: TValidator
  msg?: string
}
```

##### props

`id`

`types.identifier`. The key of each field in a form, and will become the form type props key. It should be unique and will be used to access field value and in `setValue()` form action.

`value`

The props hold the field value. The value type can be `string`, `boolean`, `number`, `object`, `array`. `object` and `array` will be tranform to `types.frozen` as a MST leaf.

`default`

The default value of a field. The Mobx State Tree will decide `prop` type based on the type of this value.

`validator`

Optional & Private. All validators will be called in `valid()` before `submit()`.

`'required'` means this field cannot be falsy values, like `0`, `''`, or `undefined`.

`((...args: any[]) => boolean)` means a function return a boolean value. If returned `true`, the validation will be treated passed.

`RegExp` means the value will be used in `RegExp.test()`. If returned `true`, the validation will be treated passed.

`undefined | null` will not be processed.

`msg`

Optional. Message shows when field is invalid. The default message is `'The input is invalid'`

`invalid`

Compute value. Return revert value of `invalid()` result

##### actions

**`setValue(value)`**

Update field value.

**`valid()`**

Run field validator if it has.

**`reset()`**

Reset field value to default value.

> actions below will be less frequent to use.

`setValidator(rawValidator: TValidator)`

Change field validator after initialization

`init(field: IField)`

Rerun field initialization

`setErrorMsg(msg: string)`

Change invalid message

`clear()`

Set field value to `null`

##### code example

```typescript
form[id].value
form[id].invalid
form[id].setValue("new-value")
form[id].reset()
form[id].valid()
```

#### Dynamic Field Group

##### schema

```typescript
interface DynamicFields {
  id: string
  limit: number
  schema: FieldSchema | FieldSchema[]
  default?: Array<Record<string, TValue>>
  onAdd?: (field) => any
  onRemove?: (field) => any
  onEdit?: (field) => void
}
```

##### props

`id`

`types.identifier`. The key of each dynamic field group in a form, and will become the form type props key. It should be unique and will be used to access field value and in `setDynamicValue()` form action.

`fields`

An array holds all dynamic field models. `schema` in the interface is to define field schema here. Object in `default` array will be used to create dynamic fields when form initializing.

`limit`

Optional. Maxium dynamic field allowed. default is `-1`, means unlimited.

##### actions

**`addFields(i, isInit = false)`**

Add new dynamic field `i`. You don't need to pass isInit flag when calling the action. It is used for not calling `onAdd` hooks in schema when initialization.

**`removeFields(id: string)`**

Remove the field with specific `id`. This action will call the `onRemove` hook if passed.

**`editField(id: string, fieldKey: string, value)`**

Edit `fieldKey` field with `id` to `value`. This action will call the `onEdit` hook if passed.

> actions below will be less frequent to use.

`getValues()`

Get all dynamic field values/

`valid()`

Valid all dynamic field.

`reset()`

Reset all dynamic fields.

##### code example

```typescript
form[id].fields.map(field => { ... })
form[id].addFields(field)
form[id].removeFields('id')
form[id].editField('id', 'key', 'value')
form[id].getValues() // get all dynamic field values, rarely used
form[id].valid() // valid all dynamic field, rarely used
form[id].reset() // reset all dynamic field, rarely used
```

#### Form

##### schema

```typescript
interface FormSchema {
  static: FieldSchema[]
  dynamic?: DynamicFields[]
}
```

##### props

**fields**

Every field in `schema` will become a field `prop` of form type. The type of each field will be based on `default` value.

**`submission`**

A snapshot of last success submitted form values, in Key-Value object format.

`error`

An object in Key-Value format contains validation error of each field. This will be cleared on every `valid()` call.

`_internalStatus`

Indicate the form status, has 4 values: `'init', 'pending', 'success', 'error'`. Usually you don't need it, it will change according to form status.

`loading`

Compute value. Return `true` when form status is 'pending'. Designed for avoiding duplicated submission.

##### actions

**`setValue({ key, value })`**

Set **static** field value in a form type. `_internalStatus` is reserved.

**`setDynamicValue({ groupId, id, key, value })`**

Set **dynamic** field value in a form type. Each dynamic field has a field group id and a field id. Or you can use the `setValue` action on instance to do the same job.

**`submit()`**

It will return all field values if passed validation in Key-Value format object. The last valid submission will be hold in `submission` props.

**The method will not submit the form in any form of action. It only output the form current values. You need to handle to real submission action yourself.**

> actions below will be less frequent to use.

`init()`

It will be called after new custom type created with schema. It will process the schema to get default values and validators.

`valid()`

It will run all validators in schema with current field values. It will be called in `submit()`, and produce `error` if any error happens.

`reset()`

It will set the form type to `init` status, clearing submissions and errors. All fields will be set to default values passed by schema.

##### code example

```typescript
form.setValue({ key, value })
form.setDynamicValue({ groupId, id, key, value })
form.submit()
form.rest()
form.onAdd(id, field)
form.onRemove(groupId, fieldId)
form.onEdit(groupId, fieldId, key, value)
form.clear(groupId)
```
