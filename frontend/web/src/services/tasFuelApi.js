/**
 * TAS FuelCheck API Service
 *
 * Fetches diesel prices from the TAS FuelCheck public API.
 * Endpoint: https://www.fuelcheck.tas.gov.au/fuel/api/v1/fuel/prices/bylocation
 * CORS: Supported (Access-Control-Allow-Origin: *)
 *
 * Data is real-time — same format as NSW FuelCheck.
 * The API calculates distance server-side when given lat/lng.
 *
 * Response format per station:
 *   { ServiceStationID, Name, Lat, Long, Price, Address, Brand, Distance, Prices[] }
 */

import axios from 'axios'

const TAS_API_BASE = 'https://www.fuelcheck.tas.gov.au/fuel/api/v1/fuel/prices'

let cachedData = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes (real-time data)

/**
 * Fetch TAS fuel prices near a location from the API
 */
async function fetchTASData(latitude, longitude, fuelType, sortBy) {
  const now = Date.now()
  const cacheKey = `${latitude.toFixed(2)}-${longitude.toFixed(2)}-${fuelType}-${sortBy}`

  if (cachedData && cachedData.key === cacheKey && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedData.stations
  }

  const response = await axios.get(`${TAS_API_BASE}/bylocation`, {
    params: {
      latitude,
      longitude,
      radius: 500, // Fetch all TAS stations (island is ~400km long)
      fueltype: fuelType,
      sortby: sortBy === 'price' ? 'price' : 'distance',
    },
  })

  const stations = response.data
  cachedData = { key: cacheKey, stations }
  cacheTimestamp = now
  return stations
}

/**
 * Get TAS fuel prices near a location
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} fuelType - Fuel type code (e.g., 'DL', 'PDL')
 * @param {string} sortBy - 'price' or 'distance'
 * @returns {Promise<Array>}
 */
export async function getTASFuelPricesNearby(latitude, longitude, fuelType = 'DL', sortBy = 'price') {
  try {
    const rawStations = await fetchTASData(latitude, longitude, fuelType, sortBy)

    const results = rawStations.map((station) => ({
      code: `TAS-${station.ServiceStationID}`,
      brand: station.Brand,
      name: station.Name,
      address: station.Address,
      location: { latitude: station.Lat, longitude: station.Long },
      price: station.Price,
      fueltype: fuelType,
      lastupdated: new Date().toISOString(), // API doesn't provide last updated time
      distance: station.Distance,
      state: 'TAS',
      source: 'fuelcheck-tas',
      isAdBlueAvailable: false,
    }))

    return results
  } catch (error) {
    console.error('Error fetching TAS fuel prices:', error)
    return []
  }
}

export default { getTASFuelPricesNearby }
