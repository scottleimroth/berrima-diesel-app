/**
 * Main scraper script for fuel outage data.
 *
 * Fetches outage reports from external sources, matches them to government
 * station IDs used by the frontend, and outputs outages.json.
 *
 * Station matching uses lat/lng proximity (within 200m) and fuzzy name matching.
 * All heavy computation happens here, NOT in the frontend.
 */

const fs = require('fs')
const path = require('path')

const fuelalert = require('./sources/fuelalert')
const outtafuel = require('./sources/outtafuel')
const nofuelhere = require('./sources/nofuelhere')
const checkpetrol = require('./sources/checkpetrol')
const govprices = require('./sources/govprices')

const OUTPUT_PATH = path.join(__dirname, '..', 'frontend', 'web', 'public', 'data', 'outages.json')
const MAX_REPORT_AGE_HOURS = 12

// --- Government station data fetching ---

const NSW_API = 'https://api.onegov.nsw.gov.au/FuelCheckApp/v1/fuel/prices'

/**
 * Fetch NSW/ACT government station list for matching
 */
async function fetchNSWStations() {
  try {
    const now = new Date()
    const timestamp = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

    const res = await fetch(NSW_API, {
      headers: { 'requesttimestamp': timestamp },
    })
    if (!res.ok) throw new Error(`NSW API returned ${res.status}`)
    const data = await res.json()

    return (data.stations || []).map(s => ({
      code: s.code,
      name: s.name,
      brand: s.brand,
      lat: s.location?.latitude,
      lng: s.location?.longitude,
      address: s.address,
      state: s.address?.includes(' ACT ') ? 'ACT' : 'NSW',
    }))
  } catch (err) {
    console.error(`[Stations] NSW fetch failed: ${err.message}`)
    return []
  }
}

/**
 * Fetch QLD government station list via CKAN dataset discovery
 */
async function fetchQLDStations() {
  try {
    // Discover the latest resource ID from QLD datasets
    const datasets = ['fuel-price-reporting-2026', 'fuel-price-reporting-2025']
    let resourceId = null

    for (const datasetId of datasets) {
      try {
        const res = await fetch(`https://www.data.qld.gov.au/api/3/action/package_show?id=${datasetId}`)
        if (!res.ok) continue
        const data = await res.json()
        const resources = data?.result?.resources || []
        // Get latest DataStore resource
        const dsResources = resources.filter(r => r.datastore_active)
        if (dsResources.length > 0) {
          resourceId = dsResources[dsResources.length - 1].id
          break
        }
      } catch { continue }
    }

    if (!resourceId) {
      console.log('[Stations] QLD: No active DataStore resource found')
      return []
    }

    const sql = encodeURIComponent(`SELECT DISTINCT "SiteId","Site_Name","Site_Brand","Sites_Address_Line_1","Site_Latitude","Site_Longitude" FROM "${resourceId}" LIMIT 5000`)
    const res = await fetch(`https://www.data.qld.gov.au/api/3/action/datastore_search_sql?sql=${sql}`)
    if (!res.ok) throw new Error(`QLD API returned ${res.status}`)
    const data = await res.json()
    const records = data?.result?.records || []

    // Deduplicate by SiteId
    const seen = new Set()
    return records.filter(r => {
      if (seen.has(r.SiteId)) return false
      seen.add(r.SiteId)
      return true
    }).map(r => ({
      code: `QLD-${r.SiteId}`,
      name: r.Site_Name || '',
      brand: r.Site_Brand || '',
      lat: parseFloat(r.Site_Latitude),
      lng: parseFloat(r.Site_Longitude),
      address: r.Sites_Address_Line_1 || '',
      state: 'QLD',
    }))
  } catch (err) {
    console.error(`[Stations] QLD fetch failed: ${err.message}`)
    return []
  }
}

/**
 * Fetch TAS government station list
 */
async function fetchTASStations() {
  try {
    const res = await fetch('https://www.fuelcheck.tas.gov.au/fuel/api/v1/fuel/prices/bylocation?latitude=-42.0&longitude=147.0&radius=500&fueltype=DL&sortby=price')
    if (!res.ok) throw new Error(`TAS API returned ${res.status}`)
    const data = await res.json()

    return (data || []).map(s => ({
      code: `TAS-${s.ServiceStationID}`,
      name: s.Name || '',
      brand: s.Brand || '',
      lat: s.Lat,
      lng: s.Long,
      address: s.Address || '',
      state: 'TAS',
    }))
  } catch (err) {
    console.error(`[Stations] TAS fetch failed: ${err.message}`)
    return []
  }
}

// --- Matching utilities ---

/**
 * Haversine distance in meters
 */
function distanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Normalise station name for fuzzy matching
 */
