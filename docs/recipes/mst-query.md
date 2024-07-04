---
id: mst-query
title: Manage Asynchronous Data with mst-query 
---

Find the `mst-query` library on GitHub: https://github.com/ConrabOpto/mst-query.

# mst-query

mst-query is a query library designed specifically for MobX-State-Tree. It functions similarly to [react-query](https://tanstack.com/query/latest) but operates as a thin layer on top of a MobX-State-Tree store.

Key features include:

* Asynchronous data management with React hooks
* Automatic normalization
* Query invalidation upon stale data
* Imperative api
* Optimistic update
* Garbage collection

In this recipes section, we'll briefly discuss each of these features and how they solve common problems when using MST.

## Async data managment with React hooks

Creating your own React hook for data fetching in components can be challenging. Managing all potential edge cases that may arise is both complex and error-prone.

Opting for a third-party hook provides a more reliable solution. However, this approach can sometimes lead to redundant data storage, as data may be cached within the hook as well as within your models.

mst-query offers a convenient method for fetching data directly within your components, seamlessly integrating with MST:

```tsx
// Regular MST:
const Todo = observer(({ id }) => {
  useEffect(() => {
    store.loadTodo(id);
  }, [id]);  
  
  if (store.todoError) return <div>Got an error...</div>;
  
  if (store.todoIsLoading) return <div>Is loading...</div>;
  
  return <Todo todo={store.todo} />;
});

// With mst-query:
const Todo = observer(({ id }) => {
  const { data, error, isLoading } = useQuery(store.todoQuery, { request: { id } })  
  
  if (error) return <div>Got an error...</div>;
  
  if (isLoading) return <div>Is loading...</div>;

  return <Todo todo={data} />;
});
```

## Creating queries

In mst-query, queries are treated as models. This means you can observe and update them just like regular models. You define a query model using `createQuery`:

```ts
const LoadTodoQuery = createQuery("LoadTodoQuery", {
  data: t.reference(Todo),
  request: t.model({ id: t.string }),
  async endpoint({ request }) {
    return todoApi.get(request.id)
  }
});
```

The first option, `data`, represents the shape of the data returned from the endpoint. The second option, `request`, represents the arguments passed to the endpoint function. Both data and request undergo runtime type checking.

## Automatic normalization

A unique feature of mst-query is that data received from the server is automatically normalized. Because queries already understand the shape of the data returned from the API they consume, we can automate the process of creating and updating models with identifiers:

```ts
import { t, flow } from "mobx-state-tree"

const User = t.model("User", {
  id: t.identifier,
  name: t.string
})

const Todo = t.model("Todo", {
  id: t.identifier,
  title: t.string,
  message: t.string,
  done: t.boolean,
  createdBy: t.reference(User)
})

// Regular MST:
const TodoStore = t
  .model("RootStore", {
    todos: t.map(Todo)
  })
  .actions((self) => ({
    loadTodo: flow(function* loadTodo(todoId: string) {
        const todo = yield todoApi.getTodo(todoId);

        const root = getRoot(self);
        const user = root.userStore.createOrUpdateUser(todo.createdBy);
        todo.createdBy = user;

        const oldTodo = self.todos.get(todoId);
        if (!oldTodo) {
          self.todos.put({ todo });
        } else {
          self.todos.put({ ...getSnapshot(oldTodo), ...todo });
        }
    })
  }))

// With mst-query:
const UserStore = createModelStore('UserStore', User);

const TodoStore = createModelStore("TodoStore", Todo).props({
  todoQuery: createQuery("TodoQuery", {
    data: t.reference(Todo),
    request: t.model({ id: t.string }),
    async endpoint({ request }) {
      return todoApi.getTodo(request.id)
    }
  })
})

const RootStore = createRootStore({
    userStore: t.optional(UserStore, {}),
    todoStore: t.optional(TodoStore, {})
});
```

The functions `createRootStore` and `createModelStore` let mst-query know about your models that should be normalized. Note that you don't have to manually update the createdBy property on the todo, as this is done automatically for you.

In this example, we only had one nested data model in our response. However, in a real-world scenario, such as querying a GraphQL endpoint, you may need to handle dozens of similar properties. Mst-query will normalize all of these for you without additional code.

## Query invalidation upon stale data

Just like in react-query, you can pass a `staleTime` option to `useQuery`. This ensures your data gets periodically updated as the user navigates through your app. The default value of `staleTime` is 0, which means your users always see fresh data.

In mst-query, models are also automatically updated when you use `createMutation` and `mutate`. The only requirements are that your API returns the new data and that the data property is a reference type:

```ts
const TodoRequestModel = t.model({ id: t.string, done: t.boolean, title: t.string });

const TodoUpdateMutation = createMutation("TodoUpdateMutation", {
    data: t.reference(Todo),
    request: TodoRequestModel,
    async endpoint({ request }) {
      return todoApi.update(request)
    }
});

const TodoStore = createModelStore("TodoStore", Todo)
  .props({
    todoQuery: TodoQuery,
    todoUpdateMutation: TodoUpdateMutation
  })
  .actions(self => ({
    update(data) {
      // When mutate successfully resolves, the Todo will be automatically updated.
      self.todoUpdateMutation.mutate({ request: data });
    }
  }))
```

You can also manually refetch a query by calling `invalidate`. This pairs nicely with `createMutation` and a new listener called `onMutate`.

A common use case for this is refetching a list of items:

```tsx
const TodoListQuery = createQuery("TodoListQuery", {
    data: t.array(t.reference(Todo)),
    async endpoint() {
      return todoApi.getList();
    }
});

const TodoAddMutation = createMutation("TodoAddMutation", {
    data: t.reference(Todo),
    request: TodoRequestModel,
    async endpoint({ request }) {
      return todoApi.update(request)
    }
});

const TodoStore = createModelStore("TodoStore", Todo)
  .props({
    todoListQuery: TodoListQuery,
    todoAddMutation: todoAddMutation
  })
  .actions(self => ({
    afterCreate() {
      onMutate(self.todoAdd, (result) => {
        // Call invalidate to refetch the list...
        self.todoListQuery.invalidate();

        // ...or add the new item directly if you don't need to refetch
        self.todoListQuery.data.push(result);
      });
    }  
  }));

const TodoListContainer = observer(() => {
  const { data } = useQuery(store.todoListQuery);
  
  const [addTodo, { isLoading }] = useMutation(store.todoAddMutation);
  
  return <TodoList todos={data} onAdd={addTodo} isAdding={isLoading} />;
});
```

## Imperative api

Using hooks is convenient, but sometimes your data fetching logic can become more complex, resulting in a lot of business logic in your components.

Thankfully, most things you can do with hooks can also be accomplished with an imperative API:

```tsx
const TodoStore = createModelStore("TodoStore", Todo)
  .props({
    todoQuery: TodoQuery,
    todoUpdateMutation: TodoUpdateMutation
  })
  .volatile(self => ({
    permssionError: '',
    updateResult: null
  }))
  .actions(self => ({
    updateTodo: flow(function* (request) {
      const result = yield todoApi.checkPermissions(request.id);
      if (!result.ok) {
        self.permissionError = 'You are not allowed to edit this resource';
        return;
      }

      const { error, result: updateResult } = yield self.todoUpdateMutation.mutate({ request });
      if (error) {
        logApi.sendLog(error.message);
      }

      self.updateResult = updateResult;
    });
  }));

const TodoLoader = async (id) => {
  // Manual fetch in a route loader. This is also how you prefetch data.
  const todo = await store.todoQuery.query({ request: { id } });
  return <TodoContainer todo={todo} store={store}  />;
};

const TodoContainer = observer((props) => {    
  const { todo, store } = props;
  return (
    <Todo 
      todo={todo} 
      onUpdate={store.updateTodo} 
      permissionError={store.permissionError} 
    />
  );
});
```

The imperative API supports most of the features in mst-query. However, automatically refetching a query when it's stale—either by passing `staleTime` or calling `invalidate`—is currently not supported.

## Optimistic update

Optimistic updates are important for a UI to feel responsive. You achieve this in mst-query by passing your update to the `optimisticUpdate` option in `mutate`. When the mutate call resolves, whether successfully or not, the optimistic update is automatically rolled back.

```ts
const serverTodo = yield self.todoAddMutation.mutate({
  request: data,
  optimisticUpdate() {
    // createModelStore provides a merge action that you can use to manually create models
    const clientTodo = todoStore.merge({
      id: `${Math.random()}`,
      title: data.title,
      done: data.done,
      createdBy: loggedInUserId
    });

    todoStore.todoListQuery.push(clientTodo);
  }
});

todoStore.todoListQuery.push(serverTodo);
```

## Garbage collection

Consider a scenario where an MST application fetches a list of items from an API. Over time, items may be added, updated, or removed. In regular MST, every item fetched remains in memory unless you manually remove them. If the list is paginated, the problem is even larger.

Since mst-query tracks all models via queries, it can safely remove unused models. You do this by calling runGc on the rootStore:

`rootStore.runGc()`