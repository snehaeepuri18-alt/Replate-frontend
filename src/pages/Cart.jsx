import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'

function Cart() {
  const { items, updateQty, removeItem, clearCart, total } = useCart()
  const { placeOrder } = useOrders()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)

  async function handlePlaceOrder() {
    setError('')
    setPlacing(true)
    const result = await placeOrder(items)
    setPlacing(false)

    if (!result.ok) {
      setError(result.error)
      return
    }
    clearCart()
    navigate('/orders')
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-emoji">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Find some tasty surplus food to rescue!</p>
        <Link to="/browse" className="btn-primary">Browse Food</Link>
      </div>
    )
  }

  return (
    <div>
      <h2>Your Cart</h2>
      <p className="cart-restaurant">From <strong>{items[0].restaurantName}</strong></p>

      {error && <div className="error-box">{error}</div>}

      <div className="cart-layout">
        <div className="cart-list">
          {items.map((i) => (
            <div key={i.id} className="cart-item">
              <div className="cart-emoji">{i.emoji}</div>

              <div className="cart-info">
                <h3>{i.foodName}</h3>
                <p>₹{i.price} each · Pickup by {i.pickupDeadline}</p>
              </div>

              <div className="qty-box">
                <button onClick={() => updateQty(i.id, i.qty - 1)}>−</button>
                <strong>{i.qty}</strong>
                <button onClick={() => updateQty(i.id, i.qty + 1)}>+</button>
              </div>

              <strong className="cart-line-total">₹{i.price * i.qty}</strong>

              <button className="remove-btn" onClick={() => removeItem(i.id)}>✕</button>
            </div>
          ))}
        </div>

        <div className="summary-card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items</span>
            <span>{items.reduce((s, i) => s + i.qty, 0)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <p className="summary-note">💵 Pay at the restaurant when you pick up.</p>

          <button className="btn-accent full-btn" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? 'Placing order...' : 'Place Order'}
          </button>
          <button className="clear-btn" onClick={clearCart}>Clear cart</button>
        </div>
      </div>
    </div>
  )
}

export default Cart