import { types, getParent } from "mobx-state-tree"

export const ViewStore = types.model({
    page: "books",
    selectedBookId: "",
    get shop() {
      return getParent(this)
    },
    get isLoading() {
      return this.shop.isLoading
    },
    get currentUrl() {
      switch (this.page) {
        case "books":
          return "/"
        case "book":
          return "/book/" + this.selectedBookId
        case "cart":
          return "/cart"
        default:
          return "/404"
      }
    },
    get selectedBook() {
      return this.isLoading || !this.selectedBookId ? null : this.shop.books.get(this.selectedBookId)
    }
  }, {
    openBooksPage() {
      this.page = "books"
      this.selectedBookId = ""
    },
    openBookPage(book) {
      this.page = "book"
      this.selectedBookId = book.id
    },
    openBookPageById(id) {
      this.page = "book"
      this.selectedBookId = id
    },
    openCartPage() {
      this.page = "cart"
      this.selectedBookId = ""
    }
})
