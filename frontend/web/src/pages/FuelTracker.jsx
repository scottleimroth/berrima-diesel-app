import { useState } from 'react'
import { MapPin, Navigation, List, Map as MapIcon, EyeOff, Eye } from 'lucide-react'
import { useFuelPrices, useFuelTypes } from '../hooks/useFuelPrices'
import { useGeolocation } from '../hooks/useGeolocation'
import { useBookmarks } from '../hooks/useBookmarks'
import { usePriceAlerts } from '../hooks/usePriceAlerts'
import { useOutageData } from '../hooks/useOutageData'
import { STATE_CONFIG } from '../services/nationalFuelApi'
import { getStaleStatus, staleComparator } from '../utils/staleDetection'
import FuelSearch from '../components/fuel-tracker/FuelSearch'
import StationList from '../components/fuel-tracker/StationList'
import FilterBar from '../components/fuel-tracker/FilterBar'
import PriceAlertBar from '../components/fuel-tracker/PriceAlertBar'
import PriceMap from '../components/fuel-tracker/PriceMap'
import OutageSummary from '../components/fuel-tracker/OutageSummary'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'

function FuelTracker() {
  const [viewMode, setViewMode] = useState('list') // 'list' or 'map'
  const [sortBy, setSortBy] = useState('price')
  const [fuelType, setFuelType] = useState('DL')
  const [radius, setRadius] = useState(50)
  const [state, setState] = useState('ALL')
  const [hideUnavailable, setHideUnavailable] = useState(false)

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
  const outageData = useOutageData()

  // Filter stations by radius
  let filteredStations = stations
    ? stations.filter((station) => station.distance <= radius)
    : []

  // Optionally hide stations with outage reports or stale data
  if (hideUnavailable) {
    filteredStations = filteredStations.filter((station) => {
      const hasOutage = !!outageData.outages[station.code]
      const stale = getStaleStatus(station)
      return !hasOutage && stale.status === 'fresh'
    })
  }

  // Sort: primary sort by user preference, secondary sort pushes stale/outage stations lower
  const sortedStations = [...filteredStations].sort((a, b) => {
    // First: push stations with outage reports to bottom
    const aOutage = outageData.outages[a.code] ? 1 : 0
    const bOutage = outageData.outages[b.code] ? 1 : 0
    if (aOutage !== bOutage) return aOutage - bOutage

    // Second: push stale stations lower
    const staleSort = staleComparator(a, b)
    if (staleSort !== 0) return staleSort

    // Then sort by user preference
    if (sortBy === 'price') return a.price - b.price
    return a.distance - b.distance
  })

  // Count outages in current results
  const outageCount = sortedStations.filter(
    (s) => !!outageData.outages[s.code]
  ).length

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
    if (state === 'ALL') return 'Prices from NSW FuelCheck, WA FuelWatch, QLD Open Data, and TAS FuelCheck.'
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
        {/* Outage Summary */}
        {outageData.hasData && (
          <OutageSummary
            summary={outageData.summary}
            minutesAgo={outageData.minutesAgo}
            isStale={outageData.isStale}
            stationCount={outageCount}
          />
        )}

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

          <div className="flex items-center gap-2">
            {/* Hide unavailable toggle */}
            <button
              onClick={() => setHideUnavailable(!hideUnavailable)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                hideUnavailable
                  ? 'bg-red-100 text-red-700'
                  : 'bg-brand-tan/30 text-brand-gray hover:text-brand-brown'
              }`}
              title={hideUnavailable ? 'Show all stations' : 'Hide possibly unavailable stations'}
            >
              {hideUnavailable ? <EyeOff size={14} /> : <Eye size={14} />}
              {hideUnavailable ? 'Showing available only' : 'Show all'}
            </button>

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
            outages={outageData}
          />
        ) : (
          <div className="h-[500px] md:h-[600px] rounded-xl overflow-hidden shadow-lg border border-brand-tan/50">
            <PriceMap
              stations={sortedStations}
              center={location}
              bookmarks={bookmarks}
              priceAlerts={priceAlerts.alerts}
              outages={outageData}
            />
          </div>
        )}

        {/* Data Attribution Footer */}
        <div className="mt-8 pt-4 border-t border-brand-tan/30 text-xs text-brand-gray/70 text-center">
          <p>
            NSW/ACT data: © State of NSW (FuelCheck). QLD data: © State of Queensland. WA data: © FuelWatch WA.{' '}
            TAS data: © State of Tasmania. VIC data: © State of Victoria accessed via Victorian Government Service Victoria Platform.
          </p>
          <p className="mt-1">
            All fuel prices are provided by state government sources and displayed under their respective open data licenses.
            Prices may not reflect real-time changes — verify at the station before filling up.
          </p>
          {outageData.hasData && (
            <p className="mt-1">
              Fuel availability reports sourced from community data.
              {outageData.minutesAgo !== null && (
                <span> Updated {outageData.minutesAgo < 60
                  ? `${outageData.minutesAgo} minutes`
                  : `${Math.floor(outageData.minutesAgo / 60)}h`} ago.</span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FuelTracker
