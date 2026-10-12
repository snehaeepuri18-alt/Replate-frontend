import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useListings } from '../context/ListingContext'
import { useOrders } from '../context/OrderContext'

function RestaurantDashboard() {
  const { user } = useAuth()
  const { myListings } = useListings()
  const { orders } = useOrders()

  const myOrders = orders.filter((o) => o.restaurantName === user.restaurantName)

  const countListings = (status) => myListings.filter((l) => l.status === status).length
  const countOrders = (status) => myOrders.filter((o) => o.status === status).length

  const pending = countOrders('PENDING')

  return (
    <div>
      <h2>Welcome, {user.restaurantName} 🍽️</h2>
      <p className="dash-sub">Here's how your surplus food is doing today.</p>

      {pending > 0 && (
        <Link to="/restaurant/orders" className="alert-banner">
          🔔 You have {pending} new order{pending > 1 ? 's' : ''} waiting. Review now →
        </Link>
      )}

      <div className="dash-stats">
        <div className="dash-card dc-green">
          <strong>{countListings('ACTIVE')}</strong>
          <span>Active listings</span>
        </div>
        <div className="dash-card dc-pink">
          <strong>{countListings('SOLD_OUT')}</strong>
          <span>Sold out</span>
        </div>
        <div className="dash-card dc-orange">
          <strong>{countListings('EXPIRED')}</strong>
          <span>Expired</span>
        </div>
        <div className="dash-card dc-purple">
          <strong>{pending}</strong>
          <span>Pending orders</span>
        </div>
        <div className="dash-card dc-blue">
          <strong>{countOrders('COMPLETED')}</strong>
          <span>Completed orders</span>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/restaurant/listings/new" className="btn-accent add-quick">
          ➕ Add Surplus Food
        </Link>
        <Link to="/restaurant/listings" className="btn-outline-dark">My Listings</Link>
        <Link to="/restaurant/orders" className="btn-outline-dark">Incoming Orders</Link>
      </div>
    </div>
  )
}

export default RestaurantDashboard