/**
 * CheckPetrol.com.au scraper
 *
 * Uses Puppeteer to discover the JSON API behind their Leaflet map,
 * then fetches station outage data filtered to diesel.
 *
 * CheckPetrol tracks ~6,240 stations with ~537 outages typically reported.
 */

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())

// Known API endpoints discovered via Puppeteer exploration.
// These are the endpoints behind CheckPetrol's Leaflet map.
const KNOWN_ENDPOINTS = [
  'https://www.checkpetrol.com.au/api/outages',
  'https://www.checkpetrol.com.au/api/stations/outages',
  'https://www.checkpetrol.com.au/api/v1/outages',
  'https://www.checkpetrol.com.au/api/map/stations',
]

/**
 * Discover API endpoints by intercepting network requests on the site
 */
async function discoverEndpoints() {
  console.log('[CheckPetrol] Launching Puppeteer to discover API endpoints...')

  let browser
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    })

    const page = await browser.newPage()
    const jsonEndpoints = []

    await page.setUserAgent('BerrimaDiesel-FuelTracker/1.0 (community fuel availability tool)')

    page.on('response', async (res) => {
      const contentType = res.headers()['content-type'] || ''
      const url = res.url()

      if (contentType.includes('json') && url.includes('checkpetrol.com.au')) {
        try {
          const text = await res.text()
          jsonEndpoints.push({
            url,
            status: res.status(),
            bodyPreview: text.substring(0, 1000),
            bodyLength: text.length,
          })
        } catch { /* ignore */ }
      }
    })

    await page.goto('https://www.checkpetrol.com.au/', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })

    // Wait for map to load and make API calls
    await new Promise(r => setTimeout(r, 8000))

    // Try clicking on outage/diesel filter if available
    try {
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, a, [role="button"]'))
        const outageBtn = buttons.find(b =>
          /outage|diesel|out of/i.test(b.textContent)
        )
        if (outageBtn) outageBtn.click()
      })
      await new Promise(r => setTimeout(r, 5000))
    } catch { /* filter click optional */ }

    await page.close()
    await browser.close()

    return jsonEndpoints
  } catch (err) {
    console.error(`[CheckPetrol] Puppeteer discovery failed: ${err.message}`)
    if (browser) await browser.close().catch(() => {})
    return []
  }
}

/**
 * Try to fetch outage data from a discovered or known endpoint
 */
async function fetchFromEndpoint(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'BerrimaDiesel-FuelTracker/1.0 (community fuel availability tool)',
        'Accept': 'application/json',
        'Referer': 'https://www.checkpetrol.com.au/',
      },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/**
 * Parse CheckPetrol station data into our standard format.
 * Handles multiple possible response shapes.
 */
function parseStations(data) {
  // Could be { stations: [...] }, { data: [...] }, { outages: [...] }, or just [...]
  const items = Array.isArray(data)
    ? data
    : data?.stations || data?.data || data?.outages || data?.features || []

  // Handle GeoJSON format (Leaflet commonly uses this)
  const normalised = items.map(item => {
    if (item.type === 'Feature' && item.geometry) {
      return {
        ...item.properties,
        lat: item.geometry.coordinates[1],
        lng: item.geometry.coordinates[0],
      }
    }
    return item
  })

  const results = []

  for (const s of normalised) {
    // Skip stations that aren't reporting outages
    const status = s.status || s.outage_status || s.fuel_status || ''
    const isOutage = /out|empty|unavailable|offline|no.?fuel/i.test(String(status)) ||
      s.is_outage === true || s.outage === true

    if (!isOutage && normalised.length > 1000) {
      // If we got the full station list, skip non-outage stations
      continue
    }

    const lat = parseFloat(s.lat || s.latitude || s.Latitude || 0)
    const lng = parseFloat(s.lng || s.lon || s.longitude || s.Longitude || 0)
    if (!lat || !lng) continue

    // Extract fuel types
    let fuelTypes = []
    if (s.fuel_types) {
      if (Array.isArray(s.fuel_types)) {
        fuelTypes = s.fuel_types
      } else if (typeof s.fuel_types === 'object') {
        fuelTypes = Object.entries(s.fuel_types)
          .filter(([, v]) => /out|empty|unavailable/i.test(String(v)))
          .map(([k]) => k)
      }
    }
    if (fuelTypes.length === 0) {
      // Default to diesel if the site was filtered to diesel
      fuelTypes = s.fuel_type ? [s.fuel_type] : ['diesel']
    }

    results.push({
      stationName: s.name || s.station_name || s.site_name || s.Name || 'Unknown',
      brand: s.brand || s.Brand || '',
      lat,
      lng,
      address: s.address || s.Address || '',
      fuelTypes,
      status: 'no_fuel',
      lastReportAt: s.last_updated || s.updated_at || s.reported_at || new Date().toISOString(),
      source: 'checkpetrol.com.au',
    })
  }

  return results
}

/**
 * Main scrape function — tries known endpoints first, falls back to Puppeteer discovery
 */
async function scrape() {
  console.log('[CheckPetrol] Starting scrape...')

  // Phase 1: Try known endpoints directly (fast path)
  for (const url of KNOWN_ENDPOINTS) {
    const data = await fetchFromEndpoint(url)
    if (data) {
      const results = parseStations(data)
      if (results.length > 0) {
        console.log(`[CheckPetrol] Got ${results.length} outages from ${url}`)
        return results
      }
    }
  }

  console.log('[CheckPetrol] Known endpoints failed, trying Puppeteer discovery...')

  // Phase 2: Use Puppeteer to discover endpoints
  const discovered = await discoverEndpoints()

  if (discovered.length > 0) {
    console.log(`[CheckPetrol] Discovered ${discovered.length} JSON endpoints`)

    for (const ep of discovered) {
      console.log(`[CheckPetrol]   ${ep.url} (${ep.bodyLength} bytes)`)

      // Try to parse the captured response directly
      try {
        const data = JSON.parse(ep.bodyPreview.length === ep.bodyLength
          ? ep.bodyPreview
          : await fetchFromEndpoint(ep.url).then(d => d ? JSON.stringify(d) : null) || ep.bodyPreview
        )
        const results = parseStations(data)
        if (results.length > 0) {
          console.log(`[CheckPetrol] Got ${results.length} outages from discovered endpoint`)
          return results
        }
      } catch { continue }
    }
  }

  console.log('[CheckPetrol] No outage data found')
  return []
}

module.exports = { scrape }
