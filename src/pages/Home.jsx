import { Link } from 'react-router-dom'

const ribbonItems = [
  '🍕 Don\'t waste it, plate it',
  '🥗 Great food, tiny price',
  '🍰 Save a meal, save the planet',
  '🍛 Fresh surplus, big savings',
  '🥐 Pickup. Enjoy. Repeat.',
]

const quotes = [
  {
    text: 'Great food deserves a second chance.',
    by: 'The RePlate Promise',
    color: 'q-pink',
  },
  {
    text: 'Every meal you rescue is a small win for the planet.',
    by: 'Eat Good, Do Good',
    color: 'q-green',
  },
  {
    text: 'Delicious today, wasted tomorrow? Not on our watch.',
    by: 'Our Mission',
    color: 'q-purple',
  },
]

function Home() {
  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <span className="float f1">🍕</span>
        <span className="float f2">🍔</span>
        <span className="float f3">🥗</span>
        <span className="float f4">🍰</span>
        <span className="float f5">🥐</span>
        <span className="float f6">🍛</span>

        <div className="hero-content">
          <span className="hero-tag">🌱 Save food. Save money. Save the planet.</span>
          <h1>
            Good food <span className="underline">shouldn't</span> go to waste.
          </h1>
          <p>
            Grab delicious surplus meals from local restaurants at up to 60% off,
            before the pickup deadline ends.
          </p>
          <div className="hero-buttons">
            <Link to="/browse" className="btn-accent">Browse Surplus Food</Link>
            <Link to="/register" className="btn-outline">Join as a Restaurant</Link>
          </div>
        </div>
      </section>

      {/* ---------- Scrolling ribbon ---------- */}
      <div className="ribbon">
        <div className="ribbon-track">
          {[...ribbonItems, ...ribbonItems].map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      {/* ---------- Stats ---------- */}
      <section className="stats">
        <div className="stat">
          <strong>Up to 60%</strong>
          <span>cheaper meals</span>
        </div>
        <div className="stat">
          <strong>Pickup only</strong>
          <span>no delivery fees</span>
        </div>
        <div className="stat">
          <strong>Less waste</strong>
          <span>better planet</span>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <h2 className="section-title">How it works</h2>
      <section className="steps">
        <div className="step-card step-green">
          <div className="step-icon">🔍</div>
          <h3>1. Discover</h3>
          <p>Find discounted surplus food from nearby restaurants.</p>
        </div>
        <div className="step-card step-orange">
          <div className="step-icon">🛒</div>
          <h3>2. Order</h3>
          <p>Reserve your meal before the stock runs out.</p>
        </div>
        <div className="step-card step-yellow">
          <div className="step-icon">🛍️</div>
          <h3>3. Pick up</h3>
          <p>Collect your food from the restaurant before the deadline.</p>
        </div>
      </section>

      {/* ---------- Quotes ---------- */}
      <h2 className="section-title">Why RePlate?</h2>
      <section className="quotes">
        {quotes.map((q) => (
          <blockquote key={q.text} className={`quote-card ${q.color}`}>
            <span className="quote-mark">“</span>
            <p>{q.text}</p>
            <footer>{q.by}</footer>
          </blockquote>
        ))}
      </section>

      {/* ---------- Final call to action ---------- */}
      <section className="cta">
        <h2>Hungry for a deal? 🍴</h2>
        <p>See what's waiting for you tonight.</p>
        <Link to="/browse" className="btn-accent">Start Browsing</Link>
      </section>
    </div>
  )
}

export default Home