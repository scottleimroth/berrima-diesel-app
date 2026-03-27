/**
 * OuttaFuel.com.au scraper
 *
 * Status: The site's API endpoints (/api/stations, /api/reports) return 404 or empty data.
 * Only /api/activity works but returns aggregate counts only.
 * The site renders data client-side via Next.js RSC which requires browser rendering.
 *
 * This source is stubbed out for now — it will be enabled when a working endpoint
 * is discovered or when Puppeteer-based scraping is implemented.
 */

async function scrape() {
  console.log('[OuttaFuel] Skipping — no working API endpoint discovered')
  console.log('[OuttaFuel] /api/activity returns aggregate counts only')
  console.log('[OuttaFuel] /api/stations and /api/reports return 404')
  return []
}

module.exports = { scrape }
