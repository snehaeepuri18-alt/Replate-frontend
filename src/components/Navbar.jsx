import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/home')
  }

  return (
    <nav className="navbar">
      <Link to="/home" className="logo">
        <span className="logo-icon">🍽️</span>
        <span className="logo-text">
          Re<span className="logo-accent">Plate</span>
        </span>
      </Link>

      <div className="nav-links">
        <Link to="/browse">Browse Food</Link>

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-primary">Sign Up</Link>
          </>
        )}

        {user && user.role === 'CUSTOMER' && (
          <>
            <Link to="/orders">My Orders</Link>
            <Link to="/cart" className="cart-link">
              🛒 Cart
              {count > 0 && <span className="cart-count">{count}</span>}
            </Link>
          </>
        )}

        {user && user.role === 'RESTAURANT' && (
  <>
    <Link to="/restaurant">Dashboard</Link>
    <Link to="/restaurant/listings">My Listings</Link>
    <Link to="/restaurant/orders">Orders</Link>
  </>
)}

        {user && (
          <>
            <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar