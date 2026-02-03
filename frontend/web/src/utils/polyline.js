/**
 * Decode a polyline encoded string into an array of coordinates
 * Supports HERE Flexible Polyline encoding
 * @param {string} encoded - Encoded polyline string
 * @returns {Array<{lat: number, lng: number}>} Array of coordinates
 */
export function decodePolyline(encoded) {
  // HERE uses flexible polyline encoding
  // This is a simplified decoder for the standard format
  const points = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < encoded.length) {
    // Decode latitude
    let shift = 0
    let result = 0
    let byte

    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    lat += result & 1 ? ~(result >> 1) : result >> 1

    // Decode longitude
    shift = 0
    result = 0

    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    lng += result & 1 ? ~(result >> 1) : result >> 1

    points.push({
      lat: lat / 1e5,
      lng: lng / 1e5,
    })
  }

  return points
}

/**
 * Sample points along a route at regular intervals
 * @param {Array<{lat: number, lng: number}>} points - Route points
 * @param {number} intervalMeters - Sampling interval in meters
 * @returns {Array<{lat: number, lng: number}>} Sampled points
 */
export function sampleAlongRoute(points, intervalMeters) {
  if (points.length < 2) return points

  const sampled = [points[0]]
  let accumulated = 0

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const segmentDistance = haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng) * 1000 // Convert to meters

    accumulated += segmentDistance

    if (accumulated >= intervalMeters) {
      sampled.push(curr)
      accumulated = 0
    }
  }

  // Always include the last point
  if (sampled[sampled.length - 1] !== points[points.length - 1]) {
    sampled.push(points[points.length - 1])
  }

  return sampled
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} Distance in kilometers
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
