// Helper: current date/time in datetime-local format (YYYY-MM-DDTHH:MM) for min attribute
export function getMinPickupTime() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}`
}

// Helper: current date/time + 1 hour in datetime-local format for default value
export function getDefaultPickupTime() {
  const now = new Date()
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)
  const year = oneHourLater.getFullYear()
  const month = String(oneHourLater.getMonth() + 1).padStart(2, '0')
  const date = String(oneHourLater.getDate()).padStart(2, '0')
  const hours = String(oneHourLater.getHours()).padStart(2, '0')
  const minutes = String(oneHourLater.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${date}T${hours}:${minutes}`
}
