import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Trash2, Navigation, MapPin, ExternalLink, Filter } from 'lucide-react'
import { findDumpPoints } from '../services/overpassApi'
import { useGeolocation } from '../hooks/useGeolocation'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'

function DumpPoints() {
  const { location, loading: locationLoading, getCurrentPosition, setManualLocation } = useGeolocation()
  const [searchInput, setSearchInput] = useState('')
  const [radius, setRadius] = useState(100)
  const [feeFilter, setFeeFilter] = useState('all')

  const { data: dumpPoints, isLoading, error, refetch } = useQuery({
    queryKey: ['dump-points', location.lat, location.lng, radius],
    queryFn: () => findDumpPoints(location.lat, location.lng, radius),
    staleTime: 30 * 60 * 1000,
  })

  const handleSearch = async () => {
    if (!searchInput.trim()) return
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}&countrycodes=au&limit=1`
      )
      const results = await response.json()
      if (results.length > 0) {
        setManualLocation(parseFloat(results[0].lat), parseFloat(results[0].lon))
      }
    } catch {
      // Geocoding failed
    }
  }

  const filtered = (dumpPoints || []).filter((dp) => {
    if (feeFilter === 'free' && dp.fee !== 'Free') return false
    if (feeFilter === 'paid' && dp.fee !== 'Paid') return false
    return true
  })

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Dump Points
          </h1>
          <p className="text-brand-gray">
            Find sanitary dump stations for RVs, caravans, and motorhomes across Australia.
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-brand-tan/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 max-w-lg mb-3">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search location (e.g. Bathurst, Great Ocean Road)"
              className="flex-1 border border-brand-tan rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 bg-brand-yellow text-brand-navy rounded-lg font-medium text-sm hover:bg-brand-gold transition-colors"
            >
              Search
            </button>
            <button
              onClick={getCurrentPosition}
              disabled={locationLoading}
              className="flex items-center gap-1 px-3 py-2.5 bg-brand-cream border border-brand-tan rounded-lg text-sm text-brand-brown hover:bg-brand-tan/30 transition-colors"
            >
              <Navigation size={14} />
              GPS
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-brand-gray" />
            <select
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="border border-brand-tan rounded-lg px-2 py-1.5 text-sm bg-white"
            >
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
              <option value={200}>200 km</option>
              <option value={500}>500 km</option>
            </select>
            <select
              value={feeFilter}
              onChange={(e) => setFeeFilter(e.target.value)}
              className="border border-brand-tan rounded-lg px-2 py-1.5 text-sm bg-white"
            >
              <option value="all">All</option>
              <option value="free">Free only</option>
              <option value="paid">Paid only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <LoadingSpinner message="Searching for dump points..." />
          ) : error ? (
            <ErrorDisplay
              title="Unable to find dump points"
              message="Could not search OpenStreetMap. Please try again."
              onRetry={refetch}
            />
          ) : (
            <>
              <p className="text-sm text-brand-gray mb-4">
                {filtered.length} dump point{filtered.length !== 1 ? 's' : ''} found within {radius}km
              </p>

              <div className="space-y-3">
                {filtered.map((dp) => (
                  <div
                    key={dp.id}
                    className="bg-white rounded-xl shadow border border-brand-tan/50 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Trash2 size={16} className="text-brand-ochre" />
                          <h3 className="font-headline text-lg font-bold text-brand-brown">{dp.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-brand-gray mb-2">
                          <MapPin size={12} />
                          <span>{dp.distance} km away</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            dp.fee === 'Free' ? 'bg-green-100 text-green-700' :
                            dp.fee === 'Paid' ? 'bg-brand-tan/30 text-brand-brown' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {dp.fee}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {dp.facilities.water && (
                            <span className="text-xs bg-brand-cream px-2 py-1 rounded">💧 Fresh Water</span>
                          )}
                          {dp.facilities.grey_water && (
                            <span className="text-xs bg-brand-cream px-2 py-1 rounded">🚿 Grey Water</span>
                          )}
                          {dp.facilities.chemical_toilet && (
                            <span className="text-xs bg-brand-cream px-2 py-1 rounded">🧪 Chemical Toilet</span>
                          )}
                          {dp.facilities.cassette && (
                            <span className="text-xs bg-brand-cream px-2 py-1 rounded">🔧 Cassette</span>
                          )}
                        </div>

                        {dp.operator && (
                          <p className="text-xs text-brand-gray/60 mt-2">Operator: {dp.operator}</p>
                        )}
                      </div>

                      {dp.website && (
                        <a
                          href={dp.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 p-2 text-brand-gray hover:text-brand-ochre"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <Trash2 size={48} className="text-brand-tan mx-auto mb-3" />
                    <p className="text-brand-gray">No dump points found in this area.</p>
                    <p className="text-sm text-brand-gray/60">Try increasing the search radius. Dump points are less common in remote areas.</p>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mt-6">
                <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Dump Point Etiquette</h3>
                <ul className="space-y-2 text-sm text-brand-gray">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                    Always wear gloves and wash hands thoroughly after use
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                    Rinse the dump point area clean after use
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                    Only dispose of approved waste — no chemicals, oils, or food scraps
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                    Use biodegradable toilet chemicals to protect the environment
                  </li>
                </ul>
              </div>
            </>
          )}

          <p className="text-xs text-brand-gray/70 text-center mt-8">
            Data from OpenStreetMap contributors. Not all dump points may be listed.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DumpPoints
