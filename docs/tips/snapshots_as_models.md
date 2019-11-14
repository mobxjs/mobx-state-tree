
#### Snapshots can be used to write values

Everywhere where you can modify your state tree and assign a model instance, you can also
just assign a snapshot, and MST will convert it to a model instance for you.
However, that is simply not expressible in static type systems atm (as the type written to a value differs to the type read from it).
As a workaround MST offers a `cast` function, which will try to fool the typesystem into thinking that an snapshot type (and instance as well)
is of the related instance type.

```typescript
const Task = types.model({
    done: false
})
const Store = types.model({
    tasks: types.array(Task),
    selection: types.maybe(Task)
})

const s = Store.create({ tasks: [] })
// `{}` is a valid snapshot of Task, and hence a valid task, MST allows this, but TS doesn't, so we need to use 'cast'
s.tasks.push(cast({}))
s.selection = cast({})
```

Additionally, for function parameters, MST offers a `SnapshotOrInstance<T>` type, where T can either be a `typeof TYPE` or a
`typeof VARIABLE`. In both cases it will resolve to the union of the input (creation) snapshot and instance type of that TYPE or VARIABLE.

Using both at the same time we can express property assignation of complex properties in this form:

```typescript
const Task = types.model({
    done: false
})
const Store = types
    .model({
        tasks: types.array(Task)
    })
    .actions(self => ({
        addTask(task: SnapshotOrInstance<typeof Task>) {
            self.tasks.push(cast(task))
        },
        replaceTasks(tasks: SnapshotOrInstance<typeof self.tasks>) {
            self.tasks = cast(tasks)
        }
    }))

const s = Store.create({ tasks: [] })

s.addTask({})
// or
s.addTask(Task.create({}))

s.replaceTasks([{ done: true }])
// or
s.replaceTasks(types.array(Task).create([{ done: true }]))
```

Additionally, the `castToSnapshot` function can be also used in the inverse case, this is when you want to use an instance inside an snapshot.
In this case MST will internally convert the instance to a snapshot before using it, but we need once more to fool TypeScript into
thinking that this instance is actually a snapshot.

```typescript
const task = Task.create({ done: true })
const Store = types.model({
    tasks: types.array(Task)
})

// we cast the task instance to a snapshot so it can be used as part of another snapshot without typing errors
const s = Store.create({ tasks: [castToSnapshot(task)] })
```

Finally, the `castToReferenceSnapshot` can be used when we want to use an instance to actually use a reference snapshot (a string or number).
In this case MST will internally convert the instance to a reference snapshot before using it, but we need once more to fool TypeScript into
thinking that this instance is actually a snapshot of a reference.

```typescript
const task = Task.create({ id: types.identifier, done: true })
const Store = types.model({
    tasks: types.array(types.reference(Task))
})

// we cast the task instance to a reference snapshot so it can be used as part of another snapshot without typing errors
const s = Store.create({ tasks: [castToReferenceSnapshot(task)] })
```

