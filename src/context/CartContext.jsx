import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

function makeCartItem(listing, qty) {
  return {
    id: listing.id,
    foodName: listing.foodName,
    restaurantName: listing.restaurantName,
    emoji: listing.emoji,
    price: listing.discountedPrice,
    pickupDeadline: listing.pickupDeadline,
    maxQty: listing.quantity,
    qty: qty,
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('replate_cart')) || []
    } catch {
      return []
    }
  })

  function save(next) {
    setItems(next)
    localStorage.setItem('replate_cart', JSON.stringify(next))
  }

  // One order = one restaurant, so mixing restaurants is blocked
  function addItem(listing, qty = 1) {
    if (items.length > 0 && items[0].restaurantName !== listing.restaurantName) {
      return {
        ok: false,
        conflict: true,
        message: `Your cart has items from ${items[0].restaurantName}. You can order from one restaurant at a time.`,
      }
    }

    const existing = items.find((i) => i.id === listing.id)
    const newQty = (existing ? existing.qty : 0) + qty

    if (newQty > listing.quantity) {
      return { ok: false, message: `Only ${listing.quantity} available.` }
    }

    if (existing) {
      save(items.map((i) => (i.id === listing.id ? { ...i, qty: newQty } : i)))
    } else {
      save([...items, makeCartItem(listing, qty)])
    }
    return { ok: true }
  }

  // empties the cart and starts a new one with this item
  function replaceCart(listing, qty = 1) {
    save([makeCartItem(listing, qty)])
  }

  function updateQty(id, qty) {
    save(
      items.map((i) => {
        if (i.id !== id) return i
        const safeQty = Math.max(1, Math.min(qty, i.maxQty))
        return { ...i, qty: safeQty }
      })
    )
  }

  function removeItem(id) {
    save(items.filter((i) => i.id !== id))
  }

  function clearCart() {
    save([])
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, replaceCart, updateQty, removeItem, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}