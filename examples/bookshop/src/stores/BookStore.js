import { types, getParent } from "mobx-state-tree"

export const Book = types.model("Book", {
    id: types.identifier(),
    name: types.string,
    author: types.string,
    price: types.number,
    isAvailable: true
})

export const BookStore = types.model("BookStore", {
        isLoading: true,
        books: types.map(Book),
        get shop() {
            return getParent(this)
        },
        get sortedAvailableBooks() {
            return sortBooks(this.books.values())
        }
    }, {
        loadBooks() {
            this.shop.fetch("/books.json")
                .then(this.receiveJson)
                .catch(err => {
                    console.error("Failed to load books ", err)
                })
        },
        receiveJson(json) {
            this.updateBooks(json)
            this.markLoading(false)
        },
        markLoading(loading) {
            this.isLoading = loading
        },
        updateBooks(json) {
            this.books.values().forEach(book => book.isAvailable = false);
            json.forEach(bookJson => {
                this.books.put(bookJson)
                this.books.get(bookJson.id).isAvailable = true
            });
        }
})

function sortBooks(books) {
    return books
        .filter(b => b.isAvailable)
        .sort((a, b) =>
            a.name > b.name
                ? 1
                : a.name === b.name
                    ? 0
                    : -1
        )
}