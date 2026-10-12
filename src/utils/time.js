// '21:30' -> '9:30 PM'
export function to12h(time24) {
  const [h, m] = time24.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

// is this time (today) already over?
export function isPast(time24) {
  const [h, m] = time24.split(':').map(Number)
  const deadline = new Date()
  deadline.setHours(h, m, 0, 0)
  return new Date() > deadline
}