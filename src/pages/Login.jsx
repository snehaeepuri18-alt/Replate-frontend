import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoginError('')

    const newErrors = {}
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email address'
    if (!form.password) newErrors.password = 'Enter your password'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)

    if (!result.ok) {
      setLoginError(result.error)
      return
    }

    navigate(result.user.role === 'RESTAURANT' ? '/restaurant' : '/browse')
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Welcome back 👋</h2>
        <p className="auth-sub">Login to continue ordering or managing your listings</p>

        {loginError && <div className="error-box">{loginError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Your password"
          />

          <button type="submit" className="btn-primary full big" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          New to RePlate? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login