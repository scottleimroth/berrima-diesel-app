import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ParkingSquare, Navigation, MapPin, Coffee, Filter } from 'lucide-react'
import { findRestAreas } from '../services/overpassApi'
import { useGeolocation } from '../hooks/useGeolocation'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'

function RestAreas() {
  const { location, loading: locationLoading, getCurrentPosition, setManualLocation } = useGeolocation()
  const [searchInput, setSearchInput] = useState('')
  const [radius, setRadius] = useState(50)

  const { data: restAreas, isLoading, error, refetch } = useQuery({
    queryKey: ['rest-areas', location.lat, location.lng, radius],
    queryFn: () => findRestAreas(location.lat, location.lng, radius),
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
      {/* Page Header */}
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Rest Areas
          </h1>
          <p className="text-brand-gray">
            Find rest areas and roadside stops for a safe break on long drives.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border-b border-brand-tan/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 max-w-lg mb-3">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search location (e.g. Dubbo, Bruce Highway)"
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
            <LoadingSpinner message="Searching for rest areas..." />
          ) : error ? (
            <ErrorDisplay
              title="Unable to find rest areas"
              message="Could not search OpenStreetMap. Please try again."
              onRetry={refetch}
            />
          ) : (
            <>
              <p className="text-sm text-brand-gray mb-4">
                {(restAreas || []).length} rest area{(restAreas || []).length !== 1 ? 's' : ''} found within {radius}km
              </p>

              <div className="space-y-3">
                {(restAreas || []).map((area) => (
                  <div
                    key={area.id}
                    className="bg-white rounded-xl shadow border border-brand-tan/50 p-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ParkingSquare size={16} className="text-brand-ochre" />
                      <h3 className="font-headline text-lg font-bold text-brand-brown">{area.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-brand-gray mb-3">
                      <MapPin size={12} />
                      <span>{area.distance} km away</span>
                    </div>

                    {/* Facilities */}
                    <div className="flex flex-wrap gap-2">
                      {area.facilities.toilets && (
                        <span className="text-xs bg-brand-cream px-2 py-1 rounded">🚻 Toilets</span>
                      )}
                      {area.facilities.water && (
                        <span className="text-xs bg-brand-cream px-2 py-1 rounded">💧 Drinking Water</span>
                      )}
                      {area.facilities.shelter && (
                        <span className="text-xs bg-brand-cream px-2 py-1 rounded">🏠 Shelter</span>
                      )}
                      {area.facilities.picnic_table && (
                        <span className="text-xs bg-brand-cream px-2 py-1 rounded">🪑 Picnic Table</span>
                      )}
                      {area.facilities.bbq && (
                        <span className="text-xs bg-brand-cream px-2 py-1 rounded">🔥 BBQ</span>
                      )}
                      {!area.facilities.toilets && !area.facilities.water && !area.facilities.shelter && !area.facilities.picnic_table && !area.facilities.bbq && (
                        <span className="text-xs text-brand-gray/60">No facility data available</span>
                      )}
                    </div>
                  </div>
                ))}

                {(restAreas || []).length === 0 && (
                  <div className="text-center py-12">
                    <Coffee size={48} className="text-brand-tan mx-auto mb-3" />
                    <p className="text-brand-gray">No rest areas found in this area.</p>
                    <p className="text-sm text-brand-gray/60">Try increasing the search radius.</p>
                  </div>
                )}
              </div>

              {/* Driver Fatigue Info */}
              <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mt-6">
                <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Driver Fatigue Tips</h3>
                <ul className="space-y-2 text-sm text-brand-gray">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                    Stop every 2 hours or 200km for a break
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                    Share driving on long trips — swap every 2 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                    Avoid driving between 2am and 6am when drowsiness peaks
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                    If you feel drowsy, pull over and have a 20-minute power nap
                  </li>
                </ul>
                <p className="text-xs text-brand-gray/60 mt-3 border-t border-brand-tan/30 pt-2">
                  Based on Australian road safety guidelines. Individual needs vary — if you feel tired, stop immediately.
                </p>
              </div>
            </>
          )}

          <p className="text-xs text-brand-gray/70 text-center mt-8">
            Data from OpenStreetMap contributors. Not all rest areas may be listed.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RestAreas
