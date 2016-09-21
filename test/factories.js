

const messageFactory = createFactory((env) => ({
    message: null, // all readonly
    comments: [commentFactory],
    likes: map(),
    authorId: null,
    get author() {
        return env.resolve(`/users/${this.authorId}`)
    },
    like: action(userId => { // only actions can ever modify this object. params must be pure
        this.likes.set(userId, true)
    })
}))

const message = messageFactory({
        message: "test"
    }, {
        fetch: window.fetch
})

factory(snapshot)
onAction(message, ({ name, path, args })) // fires only for top level actions!
onPatch()
onSnapshot()
subscribe() // alias for on Snapshot
applyPatch()
applyAction()
intercept() // from mobx

getSnapshot()
getParent()
getPath()
getPathParts()
isRoot()
resolve()
getEnv()