function normaliseName(name) {
  return (name || '')
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/\b(service station|servo|petrol station|fuel|stop)\b/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Check if two names are a fuzzy match
 */
function namesMatch(a, b) {
  const na = normaliseName(a)
  const nb = normaliseName(b)
  if (!na || !nb) return false
  // Exact match after normalisation
  if (na === nb) return true
  // One contains the other
  if (na.includes(nb) || nb.includes(na)) return true
  // Check if brand + suburb matches
  const wordsA = na.split(' ')
  const wordsB = nb.split(' ')
  const commonWords = wordsA.filter(w => w.length > 2 && wordsB.includes(w))
  return commonWords.length >= 2
}

/**
 * Match outage reports to government station IDs
 */
function matchOutages(outageReports, govStations) {
  const matched = {}
  const unmatched = []

  for (const report of outageReports) {
    if (!report.lat || !report.lng) {
      unmatched.push(report)
      continue
    }

    let bestMatch = null
    let bestDistance = Infinity

    for (const station of govStations) {
      if (!station.lat || !station.lng) continue

      const dist = distanceMeters(report.lat, report.lng, station.lat, station.lng)
      if (dist > 200) continue // Must be within 200m

      // Prefer closer stations, but also check name matching
      const nameIsMatch = namesMatch(report.stationName, station.name) ||
        namesMatch(report.brand, station.brand)

      if (dist < bestDistance && (dist < 50 || nameIsMatch)) {
        bestMatch = station
        bestDistance = dist
      }
    }

    if (bestMatch) {
      const reportAge = Date.now() - new Date(report.lastReportAt).getTime()
      const ageHours = reportAge / 3600000

      // Skip reports older than MAX_REPORT_AGE_HOURS
      if (ageHours > MAX_REPORT_AGE_HOURS) continue

      const existing = matched[bestMatch.code]
      if (existing) {
        // Merge: add source, update timestamp if newer
        if (!existing.sources.includes(report.source)) {
          existing.sources.push(report.source)
        }
        if (new Date(report.lastReportAt) > new Date(existing.lastConfirmed)) {
          existing.lastConfirmed = report.lastReportAt
        }
        // Merge fuel types
        for (const ft of report.fuelTypes) {
          if (!existing.fuelTypes.includes(ft)) {
            existing.fuelTypes.push(ft)
          }
        }
      } else {
        matched[bestMatch.code] = {
          stationName: bestMatch.name,
          lat: bestMatch.lat,
          lng: bestMatch.lng,
          fuelTypes: [...report.fuelTypes],
          status: report.status || 'no_fuel',
          confidence: 'medium',
          firstReported: report.lastReportAt,
          lastConfirmed: report.lastReportAt,
          sources: [report.source],
        }
      }
    } else {
      unmatched.push(report)
    }
  }

  // Set confidence levels
  // Cross-source corroboration (e.g. CheckPetrol + FuelAlert) = highest confidence
  for (const outage of Object.values(matched)) {
    const ageHours = (Date.now() - new Date(outage.lastConfirmed).getTime()) / 3600000
    const hasCrowdsourcedCorroboration = outage.sources.some(s =>
      s === 'checkpetrol.com.au' || s === 'fuelalert.io'
    ) && outage.sources.length >= 2

    if (hasCrowdsourcedCorroboration) {
      // Multiple independent crowdsourced sources agree — strongest signal
      outage.confidence = 'high'
    } else if (outage.sources.length >= 2 || ageHours < 2) {
      outage.confidence = 'high'
    } else if (ageHours <= 6) {
      outage.confidence = 'medium'
    } else {
      outage.confidence = 'low'
    }
  }

  return { matched, unmatched }
}

// --- Geocoding for outages missing coordinates ---

/**
 * Geocode outage reports that have an address but no lat/lng using Nominatim.
 * Nominatim rate limit: 1 request/second. Only geocode up to maxGeocode reports.
 */
async function geocodeMissingCoords(reports, maxGeocode = 50) {
  const needsGeocoding = reports.filter(r => (!r.lat || !r.lng) && r.address)
  if (needsGeocoding.length === 0) return

  console.log(`[Geocode] ${needsGeocoding.length} reports need geocoding, processing up to ${maxGeocode}`)
  let geocoded = 0

  for (const report of needsGeocoding.slice(0, maxGeocode)) {
    try {
      const query = encodeURIComponent(`${report.address}, Australia`)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=au`,
        { headers: { 'User-Agent': 'BerrimaDiesel-FuelTracker/1.0 (community fuel availability tool)' } }
      )
      if (res.ok) {
        const results = await res.json()
        if (results.length > 0) {
          report.lat = parseFloat(results[0].lat)
          report.lng = parseFloat(results[0].lon)
          geocoded++
        }
      }
      // Respect rate limit
      await new Promise(r => setTimeout(r, 1100))
    } catch { /* skip failed geocode */ }
  }

  console.log(`[Geocode] Successfully geocoded ${geocoded}/${Math.min(needsGeocoding.length, maxGeocode)} reports`)
}

// --- Main ---

async function main() {
  console.log('=== Fuel Outage Scraper ===')
  console.log(`Time: ${new Date().toISOString()}`)

  // 1. Fetch outage data from all sources
  const sources = [
    { name: 'fuelalert.io', fn: fuelalert.scrape },
    { name: 'outtafuel.com.au', fn: outtafuel.scrape },
    { name: 'nofuelhere.com.au', fn: nofuelhere.scrape },
    { name: 'checkpetrol.com.au', fn: checkpetrol.scrape },
    { name: 'govprices', fn: govprices.scrape },
  ]

  const allReports = []
  const activeSources = []

  for (const source of sources) {
    try {
      const reports = await source.fn()
      if (reports.length > 0) {
        allReports.push(...reports)
        activeSources.push(source.name)
      }
    } catch (err) {
      console.error(`[Main] ${source.name} failed: ${err.message}`)
    }
  }

  console.log(`\n[Main] Total outage reports: ${allReports.length} from ${activeSources.length} sources`)

  // 2. Fetch government station data for matching
  console.log('\n[Main] Fetching government station data...')
  const [nswStations, qldStations, tasStations] = await Promise.all([
    fetchNSWStations(),
    fetchQLDStations(),
    fetchTASStations(),
  ])

  const allGovStations = [...nswStations, ...qldStations, ...tasStations]
  console.log(`[Main] Government stations: NSW=${nswStations.length}, QLD=${qldStations.length}, TAS=${tasStations.length}, Total=${allGovStations.length}`)

  // 3. Match outages to government station IDs
  const { matched, unmatched } = matchOutages(allReports, allGovStations)
  const matchedCount = Object.keys(matched).length

  // Diagnostic: lat/lng coverage
  const matchedWithCoords = Object.values(matched).filter(o => o.lat && o.lng).length
  const unmatchedWithCoords = unmatched.filter(r => r.lat && r.lng).length
  const unmatchedNoCoords = unmatched.filter(r => !r.lat || !r.lng).length
  console.log(`[Main] Matched: ${matchedCount} (${matchedWithCoords} with lat/lng)`)
  console.log(`[Main] Unmatched: ${unmatched.length} (${unmatchedWithCoords} with lat/lng, ${unmatchedNoCoords} without)`)

  // Breakdown by source
  const sourceCounts = {}
  for (const r of allReports) {
    sourceCounts[r.source] = (sourceCounts[r.source] || 0) + 1
  }
  for (const [src, count] of Object.entries(sourceCounts)) {
    const withCoords = allReports.filter(r => r.source === src && r.lat && r.lng).length
    console.log(`[Main]   ${src}: ${count} reports (${withCoords} with coords)`)
  }

  // Geocode unmatched outages that have addresses but no coordinates
  await geocodeMissingCoords(unmatched)

  // Count diesel outages
  const dieselOutages = Object.values(matched).filter(o =>
    o.fuelTypes.some(ft => ft.toLowerCase().includes('diesel'))
  ).length

  // 4. Build output
  const output = {
    lastScraped: new Date().toISOString(),
    sources: activeSources,
    stationOutages: matched,
    // Include all unmatched outages that have coordinates (mappable),
    // plus up to 50 without coordinates for the count
    unmatchedOutages: [
      ...unmatched.filter(r => r.lat && r.lng).map(r => ({
        stationName: r.stationName,
        brand: r.brand,
        lat: r.lat,
        lng: r.lng,
        fuelTypes: r.fuelTypes,
        status: r.status,
        lastReportAt: r.lastReportAt,
        source: r.source,
      })),
      ...unmatched.filter(r => !r.lat || !r.lng).slice(0, 50).map(r => ({
        stationName: r.stationName,
        brand: r.brand,
        lat: null,
        lng: null,
        fuelTypes: r.fuelTypes,
        status: r.status,
        lastReportAt: r.lastReportAt,
        source: r.source,
      })),
    ],
    summary: {
      totalOutages: matchedCount + unmatched.length,
      dieselOutages,
      lastUpdated: new Date().toISOString(),
    },
  }

  // 5. Write output
  const outputDir = path.dirname(OUTPUT_PATH)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2))
  console.log(`\n[Main] Output written to ${OUTPUT_PATH}`)
  console.log(`[Main] Total outages: ${output.summary.totalOutages}, Diesel: ${output.summary.dieselOutages}`)
}

main().catch(err => {
  console.error('[Main] Fatal error:', err)
  // Don't fail the GitHub Action — write empty data
  const emptyOutput = {
    lastScraped: new Date().toISOString(),
    sources: [],
    stationOutages: {},
    summary: { totalOutages: 0, dieselOutages: 0, lastUpdated: new Date().toISOString() },
  }
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(emptyOutput, null, 2))
  console.log('[Main] Wrote empty outages.json due to error')
})
