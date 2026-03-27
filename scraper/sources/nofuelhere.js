/**
 * NoFuelHere.com.au scraper
 *
 * Status: The site's map feature is disabled (API returns {"enabled": false}).
 * No station/outage data is available via API.
 *
 * This source is stubbed out until the site enables its map/data features.
 */

async function scrape() {
  console.log('[NoFuelHere] Skipping — map feature is disabled')
  console.log('[NoFuelHere] /api/settings/map-enabled returns {"enabled": false}')
  return []
}

module.exports = { scrape }
