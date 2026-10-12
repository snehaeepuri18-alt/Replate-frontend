import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import Browse from './pages/Browse'
import FoodDetails from './pages/FoodDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import MyOrders from './pages/MyOrders'
import RestaurantDashboard from './pages/RestaurantDashboard'
import ManageListings from './pages/ManageListings'
import ListingForm from './pages/ListingForm'
import IncomingOrders from './pages/IncomingOrders'

function App() {
  const location = useLocation()
  const isWelcome = location.pathname === '/'

  return (
    <>
      {!isWelcome && <Navbar />}

      <main className={isWelcome ? '' : 'container'}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/food/:id" element={<FoodDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer only */}
          <Route
            path="/cart"
            element={<ProtectedRoute role="CUSTOMER"><Cart /></ProtectedRoute>}
          />
          <Route
            path="/orders"
            element={<ProtectedRoute role="CUSTOMER"><MyOrders /></ProtectedRoute>}
          />

          {/* Restaurant only */}
          <Route
            path="/restaurant"
            element={<ProtectedRoute role="RESTAURANT"><RestaurantDashboard /></ProtectedRoute>}
          />
          <Route
            path="/restaurant/listings"
            element={<ProtectedRoute role="RESTAURANT"><ManageListings /></ProtectedRoute>}
          />
          <Route
            path="/restaurant/listings/new"
            element={<ProtectedRoute role="RESTAURANT"><ListingForm /></ProtectedRoute>}
          />
          <Route
            path="/restaurant/listings/:id/edit"
            element={<ProtectedRoute role="RESTAURANT"><ListingForm /></ProtectedRoute>}
          />
          <Route
            path="/restaurant/orders"
            element={<ProtectedRoute role="RESTAURANT"><IncomingOrders /></ProtectedRoute>}
          />
        </Routes>
      </main>
    </>
  )
}

export default App