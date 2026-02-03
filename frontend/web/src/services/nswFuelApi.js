import axios from 'axios'

const API_BASE_URL = 'https://api.onegov.nsw.gov.au'

// In-memory cache for the full fuel data (stations + prices)
// The public endpoint returns ALL stations at once (~1.7MB), so we cache it
let cachedData = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Format current timestamp in Australian format for the API header
 */
function formatTimestamp() {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

/**
 * Parse Australian date format "DD/MM/YYYY HH:MM:SS" to ISO string
 */
function parseAusDate(dateStr) {
  if (!dateStr) return new Date().toISOString()
  const parts = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/)
  if (!parts) return new Date().toISOString()
  const [, day, month, year, hours, minutes, seconds] = parts
  return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}+11:00`).toISOString()
}

/**
 * Calculate distance between two points using Haversine formula
 * @returns {number} Distance in km
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return 6371 * c
}

/**
 * Fetch all fuel data from the public FuelCheckApp endpoint.
 * Returns cached data if still fresh.
 */
async function fetchAllFuelData() {
  const now = Date.now()
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedData
  }

  const response = await axios.get(`${API_BASE_URL}/FuelCheckApp/v1/fuel/prices`, {
    headers: {
      'requesttimestamp': formatTimestamp(),
    },
  })

  const { stations, prices } = response.data

  // Build a lookup map: stationcode -> array of prices
  const priceMap = new Map()
  for (const price of prices) {
    if (!priceMap.has(price.stationcode)) {
      priceMap.set(price.stationcode, [])
    }
    priceMap.get(price.stationcode).push(price)
  }

  cachedData = { stations, priceMap }
  cacheTimestamp = now
  return cachedData
}

/**
 * Get fuel prices near a location
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} fuelType - Default 'DL' for Diesel
 * @param {string} sortBy - 'price' or 'distance'
 * @returns {Promise<Array>} Array of fuel stations with prices
 */
export async function getFuelPricesNearby(latitude, longitude, fuelType = 'DL', sortBy = 'price') {
  try {
    const { stations, priceMap } = await fetchAllFuelData()

    // Merge stations with their prices for the requested fuel type
    const results = []
    for (const station of stations) {
      const stationPrices = priceMap.get(station.code) || []
      const fuelPrice = stationPrices.find((p) => p.fueltype === fuelType)
      if (!fuelPrice) continue // Skip stations without this fuel type

      const distance = calculateDistance(
        latitude, longitude,
        station.location.latitude, station.location.longitude
      )

      results.push({
        code: station.code,
        brand: station.brand,
        name: station.name,
        address: station.address,
        location: station.location,
        price: fuelPrice.price,
        fueltype: fuelPrice.fueltype,
        lastupdated: parseAusDate(fuelPrice.lastupdated),
        distance,
        isAdBlueAvailable: station.isAdBlueAvailable || false,
      })
    }

    // Sort
    if (sortBy === 'price') {
      results.sort((a, b) => a.price - b.price)
    } else {
      results.sort((a, b) => a.distance - b.distance)
    }

    return results
  } catch (error) {
    console.error('Error fetching fuel prices:', error)
    return getDemoFuelData(latitude, longitude, sortBy)
  }
}

/**
 * Get fuel prices by postcode (searches by matching address text)
 * @param {string} postcode
 * @param {string} fuelType - Default 'DL' for Diesel
 * @returns {Promise<Array>} Array of fuel stations with prices
 */
export async function getFuelPricesByPostcode(postcode, fuelType = 'DL') {
  try {
    const { stations, priceMap } = await fetchAllFuelData()

    // Find stations matching the postcode in their address
    const results = []
    for (const station of stations) {
      if (!station.address.includes(postcode)) continue
      const stationPrices = priceMap.get(station.code) || []
      const fuelPrice = stationPrices.find((p) => p.fueltype === fuelType)
      if (!fuelPrice) continue

      results.push({
        code: station.code,
        brand: station.brand,
        name: station.name,
        address: station.address,
        location: station.location,
        price: fuelPrice.price,
        fueltype: fuelPrice.fueltype,
        lastupdated: parseAusDate(fuelPrice.lastupdated),
        distance: 0,
        isAdBlueAvailable: station.isAdBlueAvailable || false,
      })
    }

    results.sort((a, b) => a.price - b.price)
    return results
  } catch (error) {
    console.error('Error fetching fuel prices by postcode:', error)
    return getDemoFuelData(-34.4794, 150.3369, 'price')
  }
}

/**
 * Get reference data for fuel types
 * @returns {Promise<Array>} Array of fuel types
 */
export async function getFuelTypes() {
  // The public endpoint doesn't have a separate fuel types endpoint,
  // so we return the known NSW fuel types
  return [
    { code: 'DL', name: 'Diesel' },
    { code: 'PDL', name: 'Premium Diesel' },
    { code: 'U91', name: 'Unleaded 91' },
    { code: 'P95', name: 'Premium 95' },
    { code: 'P98', name: 'Premium 98' },
    { code: 'E10', name: 'Ethanol 10' },
    { code: 'E85', name: 'Ethanol 85' },
    { code: 'LPG', name: 'LPG' },
    { code: 'B20', name: 'Biodiesel 20' },
    { code: 'EV', name: 'EV Charge' },
  ]
}

/**
 * Get reference data for brands
 * @returns {Promise<Array>} Array of brands
 */
export async function getBrands() {
  try {
    const { stations } = await fetchAllFuelData()
    // Extract unique brands from station data
    const brandSet = new Map()
    for (const station of stations) {
      if (!brandSet.has(station.brand)) {
        brandSet.set(station.brand, { code: station.brand, name: station.brand })
      }
    }
    return Array.from(brandSet.values()).sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error fetching brands:', error)
    return getDemoBrands()
  }
}

// Demo data functions for fallback
function getDemoBrands() {
  return [
    { code: '7-Eleven', name: '7-Eleven' },
    { code: 'BP', name: 'BP' },
    { code: 'Caltex', name: 'Caltex' },
    { code: 'Shell', name: 'Shell' },
    { code: 'United', name: 'United' },
    { code: 'Ampol', name: 'Ampol' },
    { code: 'Metro', name: 'Metro' },
    { code: 'Costco', name: 'Costco' },
    { code: 'Independent', name: 'Independent' },
  ]
}

function getDemoFuelData(latitude, longitude, sortBy) {
  const demoStations = [
    {
      code: 'DEMO-SH001',
      brand: 'BP',
      name: 'BP Mittagong',
      address: '45 Main Street, Mittagong NSW 2575',
      location: { latitude: -34.4526, longitude: 150.4532 },
      price: 189.9,
      fueltype: 'DL',
      lastupdated: new Date(Date.now() - 30 * 60000).toISOString(),
    },
    {
      code: 'DEMO-SH002',
      brand: 'Shell',
      name: 'Shell Bowral',
      address: '120 Bong Bong Street, Bowral NSW 2576',
      location: { latitude: -34.4783, longitude: 150.4178 },
      price: 192.5,
      fueltype: 'DL',
      lastupdated: new Date(Date.now() - 45 * 60000).toISOString(),
    },
    {
      code: 'DEMO-SH003',
      brand: 'Caltex',
      name: 'Caltex Moss Vale',
      address: '89 Argyle Street, Moss Vale NSW 2577',
      location: { latitude: -34.5499, longitude: 150.3702 },
      price: 187.9,
      fueltype: 'DL',
      lastupdated: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      code: 'DEMO-SH004',
      brand: 'United',
      name: 'United New Berrima',
      address: 'Hume Hwy, New Berrima NSW 2577',
      location: { latitude: -34.4801, longitude: 150.3356 },
      price: 179.5,
      fueltype: 'DL',
      lastupdated: new Date(Date.now() - 60 * 60000).toISOString(),
    },
  ]

  const stationsWithDistance = demoStations.map((station) => ({
    ...station,
    distance: calculateDistance(
      latitude, longitude,
      station.location.latitude, station.location.longitude
    ),
  }))

  if (sortBy === 'price') {
    return stationsWithDistance.sort((a, b) => a.price - b.price)
  }
  return stationsWithDistance.sort((a, b) => a.distance - b.distance)
}
