import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Wrench, Navigation, MapPin, ExternalLink, Filter, Phone } from 'lucide-react'
import { findWorkshops } from '../services/overpassApi'
import { useGeolocation } from '../hooks/useGeolocation'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'

function WorkshopFinder() {
  const { location, loading: locationLoading, getCurrentPosition, setManualLocation } = useGeolocation()
  const [searchInput, setSearchInput] = useState('')
  const [radius, setRadius] = useState(50)

  const { data: workshops, isLoading, error, refetch } = useQuery({
    queryKey: ['workshops', location.lat, location.lng, radius],
    queryFn: () => findWorkshops(location.lat, location.lng, radius),
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
            Workshop Finder
          </h1>
          <p className="text-brand-gray">
            Find mechanics, diesel specialists, and tyre shops near you.
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
              placeholder="Search location (e.g. Tamworth, Broome)"
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
          {/* Berrima Diesel Feature Card */}
          <div className="bg-brand-navy rounded-xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-brand-yellow rounded-lg flex items-center justify-center flex-shrink-0 shadow">
                <Wrench size={28} className="text-brand-navy" />
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold mb-1">Berrima Diesel Service</h3>
                <p className="text-brand-yellow font-semibold text-sm mb-2">
                  Australia's Premier 4WD Diesel Turbo Centre — Est. 1956
                </p>
                <p className="text-white/80 text-sm mb-3">
                  3483 Old Hume Hwy, Berrima NSW 2577. Diesel fuel injection, turbocharger, and 4WD specialists.
                  Three generations of the Leimroth family.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="tel:0248771256"
                    className="inline-flex items-center gap-1 bg-brand-yellow text-brand-navy px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-gold transition-colors"
                  >
                    <Phone size={14} />
                    (02) 4877 1256
                  </a>
                  <a
                    href="https://berrimadiesel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-white/20 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-white/30 transition-colors"
                  >
                    <ExternalLink size={14} />
                    Website
                  </a>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingSpinner message="Searching for workshops..." />
          ) : error ? (
            <ErrorDisplay
              title="Unable to find workshops"
              message="Could not search OpenStreetMap. Please try again."
              onRetry={refetch}
            />
          ) : (
            <>
              <p className="text-sm text-brand-gray mb-4">
                {(workshops || []).length} workshop{(workshops || []).length !== 1 ? 's' : ''} found within {radius}km
              </p>

              <div className="space-y-3">
                {(workshops || []).map((ws) => (
                  <div
                    key={ws.id}
                    className="bg-white rounded-xl shadow border border-brand-tan/50 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Wrench size={16} className="text-brand-ochre" />
                          <h3 className="font-headline text-lg font-bold text-brand-brown">{ws.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-brand-gray mb-2">
                          <MapPin size={12} />
                          <span>{ws.distance} km away</span>
                          <span className="px-2 py-0.5 bg-brand-cream rounded text-xs">
                            {ws.type === 'tyre_shop' ? 'Tyre Shop' : 'Mechanic'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ws.diesel && (
                            <span className="text-xs bg-brand-yellow/30 text-brand-brown px-2 py-1 rounded font-medium">Diesel Specialist</span>
                          )}
                          {ws.fourwd && (
                            <span className="text-xs bg-brand-eucalyptus/20 text-brand-eucalyptus px-2 py-1 rounded font-medium">4WD Specialist</span>
                          )}
                        </div>
                        {ws.opening_hours && (
                          <p className="text-xs text-brand-gray/60 mt-2">Hours: {ws.opening_hours}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {ws.phone && (
                          <a href={`tel:${ws.phone}`} className="flex-shrink-0 p-2 text-brand-gray hover:text-brand-ochre">
                            <Phone size={16} />
                          </a>
                        )}
                        {ws.website && (
                          <a
                            href={ws.website}
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

                {(workshops || []).length === 0 && (
                  <div className="text-center py-12">
                    <Wrench size={48} className="text-brand-tan mx-auto mb-3" />
                    <p className="text-brand-gray">No workshops found in this area.</p>
                    <p className="text-sm text-brand-gray/60">Try increasing the search radius.</p>
                  </div>
                )}
              </div>
            </>
          )}

          <p className="text-xs text-brand-gray/70 text-center mt-8">
            Data from OpenStreetMap contributors. Not all workshops may be listed.
          </p>
        </div>
      </div>
    </div>
  )
}

export default WorkshopFinder
