import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Tent, Navigation, MapPin, ExternalLink, Droplets, Zap, Dog, Wifi, Filter } from 'lucide-react'
import { findCampgrounds } from '../services/overpassApi'
import { useGeolocation } from '../hooks/useGeolocation'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'

function Campgrounds() {
  const { location, loading: locationLoading, getCurrentPosition, setManualLocation } = useGeolocation()
  const [searchInput, setSearchInput] = useState('')
  const [radius, setRadius] = useState(50)
  const [feeFilter, setFeeFilter] = useState('all') // all, free, paid
  const [facilityFilters, setFacilityFilters] = useState({ toilets: false, water: false, power: false, pets: false, showers: false })

  const { data: campgrounds, isLoading, error, refetch } = useQuery({
    queryKey: ['campgrounds', location.lat, location.lng, radius],
    queryFn: () => findCampgrounds(location.lat, location.lng, radius),
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

  // Apply filters
  const filtered = (campgrounds || []).filter((cg) => {
    if (feeFilter === 'free' && cg.fee !== 'Free') return false
    if (feeFilter === 'paid' && cg.fee !== 'Paid') return false
    if (facilityFilters.toilets && !cg.facilities.toilets) return false
    if (facilityFilters.water && !cg.facilities.water) return false
    if (facilityFilters.power && !cg.facilities.power) return false
    if (facilityFilters.pets && !cg.facilities.pets) return false
    if (facilityFilters.showers && !cg.facilities.showers) return false
    return true
  })

  const toggleFacility = (key) => {
    setFacilityFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Page Header */}
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Campground Finder
          </h1>
          <p className="text-brand-gray">
            Find campgrounds and caravan parks from OpenStreetMap data.
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
              placeholder="Search location (e.g. Byron Bay, Grampians)"
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

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
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
            <select
              value={feeFilter}
              onChange={(e) => setFeeFilter(e.target.value)}
              className="border border-brand-tan rounded-lg px-2 py-1.5 text-sm bg-white"
            >
              <option value="all">All</option>
              <option value="free">Free only</option>
              <option value="paid">Paid only</option>
            </select>
            {[
              { key: 'toilets', label: 'Toilets', icon: '🚻' },
              { key: 'water', label: 'Water', icon: '💧' },
              { key: 'power', label: 'Power', icon: '⚡' },
              { key: 'pets', label: 'Pets', icon: '🐕' },
              { key: 'showers', label: 'Showers', icon: '🚿' },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => toggleFacility(key)}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  facilityFilters[key]
                    ? 'bg-brand-yellow text-brand-navy border-brand-gold'
                    : 'bg-white text-brand-gray border-brand-tan hover:border-brand-ochre'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <LoadingSpinner message="Searching for campgrounds..." />
          ) : error ? (
            <ErrorDisplay
              title="Unable to find campgrounds"
              message="Could not search OpenStreetMap. Please try again."
              onRetry={refetch}
            />
          ) : (
            <>
              <p className="text-sm text-brand-gray mb-4">
                {filtered.length} campground{filtered.length !== 1 ? 's' : ''} found within {radius}km
              </p>

              <div className="space-y-3">
                {filtered.map((cg) => (
                  <div
                    key={cg.id}
                    className="bg-white rounded-xl shadow border border-brand-tan/50 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Tent size={16} className="text-brand-eucalyptus" />
                          <h3 className="font-headline text-lg font-bold text-brand-brown">{cg.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-brand-gray mb-2">
                          <MapPin size={12} />
                          <span>{cg.distance} km away</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            cg.fee === 'Free' ? 'bg-green-100 text-green-700' :
                            cg.fee === 'Paid' ? 'bg-brand-tan/30 text-brand-brown' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {cg.fee}
                          </span>
                          <span className="text-xs text-brand-gray/60">
                            {cg.type === 'caravan_park' ? 'Caravan Park' : 'Campground'}
                          </span>
                        </div>

                        {/* Facilities */}
                        <div className="flex flex-wrap gap-2">
                          {cg.facilities.toilets && (
                            <span className="text-xs bg-brand-cream px-2 py-1 rounded">🚻 Toilets</span>
                          )}
                          {cg.facilities.water && (
                            <span className="text-xs bg-brand-cream px-2 py-1 rounded">💧 Water</span>
                          )}
                          {cg.facilities.showers && (
                            <span className="text-xs bg-brand-cream px-2 py-1 rounded">🚿 Showers</span>
                          )}
                          {cg.facilities.power && (
                            <span className="text-xs bg-brand-cream px-2 py-1 rounded">⚡ Power</span>
                          )}
                          {cg.facilities.bbq && (
                            <span className="text-xs bg-brand-cream px-2 py-1 rounded">🔥 BBQ</span>
                          )}
                          {cg.facilities.pets && (
                            <span className="text-xs bg-brand-cream px-2 py-1 rounded">🐕 Pet Friendly</span>
                          )}
                          {cg.facilities.dump_station && (
                            <span className="text-xs bg-brand-cream px-2 py-1 rounded">🚮 Dump Station</span>
                          )}
                          {cg.facilities.wifi && (
                            <span className="text-xs bg-brand-cream px-2 py-1 rounded">📶 WiFi</span>
                          )}
                        </div>

                        {cg.operator && (
                          <p className="text-xs text-brand-gray/60 mt-2">Operator: {cg.operator}</p>
                        )}
                      </div>

                      {cg.website && (
                        <a
                          href={cg.website}
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
                    <Tent size={48} className="text-brand-tan mx-auto mb-3" />
                    <p className="text-brand-gray">No campgrounds found matching your filters.</p>
                    <p className="text-sm text-brand-gray/60">Try increasing the radius or removing filters.</p>
                  </div>
                )}
              </div>
            </>
          )}

          <p className="text-xs text-brand-gray/70 text-center mt-8">
            Data from OpenStreetMap contributors. Not all campgrounds or facilities may be listed.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Campgrounds
