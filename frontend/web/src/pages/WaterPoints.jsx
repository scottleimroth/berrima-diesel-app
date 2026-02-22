import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Droplets, Navigation, MapPin, Filter } from 'lucide-react'
import { findWaterPoints } from '../services/overpassApi'
import { useGeolocation } from '../hooks/useGeolocation'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'

function WaterPoints() {
  const { location, loading: locationLoading, getCurrentPosition, setManualLocation } = useGeolocation()
  const [searchInput, setSearchInput] = useState('')
  const [radius, setRadius] = useState(50)

  const { data: waterPoints, isLoading, error, refetch } = useQuery({
    queryKey: ['water-points', location.lat, location.lng, radius],
    queryFn: () => findWaterPoints(location.lat, location.lng, radius),
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
            Water Points
          </h1>
          <p className="text-brand-gray">
            Find drinking water and water refill points across Australia.
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
              placeholder="Search location (e.g. Alice Springs, Blue Mountains)"
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
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <LoadingSpinner message="Searching for water points..." />
          ) : error ? (
            <ErrorDisplay
              title="Unable to find water points"
              message="Could not search OpenStreetMap. Please try again."
              onRetry={refetch}
            />
          ) : (
            <>
              <p className="text-sm text-brand-gray mb-4">
                {(waterPoints || []).length} water point{(waterPoints || []).length !== 1 ? 's' : ''} found within {radius}km
              </p>

              <div className="space-y-3">
                {(waterPoints || []).map((wp) => (
                  <div
                    key={wp.id}
                    className="bg-white rounded-xl shadow border border-brand-tan/50 p-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets size={16} className="text-blue-500" />
                      <h3 className="font-headline text-lg font-bold text-brand-brown">{wp.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-brand-gray mb-2">
                      <MapPin size={12} />
                      <span>{wp.distance} km away</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        wp.potable ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {wp.potable ? 'Potable' : 'Non-potable'}
                      </span>
                    </div>
                    {wp.operator && (
                      <p className="text-xs text-brand-gray/60">Operator: {wp.operator}</p>
                    )}
                  </div>
                ))}

                {(waterPoints || []).length === 0 && (
                  <div className="text-center py-12">
                    <Droplets size={48} className="text-brand-tan mx-auto mb-3" />
                    <p className="text-brand-gray">No water points found in this area.</p>
                    <p className="text-sm text-brand-gray/60">Try increasing the search radius.</p>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mt-6">
                <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Water Tips for Tourers</h3>
                <ul className="space-y-2 text-sm text-brand-gray">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    Carry at least 10L of drinking water per person per day in remote areas
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    Always fill up water tanks before heading into areas with limited services
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    Use a water filter or purification tablets for untreated sources
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    Many caravan parks and rest areas offer free potable water
                  </li>
                </ul>
              </div>
            </>
          )}

          <p className="text-xs text-brand-gray/70 text-center mt-8">
            Data from OpenStreetMap contributors. Not all water points may be listed.
            Water quality information is crowd-sourced and may be outdated — always verify water is safe before drinking.
          </p>
        </div>
      </div>
    </div>
  )
}

export default WaterPoints
