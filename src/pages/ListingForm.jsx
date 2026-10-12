import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import FormField from '../components/FormField'
import { useListings } from '../context/ListingContext'

const categories = ['Meals', 'Bakery', 'Fast Food', 'Desserts', 'Beverages', 'Other']

function ListingFormInner({ existing }) {
  const navigate = useNavigate()
  const { addListing, editListing } = useListings()
  const isEdit = Boolean(existing)

  const [form, setForm] = useState({
    foodName: existing ? existing.foodName : '',
    category: existing ? existing.category : 'Meals',
    description: existing ? existing.description || '' : '',
    originalPrice: existing ? String(existing.originalPrice) : '',
    discountedPrice: existing ? String(existing.discountedPrice) : '',
    quantity: existing ? String(existing.quantity) : '',
    pickupAt: existing ? existing.pickupAt.slice(0, 16) : '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validate() {
    const newErrors = {}
    const original = Number(form.originalPrice)
    const discounted = Number(form.discountedPrice)
    const quantity = Number(form.quantity)

    if (!form.foodName.trim()) newErrors.foodName = 'Enter the food name'
    if (!original || original <= 0) newErrors.originalPrice = 'Enter the original price'
    if (!discounted || discounted <= 0) {
      newErrors.discountedPrice = 'Enter the discounted price'
    } else if (discounted >= original) {
      newErrors.discountedPrice = 'Must be lower than the original price'
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      newErrors.quantity = 'Enter a whole number, at least 1'
    }
    if (!form.pickupAt) {
      newErrors.pickupAt = 'Choose a pickup deadline'
    } else if (new Date(form.pickupAt) <= new Date()) {
      newErrors.pickupAt = 'The deadline must be in the future'
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
      foodName: form.foodName.trim(),
      category: form.category,
      description: form.description.trim(),
      originalPrice: Number(form.originalPrice),
      discountedPrice: Number(form.discountedPrice),
      quantity: Number(form.quantity),
      pickupDeadline: form.pickupAt + ':00',
      imageUrl: existing && existing.imageUrl ? existing.imageUrl : '',
    }

    setSaving(true)
    const result = isEdit
      ? await editListing(existing.id, data)
      : await addListing(data)
    setSaving(false)

    if (!result.ok) {
      setServerError(result.error)
      return
    }
    navigate('/restaurant/listings')
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card form-card">
        <h2>{isEdit ? 'Edit listing' : 'Add surplus food'}</h2>
        <p className="auth-sub">
          {isEdit
            ? 'Update the details below.'
            : 'List food that would otherwise go to waste.'}
        </p>

        {serverError && <div className="error-box">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Food name"
            name="foodName"
            value={form.foodName}
            onChange={handleChange}
            error={errors.foodName}
            placeholder="e.g. Vegetable Meal Box"
          />

          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              placeholder="What is included?"
            />
          </div>

          <div className="two-col">
            <FormField
              label="Original price (₹)"
              name="originalPrice"
              type="number"
              value={form.originalPrice}
              onChange={handleChange}
              error={errors.originalPrice}
              placeholder="180"
            />
            <FormField
              label="Discounted price (₹)"
              name="discountedPrice"
              type="number"
              value={form.discountedPrice}
              onChange={handleChange}
              error={errors.discountedPrice}
              placeholder="80"
            />
          </div>

          <div className="two-col">
            <FormField
              label="Quantity available"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              error={errors.quantity}
              placeholder="10"
            />
            <FormField
              label="Pickup deadline"
              name="pickupAt"
              type="datetime-local"
              value={form.pickupAt}
              onChange={handleChange}
              error={errors.pickupAt}
            />
          </div>

          <button type="submit" className="btn-primary full big" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Publish listing'}
          </button>
          <Link to="/restaurant/listings" className="cancel-link">Cancel</Link>
        </form>
      </div>
    </div>
  )
}

function ListingForm() {
  const { id } = useParams()
  const { myListings, myLoaded } = useListings()

  if (!id) {
    return <ListingFormInner key="new" existing={null} />
  }

  if (!myLoaded) {
    return <p>Loading...</p>
  }

  const existing = myListings.find((l) => l.id === Number(id))
  if (!existing) {
    return (
      <div>
        <h2>Listing not found 😕</h2>
        <Link to="/restaurant/listings" className="btn-primary">Back to My Listings</Link>
      </div>
    )
  }

  return <ListingFormInner key={id} existing={existing} />
}

export default ListingForm