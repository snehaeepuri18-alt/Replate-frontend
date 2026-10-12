import { Link } from 'react-router-dom'

function FoodCard({ item }) {
  const discount = Math.round(
    ((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100
  )

  return (
    <div className="food-card">
      <div className="food-emoji">{item.emoji}</div>
      <span className="badge">{discount}% OFF</span>

      <h3>{item.foodName}</h3>
      <p className="restaurant">{item.restaurantName}</p>
      <p className="description">{item.description}</p>

      <div className="price-row">
        <span className="new-price">₹{item.discountedPrice}</span>
        <span className="old-price">₹{item.originalPrice}</span>
      </div>

      <div className="meta">
        <span>🍽️ {item.quantity} left</span>
        <span>⏰ Pickup by {item.pickupDeadline}</span>
      </div>

      <Link to={`/food/${item.id}`} className="btn-primary full">
        View Details
      </Link>
    </div>
  )
}

export default FoodCard