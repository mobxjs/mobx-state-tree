import { types, getParent } from "mobx-state-tree"

export const ViewStore = types
    .model({
        page: "books",
        selectedBookId: ""
    })
    .views(self => ({
        get shop() {
            return getParent(self)
        },
        get isLoading() {
            return self.shop.isLoading
        },
        get currentUrl() {
            switch (self.page) {
                case "books":
                    return "/"
                case "book":
                    return "/book/" + self.selectedBookId
                case "cart":
                    return "/cart"
                default:
                    return "/404"
            }
        },
        get selectedBook() {
            return self.isLoading || !self.selectedBookId
                ? null
                : self.shop.books.get(self.selectedBookId)
        }
    }))
    .actions(self => ({
        openBooksPage() {
            self.page = "books"
            self.selectedBookId = ""
        },
        openBookPage(book) {
            self.page = "book"
            self.selectedBookId = book.id
        },
        openBookPageById(id) {
            self.page = "book"
            self.selectedBookId = id
        },
        openCartPage() {
            self.page = "cart"
            self.selectedBookId = ""
        }
    }))
