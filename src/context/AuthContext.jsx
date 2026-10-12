import { createContext, useContext, useState } from 'react'
import api, { errorMessage } from '../api/api'

const AuthContext = createContext(null)

function readUser() {
  try {
    const raw = localStorage.getItem('replate_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)

  async function register(data) {
    try {
      await api.post('/auth/register', data)
      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        error: errorMessage(err),
        errors: err.response && err.response.data ? err.response.data.errors : undefined,
      }
    }
  }

  async function login(email, password) {
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('replate_token', res.data.token)
      localStorage.setItem('replate_user', JSON.stringify(res.data.user))
      setUser(res.data.user)
      return { ok: true, user: res.data.user }
    } catch (err) {
      return { ok: false, error: errorMessage(err) }
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('replate_token')
    localStorage.removeItem('replate_user')
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}