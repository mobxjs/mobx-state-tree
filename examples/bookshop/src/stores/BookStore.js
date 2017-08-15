import { types, getParent } from "mobx-state-tree"

export const Book = types.model("Book", {
    id: types.identifier(),
    name: types.string,
    author: types.string,
    price: types.number,
    isAvailable: true
})

export const BookStore = types
    .model("BookStore", {
        isLoading: true,
        books: types.map(Book)
    })
    .views(self => ({
        get shop() {
            return getParent(self)
        },
        get sortedAvailableBooks() {
            return sortBooks(self.books.values())
        }
    }))
    .actions(self => ({
        loadBooks() {
            self.shop.fetch("/books.json").then(self.receiveJson).catch(err => {
                console.error("Failed to load books ", err)
            })
        },
        receiveJson(json) {
            self.updateBooks(json)
            self.markLoading(false)
        },
        markLoading(loading) {
            self.isLoading = loading
        },
        updateBooks(json) {
            self.books.values().forEach(book => (book.isAvailable = false))
            json.forEach(bookJson => {
                self.books.put(bookJson)
                self.books.get(bookJson.id).isAvailable = true
            })
        }
    }))

function sortBooks(books) {
    return books
        .filter(b => b.isAvailable)
        .sort((a, b) => (a.name > b.name ? 1 : a.name === b.name ? 0 : -1))
}
