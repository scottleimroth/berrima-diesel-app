import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Wifi, Navigation, MapPin, Filter } from 'lucide-react'
import { findWifiHotspots } from '../services/overpassApi'
import { useGeolocation } from '../hooks/useGeolocation'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'

const VENUE_LABELS = {
  library: 'Library',
  cafe: 'Cafe',
  restaurant: 'Restaurant',
  fast_food: 'Fast Food',
  pub: 'Pub',
  fuel: 'Service Station',
  community_centre: 'Community Centre',
  information: 'Info Centre',
  camp_site: 'Campground',
  caravan_site: 'Caravan Park',
  hostel: 'Hostel',
  hotel: 'Hotel',
  motel: 'Motel',
  supermarket: 'Supermarket',
  convenience: 'Convenience Store',
}

function WifiHotspots() {
  const { location, loading: locationLoading, getCurrentPosition, setManualLocation } = useGeolocation()
  const [searchInput, setSearchInput] = useState('')
  const [radius, setRadius] = useState(25)
  const [freeOnly, setFreeOnly] = useState(false)

  const { data: hotspots, isLoading, error, refetch } = useQuery({
    queryKey: ['wifi-hotspots', location.lat, location.lng, radius],
    queryFn: () => findWifiHotspots(location.lat, location.lng, radius),
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

  const filtered = (hotspots || []).filter((hs) => {
    if (freeOnly && !hs.free) return false
    return true
  })

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            WiFi Hotspots
          </h1>
          <p className="text-brand-gray">
            Find free public WiFi near you — libraries, cafes, caravan parks, and more.
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
              placeholder="Search location (e.g. Broken Hill, Port Augusta)"
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
            <button
              onClick={() => setFreeOnly(!freeOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                freeOnly
                  ? 'bg-brand-yellow text-brand-navy border-brand-gold'
                  : 'bg-white text-brand-gray border-brand-tan hover:border-brand-ochre'
              }`}
            >
              Free Only
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <LoadingSpinner message="Searching for WiFi hotspots..." />
          ) : error ? (
            <ErrorDisplay
              title="Unable to find WiFi hotspots"
              message="Could not search OpenStreetMap. Please try again."
              onRetry={refetch}
            />
          ) : (
            <>
              <p className="text-sm text-brand-gray mb-4">
                {filtered.length} hotspot{filtered.length !== 1 ? 's' : ''} found within {radius}km
              </p>

              <div className="space-y-3">
                {filtered.map((hs) => (
                  <div
                    key={hs.id}
                    className="bg-white rounded-xl shadow border border-brand-tan/50 p-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Wifi size={16} className="text-blue-500" />
                      <h3 className="font-headline text-lg font-bold text-brand-brown">{hs.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-brand-gray mb-2">
                      <MapPin size={12} />
                      <span>{hs.distance} km away</span>
                      {hs.free && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Free</span>
                      )}
                      <span className="px-2 py-0.5 bg-brand-cream rounded text-xs">
                        {VENUE_LABELS[hs.type] || hs.type}
                      </span>
                    </div>
                    {hs.opening_hours && (
                      <p className="text-xs text-brand-gray/60">Hours: {hs.opening_hours}</p>
                    )}
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <Wifi size={48} className="text-brand-tan mx-auto mb-3" />
                    <p className="text-brand-gray">No WiFi hotspots found in this area.</p>
                    <p className="text-sm text-brand-gray/60">Try increasing the search radius or checking nearby towns.</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mt-6">
                <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Staying Connected on the Road</h3>
                <ul className="space-y-2 text-sm text-brand-gray">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    Public libraries offer free WiFi — most are open 6 days a week
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    Many caravan parks include WiFi — quality varies, ask before booking
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    McDonald's, KFC, and most shopping centres offer free WiFi
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                    Consider a Starlink or Telstra mobile hotspot for extended remote travel
                  </li>
                </ul>
              </div>
            </>
          )}

          <p className="text-xs text-brand-gray/70 text-center mt-8">
            Data from OpenStreetMap contributors. Not all WiFi locations may be listed.
          </p>
        </div>
      </div>
    </div>
  )
}

export default WifiHotspots
