import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Flame, Navigation, MapPin, ExternalLink, Filter, Phone } from 'lucide-react'
import { findGasRefills } from '../services/overpassApi'
import { useGeolocation } from '../hooks/useGeolocation'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'

function GasRefills() {
  const { location, loading: locationLoading, getCurrentPosition, setManualLocation } = useGeolocation()
  const [searchInput, setSearchInput] = useState('')
  const [radius, setRadius] = useState(100)

  const { data: gasStations, isLoading, error, refetch } = useQuery({
    queryKey: ['gas-refills', location.lat, location.lng, radius],
    queryFn: () => findGasRefills(location.lat, location.lng, radius),
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

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Gas Bottle Refills
          </h1>
          <p className="text-brand-gray">
            Find LPG and camping gas refill stations across Australia.
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
              placeholder="Search location (e.g. Dubbo, Cairns)"
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
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
              <option value={200}>200 km</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <LoadingSpinner message="Searching for gas refill stations..." />
          ) : error ? (
            <ErrorDisplay
              title="Unable to find gas stations"
              message="Could not search OpenStreetMap. Please try again."
              onRetry={refetch}
            />
          ) : (
            <>
              <p className="text-sm text-brand-gray mb-4">
                {(gasStations || []).length} LPG/gas station{(gasStations || []).length !== 1 ? 's' : ''} found within {radius}km
              </p>

              <div className="space-y-3">
                {(gasStations || []).map((station) => (
                  <div
                    key={station.id}
                    className="bg-white rounded-xl shadow border border-brand-tan/50 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Flame size={16} className="text-orange-500" />
                          <h3 className="font-headline text-lg font-bold text-brand-brown">{station.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-brand-gray mb-2">
                          <MapPin size={12} />
                          <span>{station.distance} km away</span>
                          {station.brand && (
                            <span className="px-2 py-0.5 bg-brand-cream rounded text-xs">{station.brand}</span>
                          )}
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                            {station.type === 'gas_shop' ? 'Gas Shop' : 'Fuel Station (LPG)'}
                          </span>
                        </div>
                        {station.opening_hours && (
                          <p className="text-xs text-brand-gray/60">Hours: {station.opening_hours}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {station.phone && (
                          <a
                            href={`tel:${station.phone}`}
                            className="flex-shrink-0 p-2 text-brand-gray hover:text-brand-ochre"
                          >
                            <Phone size={16} />
                          </a>
                        )}
                        {station.website && (
                          <a
                            href={station.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-2 text-brand-gray hover:text-brand-ochre"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {(gasStations || []).length === 0 && (
                  <div className="text-center py-12">
                    <Flame size={48} className="text-brand-tan mx-auto mb-3" />
                    <p className="text-brand-gray">No LPG/gas stations found in this area.</p>
                    <p className="text-sm text-brand-gray/60">Try increasing the search radius.</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mt-6">
                <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Gas Bottle Tips</h3>
                <ul className="space-y-2 text-sm text-brand-gray">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    Most servo LPG bowsers can fill 9kg and 4.5kg camping bottles with an adapter
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    Swap'n'Go is widely available at hardware stores and servos for quick bottle exchange
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    Refilling is cheaper than swapping — bring a POL to bayonet adapter
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    In remote areas, gas availability can be limited — carry a spare bottle
                  </li>
                </ul>
              </div>
            </>
          )}

          <p className="text-xs text-brand-gray/70 text-center mt-8">
            Data from OpenStreetMap contributors. Not all LPG stations may be listed.
          </p>
        </div>
      </div>
    </div>
  )
}

export default GasRefills
