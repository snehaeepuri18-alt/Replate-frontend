import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'

const statusLabels = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  READY_FOR_PICKUP: 'Ready for pickup',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

// which buttons each status gets
const actions = {
  PENDING: [
    { label: '✅ Accept', to: 'CONFIRMED', cls: 'green' },
    { label: '❌ Reject', to: 'CANCELLED', cls: 'red' },
  ],
  CONFIRMED: [
    { label: '📦 Mark ready for pickup', to: 'READY_FOR_PICKUP', cls: 'green' },
    { label: 'Cancel', to: 'CANCELLED', cls: 'red' },
  ],
  READY_FOR_PICKUP: [
    { label: '🎉 Mark completed', to: 'COMPLETED', cls: 'green' },
  ],
}

function IncomingOrders() {
  const { user } = useAuth()
  const { orders, updateStatus } = useOrders()

  const mine = orders.filter((o) => o.restaurantName === user.restaurantName)
  const active = mine.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status))
  const past = mine.filter((o) => ['COMPLETED', 'CANCELLED'].includes(o.status))

  function handleAction(order, action) {
    if (action.to === 'CANCELLED') {
      if (!window.confirm(`Cancel order ${order.id}? The food goes back to the listing.`)) return
    }
    updateStatus(order.id, action.to)
  }

  function renderOrder(order) {
    return (
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

        <p className="customer-line">👤 {order.customerName} · {order.customerEmail}</p>

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
          <div className="row-actions">
            {(actions[order.status] || []).map((a) => (
              <button
                key={a.to}
                className={`btn-small ${a.cls}`}
                onClick={() => handleAction(order, a)}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (mine.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-emoji">📭</div>
        <h2>No orders yet</h2>
        <p>Orders from customers will appear here.</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Incoming Orders</h2>

      <h3 className="group-title">Active ({active.length})</h3>
      {active.length === 0 ? <p className="muted">Nothing to do right now 🎉</p> : active.map(renderOrder)}

      <h3 className="group-title">Past ({past.length})</h3>
      {past.length === 0 ? <p className="muted">No completed or cancelled orders yet.</p> : past.map(renderOrder)}
    </div>
  )
}

export default IncomingOrders