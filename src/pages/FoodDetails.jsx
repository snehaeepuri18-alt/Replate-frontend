import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/api'
import { normalizeListing } from '../utils/listing'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function FoodDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addItem, replaceCart } = useCart()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .get(`/listings/${id}`)
      .then((res) => {
        if (!cancelled) setItem(normalizeListing(res.data))
      })
      .catch(() => {
        if (!cancelled) setItem(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!item) {
    return (
      <div>
        <h2>This food is not available 😕</h2>
        <Link to="/browse" className="btn-primary">Back to Browse</Link>
      </div>
    )
  }

  const discount = Math.round(
    ((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100
  )

  function handleAdd() {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'CUSTOMER') {
      setMessage({ type: 'error', text: 'Only customers can place orders.' })
      return
    }

    const result = addItem(item, qty)
    if (result.ok) {
      setMessage({ type: 'success', text: 'Added to your cart! 🛒' })
    } else {
      setMessage({ type: 'error', text: result.message, conflict: result.conflict })
    }
  }

  function handleReplace() {
    replaceCart(item, qty)
    setMessage({ type: 'success', text: 'Cart cleared and this item added! 🛒' })
  }

  return (
    <div>
      <Link to="/browse" className="back-link">← Back to Browse</Link>

      <div className="details">
        <div className="details-emoji">{item.emoji}</div>

        <div className="details-info">
          <span className="details-category">{item.category}</span>
          <h1>{item.foodName}</h1>
          <p className="restaurant">🏪 {item.restaurantName}</p>
          <p className="details-desc">{item.description}</p>

          <div className="price-row big-price">
            <span className="new-price">₹{item.discountedPrice}</span>
            <span className="old-price">₹{item.originalPrice}</span>
            <span className="discount-pill">{discount}% OFF</span>
          </div>

          <div className="details-meta">
            <span>🍽️ {item.quantity} available</span>
            <span>⏰ Pickup by {item.pickupDeadline}</span>
            <span>📍 Pickup only, pay at the restaurant</span>
          </div>

          <div className="qty-row">
            <span>Quantity</span>
            <div className="qty-box">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <strong>{qty}</strong>
              <button onClick={() => setQty(Math.min(item.quantity, qty + 1))}>+</button>
            </div>
          </div>

          <button className="btn-accent add-btn" onClick={handleAdd}>
            Add to Cart · ₹{item.discountedPrice * qty}
          </button>

          {message && (
            <div className={message.type === 'success' ? 'success-box' : 'error-box'}>
              {message.text}
              {message.conflict && (
                <button className="link-btn" onClick={handleReplace}>
                  Clear cart and add this item
                </button>
              )}
              {message.type === 'success' && (
                <Link to="/cart" className="link-btn"> View cart →</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodDetails