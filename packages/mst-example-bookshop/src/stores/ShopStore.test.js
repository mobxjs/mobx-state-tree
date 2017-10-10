import * as fs from "fs"
import { when } from "mobx"
import { ShopStore } from "./ShopStore"

const bookFetcher = () => Promise.resolve(JSON.parse(fs.readFileSync("./public/books.json")))

it("as a user I can buy books", done => {
    const alertSpy = jasmine.createSpy("alert")
    const shop = ShopStore.create({}, { fetch: bookFetcher, alert: alertSpy })

    shop.view.openBooksPage()
    expect(shop.view.page).toBe("books")
    expect(shop.view.currentUrl).toBe("/")
    expect(shop.isLoading).toBe(true)

    when(
        () => !shop.isLoading,
        () => {
            expect(shop.books.size).toBe(4)

            shop.view.openBookPageById("978-1423103349")
            expect(shop.view.page).toBe("book")
            expect(shop.view.currentUrl).toBe("/book/978-1423103349")
            expect(shop.view.selectedBook.name).toBe("The Sea of Monsters")
            expect(alertSpy.calls.count()).toBe(0)

            shop.cart.addBook(shop.view.selectedBook)
            expect(alertSpy.calls.count()).toBe(1)

            shop.view.openCartPage()
            expect(shop.view.page).toBe("cart")
            expect(shop.view.currentUrl).toBe("/cart")
            expect(shop.cart.canCheckout).toBe(true)

            shop.cart.checkout()
            expect(alertSpy.calls.count()).toBe(2)
            expect(shop.cart.entries.length).toBe(0)
            expect(shop.cart.canCheckout).toBe(false)
            done()
        }
    )
})
