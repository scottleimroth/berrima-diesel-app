import { useState } from 'react'
import { MapPin, Navigation, List, Map as MapIcon } from 'lucide-react'
import { useFuelPrices, useFuelTypes } from '../hooks/useFuelPrices'
import { useGeolocation } from '../hooks/useGeolocation'
import { useBookmarks } from '../hooks/useBookmarks'
import { usePriceAlerts } from '../hooks/usePriceAlerts'
import { STATE_CONFIG } from '../services/nationalFuelApi'
import FuelSearch from '../components/fuel-tracker/FuelSearch'
import StationList from '../components/fuel-tracker/StationList'
import FilterBar from '../components/fuel-tracker/FilterBar'
import PriceAlertBar from '../components/fuel-tracker/PriceAlertBar'
import PriceMap from '../components/fuel-tracker/PriceMap'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'

function FuelTracker() {
  const [viewMode, setViewMode] = useState('list') // 'list' or 'map'
  const [sortBy, setSortBy] = useState('price')
  const [fuelType, setFuelType] = useState('DL')
  const [radius, setRadius] = useState(50)
  const [state, setState] = useState('ALL')

  const {
    location,
    loading: locationLoading,
    error: locationError,
    source: locationSource,
    getCurrentPosition,
    setManualLocation,
  } = useGeolocation()

  const {
    data: stations,
    isLoading: stationsLoading,
    error: stationsError,
    refetch,
  } = useFuelPrices(location, fuelType, sortBy, state)

  const { data: fuelTypes } = useFuelTypes()
  const bookmarks = useBookmarks()
  const priceAlerts = usePriceAlerts()

  // Filter stations by radius
  const filteredStations = stations
    ? stations.filter((station) => station.distance <= radius)
    : []

  // Re-sort if needed (API returns sorted by price or distance)
  const sortedStations = [...filteredStations].sort((a, b) => {
    if (sortBy === 'price') {
      return a.price - b.price
    }
    return a.distance - b.distance
  })

  // Count stations per state for the info bar
  const stateBreakdown = sortedStations.reduce((acc, s) => {
    const st = s.state || 'Unknown'
    acc[st] = (acc[st] || 0) + 1
    return acc
  }, {})

  const handleLocationSearch = (coords) => {
    setManualLocation(coords.lat, coords.lng)
  }

  // Get description of current data source
  const getSourceDescription = () => {
    if (state === 'ALL') return 'Prices from NSW FuelCheck, WA FuelWatch, and QLD Open Data.'
    const config = STATE_CONFIG[state]
    return config?.description || ''
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Page Header */}
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Diesel Price Finder
          </h1>
          <p className="text-brand-gray">
            Find the cheapest diesel across Australia. {getSourceDescription()}
          </p>
        </div>
      </div>

      {/* Search & Controls */}
      <div className="bg-white border-b border-brand-tan/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <FuelSearch
            onLocationSelect={handleLocationSearch}
            onUseMyLocation={getCurrentPosition}
            locationLoading={locationLoading}
            currentSource={locationSource}
          />

          {locationError && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {locationError}
            </div>
          )}

          <FilterBar
            sortBy={sortBy}
            onSortChange={setSortBy}
            fuelType={fuelType}
            onFuelTypeChange={setFuelType}
            fuelTypes={fuelTypes}
            radius={radius}
            onRadiusChange={setRadius}
            state={state}
            onStateChange={setState}
          />
        </div>
      </div>

      {/* Price Alerts & View Toggle */}
      <div className="container mx-auto px-4 py-4">
        {/* Price Alert Bar */}
        <PriceAlertBar
          alerts={priceAlerts.alerts}
          onToggle={() => priceAlerts.setEnabled(!priceAlerts.alerts.enabled)}
          onPriceChange={priceAlerts.setTargetPrice}
          alertCount={priceAlerts.getAlertCount(sortedStations)}
        />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm text-brand-gray">
              {sortedStations.length} stations within {radius}km
            </span>
            {/* State breakdown badges */}
            {state === 'ALL' && Object.keys(stateBreakdown).length > 1 && (
              <div className="flex items-center gap-1">
                {Object.entries(stateBreakdown).map(([st, count]) => (
                  <span
                    key={st}
                    className="inline-flex items-center text-xs bg-brand-tan/40 text-brand-brown px-2 py-0.5 rounded"
                  >
                    {st}: {count}
                  </span>
                ))}
              </div>
            )}
            {locationSource === 'gps' && (
              <span className="inline-flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded">
                <Navigation size={12} />
                Using your location
              </span>
            )}
            {locationSource === 'default' && (
              <span className="inline-flex items-center gap-1 text-xs text-brand-brown bg-brand-tan/30 px-2 py-1 rounded">
                <MapPin size={12} />
                Berrima area
              </span>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-brand-tan/30 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-brand-brown shadow-sm'
                  : 'text-brand-gray hover:text-brand-brown'
              }`}
            >
              <List size={16} />
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-white text-brand-brown shadow-sm'
                  : 'text-brand-gray hover:text-brand-brown'
              }`}
            >
              <MapIcon size={16} />
              Map
            </button>
          </div>
        </div>

        {/* Content Area */}
        {stationsLoading ? (
          <LoadingSpinner message="Finding diesel prices..." />
        ) : stationsError ? (
          <ErrorDisplay
            title="Unable to load prices"
            message="There was an error fetching fuel prices. Please try again."
            onRetry={refetch}
          />
        ) : viewMode === 'list' ? (
          <StationList
            stations={sortedStations}
            bookmarks={bookmarks}
            userLocation={location}
            priceAlerts={priceAlerts.alerts}
          />
        ) : (
          <div className="h-[500px] md:h-[600px] rounded-xl overflow-hidden shadow-lg border border-brand-tan/50">
            <PriceMap
              stations={sortedStations}
              center={location}
              bookmarks={bookmarks}
              priceAlerts={priceAlerts.alerts}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default FuelTracker
