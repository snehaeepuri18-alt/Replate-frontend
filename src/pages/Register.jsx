import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField'
import { useAuth } from '../context/AuthContext'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('CUSTOMER')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    phone: '',
    address: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validate() {
    const newErrors = {}

    if (!form.name.trim()) newErrors.name = 'Please enter your name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email address'
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Passwords do not match'

    if (role === 'RESTAURANT') {
      if (!form.restaurantName.trim()) newErrors.restaurantName = 'Enter your restaurant name'
      if (!/^\d{10}$/.test(form.phone)) newErrors.phone = 'Enter a 10-digit phone number'
      if (!form.address.trim()) newErrors.address = 'Enter your restaurant address'
    }

    return newErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    const data = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: role,
    }
    if (role === 'RESTAURANT') {
      data.restaurantName = form.restaurantName
      data.phone = form.phone
      data.address = form.address
    }

    setLoading(true)
    const result = await register(data)
    setLoading(false)

    if (!result.ok) {
      setErrors(result.errors || {})
      setServerError(result.error)
      return
    }

    setSuccess(true)
    setTimeout(() => navigate('/login'), 1800)
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create your account</h2>
        <p className="auth-sub">Join RePlate and start saving food 🌱</p>

        <div className="role-toggle">
          <button
            type="button"
            className={role === 'CUSTOMER' ? 'active' : ''}
            onClick={() => setRole('CUSTOMER')}
          >
            🛒 I'm a Customer
          </button>
          <button
            type="button"
            className={role === 'RESTAURANT' ? 'active' : ''}
            onClick={() => setRole('RESTAURANT')}
          >
            🍽️ I'm a Restaurant
          </button>
        </div>

        {success && (
          <div className="success-box">
            ✅ Account created! Taking you to login...
          </div>
        )}
        {serverError && <div className="error-box">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Full name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Your name"
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
          />

          {role === 'RESTAURANT' && (
            <>
              <FormField
                label="Restaurant name"
                name="restaurantName"
                value={form.restaurantName}
                onChange={handleChange}
                error={errors.restaurantName}
                placeholder="e.g. Green Spoon"
              />
              <FormField
                label="Phone number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="10-digit number"
              />
              <FormField
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="Street, area, city"
              />
            </>
          )}

          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="At least 6 characters"
          />
          <FormField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Type the password again"
          />

          <button type="submit" className="btn-primary full big" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register