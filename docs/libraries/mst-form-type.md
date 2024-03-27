# MST Form Type

npm: https://www.npmjs.com/package/mst-form-type

## Introduction

Librarys like Ant Design has a build-in Form component that can hold fields status and validation rules. This component houses its own store to sustain internally related field statuses and can be conveniently used independently. integrating Form component with MobX State Tree models can pose significant challenges as business logic grows intricately complex.

The `mst-form-type` library comes into play. It provides the field management feature of Ant Design Form component in Mobx State Tree model way. Users can only use the UI of a component library, but keep logic inside your Mobx State Tree model context, instead of syncing status changes between Form component and model.

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

3. Declare a form schema and create the form model, subsequently, all the relevant field models would then be created in a form model. An example schema look like this:

```typescript
const dynamicForm: FormSchema = {
  static: [
    {
      id: 'name',
      default: '',
      validator: 'required',
    },
    {
      id: 'des',
      default: '',
    },
  ],
  dynamic: [
    {
      id: 'price', // group id
      limit: 100,
      schema: [
        {
          id: 'itemName',
          default: '',
          validator: 'required',
        },
        {
          id: 'itemPrice',
          default: 10,
        },
      ],
      default: [
        {
          itemName: 'itemName1',
          itemPrice: 5,
        },
        {
          itemName: 'itemName2',
          itemPrice: 20,
        },
      ],
      onAdd: i => {
        console.log('add', i)
      },
      onRemove: i => {
        console.log('remove', i)
      },
      onEdit: key => {
        console.log('edit', key)
      },
    },
  ],
}
```

## How It Works

The `mst-form-type` library exports a function, which creates a form model based on the base form model underhood using a form schema and an optional name. Each form type model implements its own type, and every attribute and method is independent. The user can conveniently interact with the form field via form props, or apply the form model action to directly get or set field values.

## Architecture

The library defines three model types under the hood:

- **Field Model**: Contains props and actions of a form field, such as value, default, id, valid, etc.

- **Group Model**: Built for handling a collection of field models as dynamic fields. Each dynamic field group should maintain uniformity in structure. The model also provides actions as life cycle hooks for adding, editing, and removing dynamic fields.

- **Base Form Model**: Encapsulates all field and group models and the associated form methods. The exported function will build a form model with fields defined in schema on top of the base form model.
