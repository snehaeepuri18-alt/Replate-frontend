import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useListings } from '../context/ListingContext'

const statusLabels = {
  ACTIVE: 'Active',
  SOLD_OUT: 'Sold out',
  EXPIRED: 'Expired',
  INACTIVE: 'Inactive',
}

function ManageListings() {
  const { myListings, myLoaded, toggleListing, deleteListing } = useListings()
  const [message, setMessage] = useState('')

  async function handleToggle(listing) {
    const result = await toggleListing(listing.id)
    setMessage(result.ok ? '' : result.error)
  }

  async function handleDelete(listing) {
    if (!window.confirm(`Delete "${listing.foodName}"? This cannot be undone.`)) return
    const result = await deleteListing(listing.id)
    setMessage(result.ok ? '' : result.error)
  }

  if (!myLoaded) {
    return <p>Loading your listings...</p>
  }

  return (
    <div>
      <div className="page-head">
        <h2>My Listings</h2>
        <Link to="/restaurant/listings/new" className="btn-primary">➕ Add Surplus Food</Link>
      </div>

      {message && <div className="error-box">{message}</div>}

      {myListings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji">🍱</div>
          <h2>No listings yet</h2>
          <p>Add your first surplus food listing to start rescuing meals.</p>
          <Link to="/restaurant/listings/new" className="btn-primary">Add Surplus Food</Link>
        </div>
      ) : (
        <div className="listing-rows">
          {myListings.map((l) => (
            <div key={l.id} className="listing-row">
              <div className="cart-emoji">{l.emoji}</div>

              <div className="listing-info">
                <h3>{l.foodName}</h3>
                <p>
                  ₹{l.discountedPrice} <s>₹{l.originalPrice}</s> · {l.quantity} left · Pickup by {l.pickupDeadline}
                </p>
              </div>

              <span className={`status status-${l.status.toLowerCase()}`}>
                {statusLabels[l.status]}
              </span>

              <div className="row-actions">
                <Link to={`/restaurant/listings/${l.id}/edit`} className="btn-small blue">
                  Edit
                </Link>
                <button className="btn-small gray" onClick={() => handleToggle(l)}>
                  {l.status === 'INACTIVE' ? 'Activate' : 'Deactivate'}
                </button>
                <button className="btn-small red" onClick={() => handleDelete(l)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageListings