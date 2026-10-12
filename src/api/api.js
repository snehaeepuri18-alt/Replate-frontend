import axios from 'axios'

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
})

// attach the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('replate_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// if the token expired, log out and go to the login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response && error.response.status
    const url = (error.config && error.config.url) || ''
    if (status === 401 && localStorage.getItem('replate_token') && !url.includes('/auth/')) {
      localStorage.removeItem('replate_token')
      localStorage.removeItem('replate_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// turns any error into a readable message
export function errorMessage(err) {
  if (!err.response) return 'Cannot reach the server. Is the backend running?'
  return (err.response.data && err.response.data.message) || 'Something went wrong. Please try again.'
}

export default api