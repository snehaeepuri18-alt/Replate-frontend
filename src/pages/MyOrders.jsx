import { Link } from 'react-router-dom'
import { useOrders } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'

const statusLabels = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  READY_FOR_PICKUP: 'Ready for pickup',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

function MyOrders() {
  const { orders, updateStatus } = useOrders()
  const { user } = useAuth()

  const myOrders = orders.filter((o) => o.customerEmail === user.email)

  if (myOrders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-emoji">📦</div>
        <h2>No orders yet</h2>
        <p>Your orders will show up here.</p>
        <Link to="/browse" className="btn-primary">Browse Food</Link>
      </div>
    )
  }

  return (
    <div>
      <h2>My Orders</h2>

      <div className="order-list">
        {myOrders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-head">
              <div>
                <h3>Order {order.id}</h3>
                <p className="order-date">{order.date}</p>
              </div>
              <span className={`status status-${order.status.toLowerCase()}`}>
                {statusLabels[order.status]}
              </span>
            </div>

            <p className="restaurant">🏪 {order.restaurantName}</p>

            <ul className="order-items">
              {order.items.map((i, index) => (
                <li key={index}>
                  {i.emoji} {i.foodName} × {i.qty}
                  <span>₹{i.price * i.qty}</span>
                </li>
              ))}
            </ul>

            <div className="order-foot">
              <strong>Total: ₹{order.total}</strong>
              {order.status === 'PENDING' && (
                <button
                  className="cancel-btn"
                  onClick={() => updateStatus(order.id, 'CANCELLED')}
                >
                  Cancel order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders