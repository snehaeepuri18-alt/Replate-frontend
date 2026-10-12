import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api, { errorMessage } from '../api/api'
import { useAuth } from './AuthContext'
import { useListings } from './ListingContext'
import { emojiFor } from '../utils/listing'

const OrderContext = createContext(null)

// turns the backend's order into the shape the pages already use
function normalizeOrder(o) {
  return {
    id: o.id,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    restaurantName: o.restaurantName,
    items: o.items.map((i) => ({
      id: i.listingId,
      foodName: i.foodName,
      emoji: emojiFor(i.category),
      qty: i.quantity,
      price: i.price,
    })),
    total: o.totalAmount,
    status: o.status,
    date: new Date(o.orderDate).toLocaleString('en-IN'),
  }
}

export function OrderProvider({ children }) {
  const { user } = useAuth()
  const { loadListings, loadMyListings } = useListings()
  const [orders, setOrders] = useState([])

  const loadOrders = useCallback(async () => {
    if (!user) {
      setOrders([])
      return
    }
    try {
      const url = user.role === 'RESTAURANT' ? '/restaurant/orders' : '/orders'
      const res = await api.get(url)
      setOrders(res.data.map(normalizeOrder))
    } catch {
      // keep the old list if the request fails
    }
  }, [user])

  // load when you log in, and refresh every 15 seconds so new orders show up
  useEffect(() => {
    loadOrders()
    if (!user) return
    const timer = setInterval(loadOrders, 15000)
    return () => clearInterval(timer)
  }, [user, loadOrders])

  async function refreshStock() {
    await loadListings()
    if (user && user.role === 'RESTAURANT') await loadMyListings()
  }

  async function placeOrder(items) {
    try {
      const body = {
        items: items.map((i) => ({ listingId: i.id, quantity: i.qty })),
      }
      const res = await api.post('/orders', body)
      await Promise.all([loadOrders(), loadListings()])
      return { ok: true, order: normalizeOrder(res.data) }
    } catch (err) {
      await loadListings()
      return { ok: false, error: errorMessage(err) }
    }
  }

  // restaurants change the status, customers can only cancel
  async function updateStatus(id, status) {
    try {
      if (user.role === 'RESTAURANT') {
        await api.patch(`/restaurant/orders/${id}/status`, { status })
      } else {
        await api.patch(`/orders/${id}/cancel`)
      }
      await Promise.all([loadOrders(), refreshStock()])
      return { ok: true }
    } catch (err) {
      window.alert(errorMessage(err))
      return { ok: false }
    }
  }

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateStatus }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  return useContext(OrderContext)
}