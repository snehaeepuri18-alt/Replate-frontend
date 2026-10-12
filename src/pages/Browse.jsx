import { useState } from 'react'
import FoodCard from '../components/FoodCard'
import { useListings } from '../context/ListingContext'

function Browse() {
  const { activeListings } = useListings()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const categories = ['All', ...new Set(activeListings.map((item) => item.category))]

  const filtered = activeListings.filter((item) => {
    const matchesSearch = item.foodName
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesCategory = category === 'All' || item.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      <h2>Browse Surplus Food</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>No food found.</p>
      ) : (
        <div className="food-grid">
          {filtered.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Browse