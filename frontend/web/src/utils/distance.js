/**
 * Calculate the distance between two points using the Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}

/**
 * Sort stations by distance from a reference point
 * @param {Array} stations - Array of station objects with location
 * @param {number} refLat - Reference latitude
 * @param {number} refLon - Reference longitude
 * @returns {Array} Sorted stations with distance property
 */
export function sortByDistance(stations, refLat, refLon) {
  return stations
    .map((station) => ({
      ...station,
      distance: calculateDistance(
        refLat,
        refLon,
        station.location?.latitude || station.lat,
        station.location?.longitude || station.lng
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Filter stations within a radius
 * @param {Array} stations - Array of stations with distance property
 * @param {number} radiusKm - Maximum distance in kilometers
 * @returns {Array} Filtered stations
 */
export function filterByRadius(stations, radiusKm) {
  return stations.filter((station) => station.distance <= radiusKm)
}
