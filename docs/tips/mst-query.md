# Tracking query state and normalize result

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
  dateCreated: t.Date,
  description: t.string,
  createdBy: t.reference(User)
})

// Before, standard mobx-state-tree
const TodoStore = t
  .model("RootStore", {
    todos: t.map(Todo)
  })
  .volatile((self) => ({
    loadTodoState: "pending",
    loadTodoError: null,
  }))
  .actions((self) => ({
    loadTodo: flow(function* loadTodo(todoId: string) {
      self.loadTodoState = "pending"
      try {
        const todo = yield api.fetchTodo(todoId)

        const root = getRoot(self)
        const user = root.userStore.getUser(todo.createdBy)
        todo.createdBy = user

        const oldTodo = self.todos.get(todoId)
        if (!oldTodo) {
          self.todos.put({ todo })
        } else {
          self.todos.put({ ...getSnapshot(oldTodo), ...todo })
        }
        self.loadTodoState = "done"
      } catch (err) {
        self.loadTodoError = err
        self.loadTodoState = "error"
      }
    }),
  }))

// After, with mst-query
const TodoStore = createModelStore("TodoStore", Todo)
  .props({
    loadTodo: createQuery("LoadTodoQuery", {
      data: types.reference(Todo),
      request: types.model({ id: types.string }),
      async endpoint({ request }) {
        return api.fetchTodo(request.id)
      }
    }),
  });
```

# Fetching data in React
```tsx
// Before
const Todo = ({ id }) => {
    useEffect(() => {
        // fires twice in strict mode
        // doesn't refetch if data is stale
       store.loadTodo(id);
    }, [id]);
}; 


// After
const Todo = ({ id }) => {
    const { data } = useQuery({ request: { id } });
}; 

```
