/**
 * Government price sentinel detector
 *
 * When government fuel APIs return a price of $999.90, $0, or 999.9 for any
 * station, that's an industry-standard placeholder meaning "out of stock".
 * This module detects those sentinel values and flags stations as outages.
 *
 * Runs server-side in GitHub Actions so no CORS issues.
 */

// Sentinel prices that mean "out of stock"
const SENTINEL_PRICES = [999.9, 999.90, 0, 0.0, 9999, 9999.9]
const SENTINEL_THRESHOLD = 990 // Anything >= 990 is suspicious

function isSentinelPrice(price) {
  const p = parseFloat(price)
  if (isNaN(p)) return false
  return p === 0 || p >= SENTINEL_THRESHOLD || SENTINEL_PRICES.includes(p)
}

/**
 * Check NSW FuelCheck API for sentinel prices
 */
async function checkNSWPrices() {
  try {
    const now = new Date()
    const timestamp = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

    const res = await fetch('https://api.onegov.nsw.gov.au/FuelCheckApp/v1/fuel/prices', {
      headers: { 'requesttimestamp': timestamp },
    })
    if (!res.ok) return []
    const data = await res.json()

    const results = []
    const stations = data.stations || []
    const prices = data.prices || []

    // Build station lookup
    const stationMap = new Map()
    for (const s of stations) {
      stationMap.set(s.code, s)
    }

    // Group prices by station
    const stationPrices = new Map()
    for (const p of prices) {
      if (!stationPrices.has(p.stationcode)) {
        stationPrices.set(p.stationcode, [])
      }
      stationPrices.get(p.stationcode).push(p)
    }

    // Check each station for sentinel prices
    for (const [code, pList] of stationPrices) {
      const sentinelFuels = pList.filter(p => isSentinelPrice(p.price))
      if (sentinelFuels.length === 0) continue

      const station = stationMap.get(code)
      if (!station) continue

      // Map NSW fuel type codes to readable names
      const fuelTypeMap = {
        DL: 'diesel', P95: 'premium 95', P98: 'premium 98',
        U91: 'unleaded', E10: 'e10', E85: 'e85',
        LPG: 'lpg', PDL: 'premium diesel', B20: 'biodiesel',
      }

      const outFuelTypes = sentinelFuels.map(p =>
        fuelTypeMap[p.fueltype] || p.fueltype?.toLowerCase() || 'unknown'
      )

      results.push({
        stationName: station.name || 'Unknown',
        brand: station.brand || '',
        lat: station.location?.latitude,
        lng: station.location?.longitude,
        address: station.address || '',
        fuelTypes: outFuelTypes,
        status: 'no_fuel',
        lastReportAt: new Date().toISOString(),
        source: 'govprices-nsw',
      })
    }

    return results
  } catch (err) {
    console.error(`[GovPrices] NSW price check failed: ${err.message}`)
    return []
  }
}

/**
 * Check QLD government fuel prices for sentinel values
 */
async function checkQLDPrices() {
  try {
    // Discover latest resource ID
    const datasets = ['fuel-price-reporting-2026', 'fuel-price-reporting-2025']
    let resourceId = null

    for (const datasetId of datasets) {
      try {
        const res = await fetch(`https://www.data.qld.gov.au/api/3/action/package_show?id=${datasetId}`)
        if (!res.ok) continue
        const data = await res.json()
        const resources = data?.result?.resources || []
        const dsResources = resources.filter(r => r.datastore_active)
        if (dsResources.length > 0) {
          resourceId = dsResources[dsResources.length - 1].id
          break
        }
      } catch { continue }
    }

    if (!resourceId) return []

    // Fetch prices looking for sentinels
    const sql = encodeURIComponent(
      `SELECT "SiteId","Site_Name","Site_Brand","Sites_Address_Line_1","Site_Latitude","Site_Longitude","Fuel_Type","Price" FROM "${resourceId}" WHERE "Price" >= 990 OR "Price" = 0 LIMIT 1000`
    )
    const res = await fetch(`https://www.data.qld.gov.au/api/3/action/datastore_search_sql?sql=${sql}`)
    if (!res.ok) return []
    const data = await res.json()
    const records = data?.result?.records || []

    // Group by station
    const stationGroups = new Map()
    for (const r of records) {
      if (!isSentinelPrice(r.Price)) continue
      const key = r.SiteId
      if (!stationGroups.has(key)) {
        stationGroups.set(key, {
          stationName: r.Site_Name || 'Unknown',
          brand: r.Site_Brand || '',
          lat: parseFloat(r.Site_Latitude),
          lng: parseFloat(r.Site_Longitude),
          address: r.Sites_Address_Line_1 || '',
          fuelTypes: [],
        })
      }
      const fuelType = (r.Fuel_Type || 'unknown').toLowerCase()
      const group = stationGroups.get(key)
      if (!group.fuelTypes.includes(fuelType)) {
        group.fuelTypes.push(fuelType)
      }
    }

    return Array.from(stationGroups.values()).map(s => ({
      ...s,
      status: 'no_fuel',
      lastReportAt: new Date().toISOString(),
      source: 'govprices-qld',
    }))
  } catch (err) {
    console.error(`[GovPrices] QLD price check failed: ${err.message}`)
    return []
  }
}

/**
 * Main scrape function — checks government price APIs for sentinel values
 */
async function scrape() {
  console.log('[GovPrices] Checking government price APIs for sentinel values ($999.90, $0)...')

  const [nswResults, qldResults] = await Promise.all([
    checkNSWPrices(),
    checkQLDPrices(),
  ])

  const total = nswResults.length + qldResults.length
  console.log(`[GovPrices] Found ${nswResults.length} NSW + ${qldResults.length} QLD sentinel-price stations (${total} total)`)

  return [...nswResults, ...qldResults]
}

module.exports = { scrape }
