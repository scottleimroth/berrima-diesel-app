/**
 * QLD Fuel Price Service
 *
 * Fetches diesel prices from QLD Government Open Data Portal (CKAN DataStore API).
 * Data source: data.qld.gov.au - Fuel Price Reporting
 * CORS: Supported (Access-Control-Allow-Origin: *)
 *
 * Data is published monthly with individual price change records.
 * We fetch the latest month's data and deduplicate to get the most recent
 * price per station.
 *
 * Price format: integer in tenths of cents (e.g., 1860 = 186.0 c/L)
 */

import axios from 'axios'

const CKAN_BASE = 'https://www.data.qld.gov.au/api/3/action'

// Resource IDs for the latest available months (most recent first)
// These are from the fuel-price-reporting-2026 dataset
const RESOURCE_IDS = {
  '2026-01': '61a27cfa-9ec5-47cc-8ce5-274f2dcb1908',
}

// Fallback: 2025 dataset resources
const RESOURCE_IDS_2025 = {
  '2025-12': null, // Will be discovered dynamically
}

let cachedData = null
let cacheTimestamp = 0
const CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 hours (monthly data doesn't change often)

/**
 * Calculate distance between two points using Haversine formula
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
 * Discover the latest resource ID from QLD datasets
 */
async function discoverLatestResource() {
  // Try 2026 dataset first, then fall back to 2025
  const datasets = ['fuel-price-reporting-2026', 'fuel-price-reporting-2025', 'fuel-price-reporting-2024']

  for (const datasetId of datasets) {
    try {
      const response = await axios.get(`${CKAN_BASE}/package_show?id=${datasetId}`)
      const resources = response.data.result.resources

      // Find the latest CSV resource (they're named like "Queensland Fuel Prices January 2026")
      const csvResources = resources
        .filter((r) => r.format === 'CSV' && r.name.toLowerCase().includes('fuel price'))
        .sort((a, b) => {
          // Sort by the date in the resource name (most recent first)
          const months = ['january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december']
          const getMonthIndex = (name) => {
            const lower = name.toLowerCase()
            return months.findIndex((m) => lower.includes(m))
          }
          return getMonthIndex(b.name) - getMonthIndex(a.name)
        })

      if (csvResources.length > 0) {
        return csvResources[0].id
      }
    } catch (error) {
      console.warn(`Failed to fetch QLD dataset ${datasetId}:`, error.message)
    }
  }

  // Fallback to known resource ID
  return RESOURCE_IDS['2026-01']
}

/**
 * Fetch diesel prices from QLD DataStore API
 */
async function fetchAllQLDData() {
  const now = Date.now()
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedData
  }

  const resourceId = await discoverLatestResource()
  if (!resourceId) {
    console.error('No QLD fuel data resource found')
    return []
  }

  // Use DataStore SQL to fetch only diesel records
  const sql = `SELECT * FROM "${resourceId}" WHERE "Fuel_Type" = 'Diesel' ORDER BY "TransactionDateutc" DESC`
  const response = await axios.get(`${CKAN_BASE}/datastore_search_sql`, {
    params: { sql },
  })

  const records = response.data.result.records

  // Deduplicate: keep only the latest price per station
  const latestByStation = new Map()
  for (const record of records) {
    const siteId = record.SiteId
    if (!latestByStation.has(siteId)) {
      latestByStation.set(siteId, record)
    }
    // Records are already sorted by TransactionDateutc DESC,
    // so the first occurrence for each station is the latest
  }

  // Convert to common format
  const stations = []
  for (const record of latestByStation.values()) {
    const lat = parseFloat(record.Site_Latitude)
    const lng = parseFloat(record.Site_Longitude)
    const price = record.Price / 10 // Convert from tenths of cents to cents per litre

    if (isNaN(lat) || isNaN(lng) || isNaN(price)) continue

    stations.push({
      code: `QLD-${record.SiteId}`,
      brand: record.Site_Brand || 'Unknown',
      name: record.Site_Name || 'Unknown Station',
      address: `${record.Sites_Address_Line_1 || ''}, ${record.Site_Suburb || ''} QLD ${record.Site_Post_Code || ''}`.trim(),
      location: { latitude: lat, longitude: lng },
      price: price,
      fueltype: 'DL',
      lastupdated: new Date(record.TransactionDateutc + 'Z').toISOString(),
      state: 'QLD',
      source: 'qld-data',
      isAdBlueAvailable: false,
    })
  }

  cachedData = stations
  cacheTimestamp = now
  return stations
}

/**
 * Get QLD fuel prices near a location
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} fuelType - Only 'DL' supported
 * @param {string} sortBy - 'price' or 'distance'
 * @returns {Promise<Array>}
 */
export async function getQLDFuelPricesNearby(latitude, longitude, fuelType = 'DL', sortBy = 'price') {
  try {
    const stations = await fetchAllQLDData()

    const results = stations.map((station) => ({
      ...station,
      distance: calculateDistance(
        latitude, longitude,
        station.location.latitude, station.location.longitude
      ),
    }))

    if (sortBy === 'price') {
      results.sort((a, b) => a.price - b.price)
    } else {
      results.sort((a, b) => a.distance - b.distance)
    }

    return results
  } catch (error) {
    console.error('Error fetching QLD fuel prices:', error)
    return []
  }
}

export default { getQLDFuelPricesNearby }
