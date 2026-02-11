/**
 * VIC Servo Saver API Service
 *
 * Fetches diesel prices from the Victorian Government Servo Saver Open Data API.
 * Endpoint: https://api.fuel.service.vic.gov.au/open-data/v1/fuel/prices
 * CORS: Supported
 * Auth: API Consumer ID (x-consumer-id header)
 *
 * Data is delayed ~24 hours from retailer submission (NOT real-time).
 * API returns ALL Victorian stations in a single call.
 *
 * Rate Limit: 10 requests per 60 seconds (429 if exceeded)
 *
 * Response format:
 *   { fuelPriceDetails: [{ fuelStation, fuelPrices[], updatedAt }] }
 *
 * License: CC BY 4.0 - Must attribute "© State of Victoria accessed via Victorian Government Service Victoria Platform"
 */

import axios from 'axios'

const VIC_API_BASE = 'https://api.fuel.service.vic.gov.au/open-data/v1'
const VIC_API_KEY = import.meta.env.VITE_VIC_FUEL_API_KEY

let cachedData = null
let cacheTimestamp = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour (data is 24h delayed anyway)

/**
 * Generate a UUID v4 for transaction tracking
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Fetch VIC fuel prices from the API
 */
async function fetchVICData() {
  const now = Date.now()

  // Return cached data if still valid
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedData
  }

  if (!VIC_API_KEY) {
    console.error('VIC Fuel API key not configured')
    return []
  }

  const response = await axios.get(`${VIC_API_BASE}/fuel/prices`, {
    headers: {
      'User-Agent': 'BerrimaDieselApp/1.0',
      'x-consumer-id': VIC_API_KEY,
      'x-transactionid': generateUUID(),
    },
  })

  const stations = response.data.fuelPriceDetails || []
  cachedData = stations
  cacheTimestamp = now
  return stations
}

/**
 * Get VIC fuel prices near a location
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {string} fuelType - Fuel type code ('DSL' for diesel, 'PDSL' for premium diesel)
 * @param {string} sortBy - 'price' or 'distance'
 * @param {number} maxRadius - Maximum radius in km (default: 500 for whole state)
 * @returns {Promise<Array>}
 */
export async function getVICFuelPricesNearby(
  latitude,
  longitude,
  fuelType = 'DSL',
  sortBy = 'price',
  maxRadius = 500
) {
  try {
    const rawStations = await fetchVICData()

    // Filter and transform stations
    const results = []

    for (const detail of rawStations) {
      const station = detail.fuelStation
      const prices = detail.fuelPrices

      // Find the requested fuel type
      const fuelPrice = prices.find((p) => p.fuelType === fuelType && p.isAvailable)

      if (!fuelPrice || !station.location?.latitude || !station.location?.longitude) {
        continue // Skip if fuel type not available or location missing
      }

      // Calculate distance from user location
      const distance = calculateDistance(
        latitude,
        longitude,
        station.location.latitude,
        station.location.longitude
      )

      // Skip if outside radius
      if (distance > maxRadius) {
        continue
      }

      results.push({
        code: `VIC-${station.id}`,
        brand: station.brandId,
        name: station.name,
        address: station.address,
        phone: station.contactPhone || null,
        location: {
          latitude: station.location.latitude,
          longitude: station.location.longitude,
        },
        price: fuelPrice.price / 10, // Convert cents to dollars (e.g., 213.9 cents -> 2.139)
        fueltype: fuelType,
        lastupdated: fuelPrice.updatedAt,
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
        state: 'VIC',
        source: 'servo-saver',
        isAdBlueAvailable: false,
      })
    }

    // Sort results
    if (sortBy === 'price') {
      results.sort((a, b) => a.price - b.price)
    } else {
      results.sort((a, b) => a.distance - b.distance)
    }

    return results
  } catch (error) {
    console.error('Error fetching VIC fuel prices:', error)
    if (error.response?.status === 429) {
      console.warn('VIC API rate limit exceeded (10 requests per 60 seconds)')
    }
    return []
  }
}

export default { getVICFuelPricesNearby }
