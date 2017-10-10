import React from "react"
import { observer, inject } from "mobx-react"
import "./Cart.css"

const Cart = inject("shop")(
    observer(({ shop: { cart } }) => (
        <section className="Page-cart">
            <h2>Your cart</h2>
            <section className="Page-cart-items">
                {cart.entries.map(entry => <CartEntry key={entry.book.id} entry={entry} />)}
            </section>
            <p>Subtotal: {cart.subTotal} €</p>
            {cart.hasDiscount && (
                <p>
                    <i>Large order discount: {cart.discount} €</i>
                </p>
            )}
            <p>
                <b>Total: {cart.total} €</b>
            </p>
            <button disabled={!cart.canCheckout} onClick={() => cart.checkout()}>
                Submit order
            </button>
        </section>
    ))
)

const CartEntry = inject("shop")(
    observer(({ shop, entry }) => (
        <div className="Page-cart-item">
            <p>
                <a href={`/book/${entry.book.id}`} onClick={onEntryClick.bind(entry, shop)}>
                    {entry.book.name}
                </a>
            </p>
            {!entry.book.isAvailable && (
                <p>
                    <b>Not available anymore</b>
                </p>
            )}
            <div className="Page-cart-item-details">
                <p>
                    Amount:
                    <input
                        value={entry.quantity}
                        onChange={updateEntryQuantity.bind(null, entry)}
                    />
                    total: <b>{entry.price} €</b>
                </p>
            </div>
        </div>
    ))
)

function onEntryClick(shop, e) {
    shop.view.openBookPage(this.book)
    e.preventDefault()
    return false
}

function updateEntryQuantity(entry, e) {
    if (e.target.value) entry.setQuantity(parseInt(e.target.value, 10))
}

export default Cart
