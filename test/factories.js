

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
