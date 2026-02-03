/**
 * Format a distance value with appropriate unit
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`
  }
  return `${distanceKm.toFixed(1)}km`
}

/**
 * Format a price in cents to dollars
 * @param {number} priceInCents - Price in cents
 * @returns {string} Formatted price string
 */
export function formatPrice(priceInCents) {
  const dollars = priceInCents / 100
  return dollars.toFixed(1)
}

/**
 * Format a timestamp to relative time
 * @param {string|Date} timestamp - ISO timestamp or Date object
 * @returns {string} Relative time string
 */
export function formatTimeAgo(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
  })
}

/**
 * Format a date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format driving duration
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
export function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours === 0) {
    return `${minutes} min`
  }
  return `${hours}h ${minutes}m`
}

/**
 * Format a metric value (weight, height, etc.)
 * @param {number} value - Value to format
 * @param {string} unit - Unit of measurement
 * @returns {string} Formatted value with unit
 */
export function formatMetric(value, unit) {
  return `${value}${unit}`
}
