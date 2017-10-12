import React from "react"
import { observer, inject } from "mobx-react"

const Books = inject("shop")(
    observer(({ shop }) => (
        <section className="Page-books">
            <h1>Available books</h1>
            <ol>
                {shop.sortedAvailableBooks.map(book => <BookEntry key={book.id} book={book} />)}
            </ol>
        </section>
    ))
)

const BookEntry = inject("shop")(
    observer(({ book, shop }) => (
        <li>
            <a
                href={`/book/${book.id}`}
                onClick={e => {
                    e.preventDefault()
                    shop.view.openBookPage(book)
                    return false
                }}
            >
                {book.name}
            </a>
        </li>
    ))
)

export default Books
