import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api, { errorMessage } from '../api/api'
import { useAuth } from './AuthContext'
import { normalizeListing } from '../utils/listing'

const ListingContext = createContext(null)

function fail(err) {
  return {
    ok: false,
    error: errorMessage(err),
    errors: err.response && err.response.data ? err.response.data.errors : undefined,
  }
}

export function ListingProvider({ children }) {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [myListings, setMyListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [myLoaded, setMyLoaded] = useState(false)
  const [error, setError] = useState('')

  const loadListings = useCallback(async () => {
    try {
      const res = await api.get('/listings')
      setListings(res.data.map(normalizeListing))
      setError('')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMyListings = useCallback(async () => {
    try {
      const res = await api.get('/restaurant/listings')
      setMyListings(res.data.map(normalizeListing))
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setMyLoaded(true)
    }
  }, [])

  useEffect(() => {
    loadListings()
    const timer = setInterval(loadListings, 30000)
    return () => clearInterval(timer)
  }, [loadListings])

  useEffect(() => {
    if (user && user.role === 'RESTAURANT') {
      loadMyListings()
    } else {
      setMyListings([])
      setMyLoaded(false)
    }
  }, [user, loadMyListings])

  async function refreshAll() {
    await Promise.all([loadListings(), loadMyListings()])
  }

  async function addListing(data) {
    try {
      await api.post('/restaurant/listings', data)
      await refreshAll()
      return { ok: true }
    } catch (err) {
      return fail(err)
    }
  }

  async function editListing(id, data) {
    try {
      await api.put(`/restaurant/listings/${id}`, data)
      await refreshAll()
      return { ok: true }
    } catch (err) {
      return fail(err)
    }
  }

  async function toggleListing(id) {
    try {
      await api.patch(`/restaurant/listings/${id}/toggle`)
      await refreshAll()
      return { ok: true }
    } catch (err) {
      return fail(err)
    }
  }

  async function deleteListing(id) {
    try {
      await api.delete(`/restaurant/listings/${id}`)
      await refreshAll()
      return { ok: true }
    } catch (err) {
      return fail(err)
    }
  }

  return (
    <ListingContext.Provider
      value={{
        listings,
        activeListings: listings,
        myListings,
        loading,
        myLoaded,
        error,
        loadListings,
        loadMyListings,
        addListing,
        editListing,
        toggleListing,
        deleteListing,
      }}
    >
      {children}
    </ListingContext.Provider>
  )
}

export function useListings() {
  return useContext(ListingContext)
}