/**
 * FuelAlert.io scraper
 * Uses Supabase REST API to fetch station outage data
 */

const SUPABASE_URL = 'https://ytocaalbojgqwapojsqd.supabase.co/rest/v1'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0b2NhYWxib2pncXdhcG9qc3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4ODMyMTYsImV4cCI6MjA4OTQ1OTIxNn0.W1I9CwzP4bd8c1W66INHLFstuxJsJ47nvUiWSzm2ZXE'

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
}

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}

/**
 * Fetch station outage status from FuelAlert
 * Returns array of { stationId, stationName, brand, lat, lng, fuelTypes, status, lastReportAt }
 */
async function scrape() {
  console.log('[FuelAlert] Fetching station status data...')

  try {
    // 1. Fetch station statuses (outage reports)
    const statusRes = await fetch(
      `${SUPABASE_URL}/station_status?select=station_id,status,fuel_types,last_report_at&limit=500`,
      { headers }
    )
    if (!statusRes.ok) {
      throw new Error(`Station status API returned ${statusRes.status}`)
    }
    const statuses = await statusRes.json()
    console.log(`[FuelAlert] Got ${statuses.length} station statuses`)

    // Filter to only stations with outages
    const outageStatuses = statuses.filter(s => s.status === 'out' || s.status === 'limited')
    console.log(`[FuelAlert] ${outageStatuses.length} stations with outages`)

    if (outageStatuses.length === 0) {
      return []
    }

    await delay(2000 + Math.random() * 3000)

    // 2. Fetch station details for matching (name, brand, lat, lng)
    const stationIds = outageStatuses.map(s => s.station_id)
    // Supabase has URL length limits, batch the IDs
    const BATCH_SIZE = 50
    const allStations = []

    for (let i = 0; i < stationIds.length; i += BATCH_SIZE) {
      const batch = stationIds.slice(i, i + BATCH_SIZE)
      const idList = batch.join(',')
      const stationRes = await fetch(
        `${SUPABASE_URL}/stations?select=id,name,brand,lat,lng,address&id=in.(${idList})`,
        { headers }
      )
      if (stationRes.ok) {
        const stations = await stationRes.json()
        allStations.push(...stations)
      }
      if (i + BATCH_SIZE < stationIds.length) {
        await delay(2000 + Math.random() * 3000)
      }
    }

    console.log(`[FuelAlert] Got details for ${allStations.length} stations`)

    // 3. Merge status with station details
    const stationMap = new Map(allStations.map(s => [s.id, s]))
    const results = []

    for (const status of outageStatuses) {
      const station = stationMap.get(status.station_id)
      if (!station) continue

      // Extract fuel types that are "out"
      const outFuelTypes = []
      if (status.fuel_types) {
        for (const [fuelType, fuelStatus] of Object.entries(status.fuel_types)) {
          if (fuelStatus === 'out') {
            outFuelTypes.push(fuelType)
          }
        }
      }

      results.push({
        stationName: station.name || 'Unknown',
        brand: station.brand || '',
        lat: station.lat,
        lng: station.lng,
        address: station.address || '',
        fuelTypes: outFuelTypes.length > 0 ? outFuelTypes : ['unknown'],
        status: status.status === 'out' ? 'no_fuel' : 'limited',
        lastReportAt: status.last_report_at,
        source: 'fuelalert.io',
      })
    }

    console.log(`[FuelAlert] Returning ${results.length} outage reports`)
    return results
  } catch (err) {
    console.error(`[FuelAlert] Error: ${err.message}`)
    return []
  }
}

module.exports = { scrape }
