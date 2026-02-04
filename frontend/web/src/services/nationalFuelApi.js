/**
 * National Fuel Price Service
 *
 * Unified service that combines fuel price data from multiple state APIs
 * into a single interface.
 *
 * Currently supported states:
 * - NSW + ACT: NSW FuelCheck API (real-time, ~3,200 stations)
 * - WA: FuelWatch RSS (daily prices, ~500+ stations)
 * - QLD: QLD Open Data DataStore API (monthly data, ~1,500+ stations)
 *
 * Coming soon (requires API keys or backend proxy):
 * - TAS: NSW FuelCheck V2 (auth currently broken)
 * - VIC: Servo Saver API (requires application)
 * - SA: Informed Sources (requires registration)
 * - NT: No public API available
 */

import { getFuelPricesNearby as getNSWPrices } from './nswFuelApi'
import { getWAFuelPricesNearby } from './waFuelApi'
import { getQLDFuelPricesNearby } from './qldFuelApi'

/**
 * State configuration with coverage info
 */
export const STATE_CONFIG = {
  ALL: { label: 'All States', available: true, description: 'Search all available states' },
  NSW: { label: 'New South Wales', available: true, description: 'Real-time prices from NSW FuelCheck' },
  ACT: { label: 'ACT', available: true, description: 'Real-time prices from NSW FuelCheck' },
  QLD: { label: 'Queensland', available: true, description: 'Monthly data from QLD Open Data' },
  WA: { label: 'Western Australia', available: true, description: 'Daily prices from FuelWatch' },
  VIC: { label: 'Victoria', available: false, description: 'Coming soon — requires API application' },
  TAS: { label: 'Tasmania', available: false, description: 'Coming soon — API auth pending' },
  SA: { label: 'South Australia', available: false, description: 'Coming soon — requires registration' },
  NT: { label: 'Northern Territory', available: false, description: 'Coming soon — no public API' },
}

/**
 * Determine which state a coordinate is likely in based on rough bounding boxes
 * Used to auto-select the nearest state for the user
 */
export function detectStateFromCoords(lat, lng) {
  // Rough bounding boxes for Australian states
  if (lat > -29 && lat < -10 && lng > 138 && lng < 154) return 'QLD'
  if (lat > -37.6 && lat < -28.2 && lng > 140.9 && lng < 154) return 'NSW'
  if (lat > -35.9 && lat < -35 && lng > 148.7 && lng < 149.4) return 'ACT'
  if (lat > -39.2 && lat < -34 && lng > 140.9 && lng < 150.1) return 'VIC'
  if (lat > -43.7 && lat < -39.5 && lng > 143.5 && lng < 149) return 'TAS'
  if (lat > -38.1 && lat < -26 && lng > 129 && lng < 141) return 'SA'
  if (lat > -35.1 && lat < -13.7 && lng > 112.9 && lng < 129.1) return 'WA'
  if (lat > -26.1 && lat < -10.9 && lng > 129 && lng < 138.1) return 'NT'
  return 'NSW' // Default
}

/**
 * Get fuel prices for a specific state or all states
 *
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} fuelType - Fuel type code (e.g., 'DL')
 * @param {string} sortBy - 'price' or 'distance'
 * @param {string} state - State code ('NSW', 'WA', 'QLD', 'ALL', etc.)
 * @returns {Promise<Array>}
 */
export async function getNationalFuelPrices(latitude, longitude, fuelType = 'DL', sortBy = 'price', state = 'ALL') {
  const fetchFns = []

  // Determine which APIs to call based on selected state
  if (state === 'ALL' || state === 'NSW' || state === 'ACT') {
    fetchFns.push(
      getNSWPrices(latitude, longitude, fuelType, sortBy)
        .then((results) => {
          if (state === 'ACT') return results.filter((s) => s.state === 'ACT')
          if (state === 'NSW') return results.filter((s) => s.state === 'NSW')
          return results
        })
        .catch((error) => {
          console.error('NSW/ACT fetch error:', error)
          return []
        })
    )
  }

  if (state === 'ALL' || state === 'WA') {
    fetchFns.push(
      getWAFuelPricesNearby(latitude, longitude, fuelType, sortBy)
        .catch((error) => {
          console.error('WA fetch error:', error)
          return []
        })
    )
  }

  if (state === 'ALL' || state === 'QLD') {
    fetchFns.push(
      getQLDFuelPricesNearby(latitude, longitude, fuelType, sortBy)
        .catch((error) => {
          console.error('QLD fetch error:', error)
          return []
        })
    )
  }

  // Fetch all selected states in parallel
  const results = await Promise.all(fetchFns)

  // Merge all results into a single array
  const allStations = results.flat()

  // Sort the combined results
  if (sortBy === 'price') {
    allStations.sort((a, b) => a.price - b.price)
  } else {
    allStations.sort((a, b) => a.distance - b.distance)
  }

  return allStations
}

/**
 * Get available states list for the UI dropdown
 */
export function getAvailableStates() {
  return Object.entries(STATE_CONFIG).map(([code, config]) => ({
    code,
    ...config,
  }))
}

export default { getNationalFuelPrices, getAvailableStates, detectStateFromCoords, STATE_CONFIG }
