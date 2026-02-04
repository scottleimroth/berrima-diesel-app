/**
 * WA FuelWatch API Service
 *
 * Fetches diesel prices from WA FuelWatch RSS feed.
 * FuelWatch publishes tomorrow's and today's regulated fuel prices.
 * Product=4 is Diesel.
 *
 * CORS: FuelWatch doesn't support CORS, so we proxy via allorigins.win
 *
 * Regions: Metro (default) + regional areas (StateRegion 1-9)
 * 1=Gascoyne, 2=Goldfields-Esperance, 3=Great Southern, 4=Kimberley,
 * 5=Mid West, 6=Peel, 7=Pilbara, 8=South West, 9=Wheatbelt
 */

const FUELWATCH_BASE = 'https://www.fuelwatch.wa.gov.au/fuelwatch/fuelWatchRSS'
const CORS_PROXY = 'https://api.allorigins.win/raw?url='
const WA_REGIONS = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9] // null = metro

let cachedData = null
let cacheTimestamp = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour (WA prices update daily)

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
 * Build the FuelWatch RSS URL for a given region
 */
function buildFuelWatchUrl(regionId) {
  let url = `${FUELWATCH_BASE}?Product=4` // Product=4 is Diesel
  if (regionId !== null) {
    url += `&StateRegion=${regionId}`
  }
  return url
}

/**
 * Parse FuelWatch RSS XML into station objects
 */
function parseRssXml(xmlText) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlText, 'text/xml')
  const items = doc.querySelectorAll('item')
  const stations = []

  items.forEach((item) => {
    const getText = (tag) => {
      const el = item.querySelector(tag)
      return el ? el.textContent.trim() : ''
    }

    const lat = parseFloat(getText('latitude'))
    const lng = parseFloat(getText('longitude'))
    const price = parseFloat(getText('price'))

    if (isNaN(lat) || isNaN(lng) || isNaN(price)) return

    const tradingName = getText('trading-name')
    const brand = getText('brand')
    const address = getText('address')
    const location = getText('location')
    const date = getText('date')
    const phone = getText('phone')
    const siteFeatures = getText('site-features')

    stations.push({
      code: `WA-${tradingName.replace(/\s+/g, '-').toLowerCase()}-${lat.toFixed(4)}`,
      brand: brand,
      name: tradingName,
      address: `${address}, ${location}, WA`,
      location: { latitude: lat, longitude: lng },
      price: price, // Already in cents per litre (e.g., 178.9)
      fueltype: 'DL',
      lastupdated: new Date(`${date}T00:00:00+08:00`).toISOString(), // AWST
      state: 'WA',
      source: 'fuelwatch',
      phone,
      siteFeatures,
      isAdBlueAvailable: siteFeatures.toLowerCase().includes('adblue'),
    })
  })

  return stations
}

/**
 * Fetch a single FuelWatch RSS feed via CORS proxy
 */
async function fetchRegion(regionId) {
  const targetUrl = buildFuelWatchUrl(regionId)
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`

  const response = await fetch(proxyUrl)
  if (!response.ok) {
    console.warn(`FuelWatch fetch failed for region ${regionId}: ${response.status}`)
    return []
  }

  const xmlText = await response.text()
  return parseRssXml(xmlText)
}

/**
 * Fetch all WA diesel prices from all regions
 */
async function fetchAllWAData() {
  const now = Date.now()
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedData
  }

  // Fetch metro first (most data), then regional areas in parallel
  const allResults = await Promise.allSettled(
    WA_REGIONS.map((regionId) => fetchRegion(regionId))
  )

  // Merge results, deduplicate by station name + coordinates
  const seen = new Set()
  const stations = []

  for (const result of allResults) {
    if (result.status !== 'fulfilled') continue
    for (const station of result.value) {
      const key = `${station.name}-${station.location.latitude.toFixed(4)}`
      if (seen.has(key)) continue
      seen.add(key)
      stations.push(station)
    }
  }

  cachedData = stations
  cacheTimestamp = now
  return stations
}

/**
 * Get WA fuel prices near a location
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} fuelType - Only 'DL' supported for WA
 * @param {string} sortBy - 'price' or 'distance'
 * @returns {Promise<Array>}
 */
export async function getWAFuelPricesNearby(latitude, longitude, fuelType = 'DL', sortBy = 'price') {
  try {
    const stations = await fetchAllWAData()

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
    console.error('Error fetching WA fuel prices:', error)
    return []
  }
}

export default { getWAFuelPricesNearby }
