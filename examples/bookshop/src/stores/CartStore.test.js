import * as fs from "fs"
import { when } from "mobx"
import { ShopStore } from "./ShopStore"

const testEnvironment = {
    fetch: () => Promise.resolve(JSON.parse(fs.readFileSync("./public/books.json"))),
    alert: m => console.log(m)
}

const testBook = {
    id: "1",
    price: 3,
    author: "test",
    name: "test"
}

it("cart store can add new entries", () => {
    const shop = ShopStore.create({}, testEnvironment)

    shop.bookStore.updateBooks([testBook])

    expect(shop.cart.total).toBe(0)
    shop.cart.addBook(shop.books.get(1))
    expect(shop.cart.total).toBe(3)
    shop.cart.addBook(shop.books.get(1))

    expect(shop.cart.total).toBe(6)
    expect(shop.cart.subTotal).toBe(6)

    shop.cart.addBook(shop.books.get(1), 98)
    expect(shop.cart.subTotal).toBe(300)
    expect(shop.cart.total).toBe(270)
})

it("cart store can clear entries", () => {
    const shop = ShopStore.create({}, testEnvironment)
    shop.bookStore.updateBooks([testBook])

    shop.cart.addBook(shop.books.get(1))

    expect(shop.cart.total).toBe(3)
    expect(shop.cart.canCheckout).toBe(true)

    shop.cart.clear()
    expect(shop.cart.total).toBe(0)
    expect(shop.cart.canCheckout).toBe(false)
})

it("cart store can clear entries", () => {
    const shop = ShopStore.create({}, testEnvironment)
    shop.bookStore.updateBooks([testBook])

    shop.cart.addBook(shop.books.get(1))

    expect(shop.cart.total).toBe(3)
    expect(shop.cart.canCheckout).toBe(true)

    shop.bookStore.updateBooks([])
    expect(shop.cart.total).toBe(3)
    expect(shop.cart.canCheckout).toBe(false)
    expect(shop.books.get(1).isAvailable).toBe(false)
    expect(shop.books.size).toBe(1)
    expect(shop.sortedAvailableBooks.length).toBe(0)
})
