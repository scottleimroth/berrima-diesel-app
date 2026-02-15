import { useQuery } from '@tanstack/react-query'
import { CloudRain, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'

const BOM_WARNINGS_URL = 'https://api.open-meteo.com/v1/bom'

// BOM warning RSS feeds by state
const STATE_FEEDS = [
  { code: 'NSW', name: 'New South Wales', url: 'http://www.bom.gov.au/fwo/IDN60000.warnings_land_nsw.xml' },
  { code: 'VIC', name: 'Victoria', url: 'http://www.bom.gov.au/fwo/IDV60000.warnings_land_vic.xml' },
  { code: 'QLD', name: 'Queensland', url: 'http://www.bom.gov.au/fwo/IDQ60000.warnings_land_qld.xml' },
  { code: 'SA', name: 'South Australia', url: 'http://www.bom.gov.au/fwo/IDS60000.warnings_land_sa.xml' },
  { code: 'WA', name: 'Western Australia', url: 'http://www.bom.gov.au/fwo/IDW60000.warnings_land_wa.xml' },
  { code: 'TAS', name: 'Tasmania', url: 'http://www.bom.gov.au/fwo/IDT60000.warnings_land_tas.xml' },
  { code: 'NT', name: 'Northern Territory', url: 'http://www.bom.gov.au/fwo/IDD60000.warnings_land_nt.xml' },
  { code: 'ACT', name: 'Australian Capital Territory', url: 'http://www.bom.gov.au/fwo/IDN60000.warnings_land_nsw.xml' },
]

// BOM flood warning page links
const FLOOD_LINKS = [
  { state: 'NSW', name: 'NSW Flood Warnings', url: 'http://www.bom.gov.au/nsw/warnings/flood/' },
  { state: 'VIC', name: 'VIC Flood Warnings', url: 'http://www.bom.gov.au/vic/warnings/flood/' },
  { state: 'QLD', name: 'QLD Flood Warnings', url: 'http://www.bom.gov.au/qld/warnings/flood/' },
  { state: 'SA', name: 'SA Flood Warnings', url: 'http://www.bom.gov.au/sa/warnings/flood/' },
  { state: 'WA', name: 'WA Flood Warnings', url: 'http://www.bom.gov.au/wa/warnings/flood/' },
  { state: 'TAS', name: 'TAS Flood Warnings', url: 'http://www.bom.gov.au/tas/warnings/flood/' },
  { state: 'NT', name: 'NT Flood Warnings', url: 'http://www.bom.gov.au/nt/warnings/flood/' },
]

// Fetch BOM warnings via allorigins proxy (BOM has no CORS)
async function fetchBomWarnings() {
  const warnings = []

  // Try fetching a few state feeds via proxy
  const statesToCheck = ['NSW', 'VIC', 'QLD']

  for (const stateCode of statesToCheck) {
    const state = STATE_FEEDS.find((s) => s.code === stateCode)
    if (!state) continue

    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(state.url)}`
      const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) })
      if (!response.ok) continue

      const text = await response.text()
      const parser = new DOMParser()
      const xml = parser.parseFromString(text, 'text/xml')
      const items = xml.querySelectorAll('item')

      items.forEach((item) => {
        const title = item.querySelector('title')?.textContent || ''
        const description = item.querySelector('description')?.textContent || ''
        const pubDate = item.querySelector('pubDate')?.textContent || ''
        const link = item.querySelector('link')?.textContent || ''

        // Filter for flood-related warnings
        const isFlood = /flood|rain|storm|thunder|cyclone|severe weather/i.test(title)
        if (isFlood) {
          warnings.push({
            id: `${stateCode}-${title}`,
            state: stateCode,
            title,
            description: description.replace(/<[^>]+>/g, '').substring(0, 300),
            date: pubDate,
            link,
            severity: /severe|emergency|major/i.test(title) ? 'severe' :
                       /warning/i.test(title) ? 'warning' : 'watch',
          })
        }
      })
    } catch {
      // Skip failed feeds
    }
  }

  return warnings
}

function FloodWarnings() {
  const { data: warnings, isLoading, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['flood-warnings'],
    queryFn: fetchBomWarnings,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
  })

  const severityStyle = (severity) => {
    switch (severity) {
      case 'severe': return 'bg-red-100 border-red-300 text-red-800'
      case 'warning': return 'bg-orange-100 border-orange-300 text-orange-800'
      default: return 'bg-yellow-100 border-yellow-300 text-yellow-800'
    }
  }

  const severityLabel = (severity) => {
    switch (severity) {
      case 'severe': return 'Severe'
      case 'warning': return 'Warning'
      default: return 'Watch'
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Flood & Weather Warnings
          </h1>
          <p className="text-brand-gray">
            BOM flood warnings and severe weather alerts from the Bureau of Meteorology.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Quick Links to BOM */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={20} className="text-brand-ochre flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-headline text-lg font-bold text-brand-brown mb-1">
                  Official BOM Flood Warnings
                </h3>
                <p className="text-sm text-brand-gray">
                  Always check the official Bureau of Meteorology site for the most current warnings.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FLOOD_LINKS.map((link) => (
                <a
                  key={link.state}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-brand-cream hover:bg-brand-tan/30 rounded-lg text-sm font-medium text-brand-brown transition-colors border border-brand-tan/50"
                >
                  {link.state}
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>

          {/* Refresh */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-brand-gray">
              {dataUpdatedAt ? `Last checked: ${new Date(dataUpdatedAt).toLocaleTimeString()}` : 'Loading...'}
            </p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1 text-sm text-brand-ochre hover:text-brand-brown transition-colors"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {isLoading ? (
            <LoadingSpinner message="Checking BOM warnings..." />
          ) : error ? (
            <ErrorDisplay
              title="Unable to fetch warnings"
              message="Could not load BOM warning feeds. Check the official BOM links above."
              onRetry={refetch}
            />
          ) : (
            <>
              {(warnings || []).length > 0 ? (
                <div className="space-y-3 mb-6">
                  {/* Summary cards */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-red-700">
                        {(warnings || []).filter((w) => w.severity === 'severe').length}
                      </p>
                      <p className="text-xs text-red-600">Severe</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-orange-700">
                        {(warnings || []).filter((w) => w.severity === 'warning').length}
                      </p>
                      <p className="text-xs text-orange-600">Warnings</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-700">
                        {(warnings || []).filter((w) => w.severity === 'watch').length}
                      </p>
                      <p className="text-xs text-yellow-600">Watches</p>
                    </div>
                  </div>

                  {warnings.map((warning) => (
                    <div
                      key={warning.id}
                      className={`rounded-xl border-2 p-5 ${severityStyle(warning.severity)}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-white/50 rounded text-xs font-bold">{warning.state}</span>
                            <span className="px-2 py-0.5 bg-white/50 rounded text-xs font-bold">{severityLabel(warning.severity)}</span>
                          </div>
                          <h3 className="font-headline font-bold mb-1">{warning.title}</h3>
                          {warning.description && (
                            <p className="text-sm opacity-80">{warning.description}</p>
                          )}
                          {warning.date && (
                            <p className="text-xs opacity-60 mt-2">{warning.date}</p>
                          )}
                        </div>
                        {warning.link && (
                          <a
                            href={warning.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-2 opacity-60 hover:opacity-100"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-green-50 rounded-xl border-2 border-green-200 mb-6">
                  <CloudRain size={48} className="text-green-400 mx-auto mb-3" />
                  <p className="text-green-700 font-bold text-lg">No Active Flood Warnings</p>
                  <p className="text-sm text-green-600 mt-1">
                    No current flood or severe weather warnings detected for NSW, VIC, and QLD.
                  </p>
                  <p className="text-xs text-green-500 mt-2">
                    Check official BOM links above for other states and full details.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Safety Tips */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6">
            <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Flood Safety for Tourers</h3>
            <ul className="space-y-2 text-sm text-brand-gray">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></span>
                <strong>If it's flooded, forget it.</strong> Never drive through floodwater — it takes just 15cm to float a car
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></span>
                Floodwater can be flowing faster than it looks and hide road damage underneath
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></span>
                Check road conditions before setting off — contact local police or councils in regional areas
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></span>
                Move to higher ground if camping near creeks or rivers when heavy rain is forecast
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                Keep emergency supplies: water, food, torch, first aid kit, fully charged phone
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                Download the Emergency+ app — it gives your GPS coordinates to triple zero (000)
              </li>
            </ul>
          </div>

          <p className="text-xs text-brand-gray/70 text-center mt-8">
            Warning data sourced from Bureau of Meteorology RSS feeds via proxy. Always verify with official BOM site.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FloodWarnings
