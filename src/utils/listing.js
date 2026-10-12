// the emoji shown on cards (real images can come later)
const emojis = {
  Meals: '🍱',
  Bakery: '🥐',
  'Fast Food': '🍕',
  Desserts: '🍰',
  Beverages: '🥤',
  Other: '🍽️',
}

export function emojiFor(category) {
  return emojis[category] || '🍽️'
}

// "2026-10-13T21:30:00" -> "Tomorrow, 9:30 PM"
export function formatDeadline(iso) {
  const d = new Date(iso)
  const time = d
    .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    .toUpperCase()

  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  if (d.toDateString() === today.toDateString()) return `Today, ${time}`
  if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${time}`
  return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${time}`
}

// pickupDeadline becomes the text shown on screen, pickupAt keeps the raw value for editing
export function normalizeListing(l) {
  return {
    ...l,
    emoji: emojiFor(l.category),
    pickupAt: l.pickupDeadline,
    pickupDeadline: formatDeadline(l.pickupDeadline),
  }
}