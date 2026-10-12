import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const lines = [
  'Great food deserves a second chance.',
  'Save a meal, save the planet.',
  'Fresh surplus. Tiny price. Big smile.',
  'Don\'t waste it, plate it.',
]

function Welcome() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)

  // change the quote every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % lines.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="welcome">
      <span className="float f1">🍕</span>
      <span className="float f2">🍔</span>
      <span className="float f3">🥗</span>
      <span className="float f4">🍰</span>
      <span className="float f5">🥐</span>
      <span className="float f6">🍛</span>

      <div className="welcome-content">
        <div className="welcome-logo">
          <span className="logo-icon big">🍽️</span>
          <span className="welcome-name">
            Re<span className="logo-accent">Plate</span>
          </span>
        </div>

        <h1>Welcome! 👋</h1>
        <h2 className="welcome-ask">Hungry? Want to order some food?</h2>

        <p key={index} className="welcome-quote">“{lines[index]}”</p>

        <button className="btn-accent" onClick={() => navigate('/home')}>
          Start 🍴
        </button>
      </div>
    </div>
  )
}

export default Welcome