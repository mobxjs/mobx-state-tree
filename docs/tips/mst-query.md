# mst-query

Mst-query is a query library designed specifically for MobX-State-Tree. It's like react-query but with the caching layer replaced with a MobX-State-Tree store. 

The main features are:

* Async data managment with React hooks
* Invalidating queries when data changes
* Automatic normalization
* Garbage collection

In this recipies section, we'll talk briefly about each of these features and how it can help you use Mobx-State-Tree more effeciently.

## Async data managment with React hooks

Rolling your own React hook for fetching data in components can be tricky. Handling all possible edge cases that may arise is both difficult and error prone. 

Using a third party hook is a more solid option. But this can often lead to unnecessary data duplication as data will be stored both in the cache of the hook and in your models. 

Mst-query offers a convenient way of fetching data in your component that directly integrates with MobX-State-Tree.

```tsx
// Regular mst
const Todo = observer(({ id }) => {
  useEffect(() => {
    store.loadTodo(id);
  }, [id]);  
  
  if (store.todoError) return <div>Got an error...</div>;
  
  if (store.todoIsLoading) return <div>Is loading...</div>;
  
  return <Todo todo={store.todo} />;
});

// With mst-query
const Todo = observer(({ id }) => {
  const { data, error, isLoading } = useQuery(store.todoQuery, { request: { id } })  
  
  if (error) return <div>Got an error...</div>;
  
  if (isLoading) return <div>Is loading...</div>;

  return <Todo todo={data} />;
});
```

## Invalidating queries when data changes

TODO

## Creating queries

In mst-query, queries are just models. This means you are free to observe and update them like regular models. You define a query model with `createQuery`.

```ts
const LoadTodo = createQuery("LoadTodoQuery", {
  data: t.reference(Todo),
  request: t.model({ id: types.string }),
  async endpoint({ request }) {
    return api.fetchTodo(request.id)
  }
});
```

The first option `data` is the shape of the data returned from the endpoint. The second option, `request` is the arguments that will be passed along to the `endpoint` function. Both `data` and `request` are runtime typechecked.

## Automatic normalization

An unique feature of mst-query is that data received from the server is automatically normalized. Since queries already know the shape of the data returned from the api they consume, we can automate the process of creating and updating models with identifiers.

```ts
import { t, flow } from "mobx-state-tree"

const User = types.model("User", {
  id: t.identifier,
  name: t.string
})

const Todo = t.model("Todo", {
  id: t.identifier,
  title: t.string,
  done: t.boolean,
  createdBy: t.reference(User)
})

// Before, regular mst
const TodoStore = t
  .model("RootStore", {
    todos: t.map(Todo)
  })
  .actions((self) => ({
    loadTodo: flow(function* loadTodo(todoId: string) {
        const todo = yield api.fetchTodo(todoId);

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

// After, with mst-query
const UserStore = createModelStore('UserStore', User);

const TodoStore = createModelStore("TodoStore", Todo).props({
  loadTodo: createQuery("LoadTodoQuery", {
    data: types.reference(Todo),
    request: types.model({ id: types.string }),
    async endpoint({ request }) {
      return api.fetchTodo(request.id)
    }
  })
})

const RootStore = createRootStore({
    userStore: types.optional(UserStore, {}),
    todoStore: types.optional(TodoStore, {})
});
```

The functions `createRootStore` and `createModelStore` lets mst-query know about your models that should be normalized. Note that we don't have to manually update the createdBy property on the todo, as this is done automatically for us. 

In this example we only had one nested data model in our api response. But in a real worl scenario, for example when quering a graphql endpoint, you can easily have to handle dozens of similar properties. Mst-query will normalize all of these for you without additional code.


## Garbage collection

TODO