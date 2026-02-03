import { useState } from 'react'
import { Caravan, Compass, AlertTriangle, Heart, Save } from 'lucide-react'
import VehicleForm from '../components/route-planner/VehicleForm'
import RouteForm from '../components/route-planner/RouteForm'
import RouteMap from '../components/route-planner/RouteMap'
import DirectionsList from '../components/route-planner/DirectionsList'
import FuelStopsPanel from '../components/route-planner/FuelStopsPanel'
import SavedRoutesPanel from '../components/route-planner/SavedRoutesPanel'
import FuelCalculator from '../components/route-planner/FuelCalculator'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useVehicleProfile } from '../hooks/useVehicleProfile'
import { useSavedRoutes } from '../hooks/useSavedRoutes'
import { useFuelCalculator } from '../hooks/useFuelCalculator'
import { calculateTruckRoute } from '../services/hereRoutingApi'
import { getFuelPricesNearby } from '../services/nswFuelApi'
import { formatDuration, formatDistance } from '../utils/formatters'

function RoutePlanner() {
  const [activeTab, setActiveTab] = useState('vehicle') // 'vehicle', 'route'
  const [routeData, setRouteData] = useState(null)
  const [fuelStops, setFuelStops] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [origin, setOrigin] = useState(null)
  const [destination, setDestination] = useState(null)
  const [currentRouteParams, setCurrentRouteParams] = useState(null)
  const [routeSaved, setRouteSaved] = useState(false)

  const vehicleProfile = useVehicleProfile()
  const savedRoutes = useSavedRoutes()
  const fuelCalculator = useFuelCalculator()

  const handleCalculateRoute = async (routeParams) => {
    setLoading(true)
    setError(null)
    setRouteSaved(false)
    setOrigin(routeParams.origin)
    setDestination(routeParams.destination)
    setCurrentRouteParams(routeParams)

    try {
      // Calculate route for the vehicle
      const route = await calculateTruckRoute({
        origin: routeParams.origin.position,
        destination: routeParams.destination.position,
        vehicle: {
          grossWeight: vehicleProfile.currentProfile.grossWeight,
          height: vehicleProfile.currentProfile.height,
          width: vehicleProfile.currentProfile.width,
          length: vehicleProfile.currentProfile.length,
          axleCount: vehicleProfile.currentProfile.axleCount,
          type: vehicleProfile.currentProfile.type,
          trailersCount: vehicleProfile.currentProfile.trailersCount,
        },
        via: routeParams.waypoints || [],
        avoid: routeParams.avoid || {},
      })

      setRouteData(route)

      // Get fuel stops along the route
      const midLat =
        (routeParams.origin.position.lat + routeParams.destination.position.lat) / 2
      const midLng =
        (routeParams.origin.position.lng + routeParams.destination.position.lng) / 2

      const fuelData = await getFuelPricesNearby(midLat, midLng, 'DL', 'price')
      setFuelStops(fuelData.slice(0, 5)) // Top 5 cheapest stations
    } catch (err) {
      console.error('Route calculation error:', err)
      setError('Unable to calculate route. Please try again.')
    }

    setLoading(false)
  }

  const handleSaveRoute = () => {
    if (currentRouteParams) {
      savedRoutes.saveRoute(currentRouteParams)
      setRouteSaved(true)
    }
  }

  const handleLoadSavedRoute = (route) => {
    // Load the saved route into the form and calculate
    handleCalculateRoute({
      origin: route.origin,
      destination: route.destination,
      waypoints: route.waypoints,
      avoid: route.avoid,
    })
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Page Header */}
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Caravan & Touring Route Planner
          </h1>
          <p className="text-brand-gray">
            Plan your trip with your rig dimensions in mind. Find low bridges, check clearances, and discover diesel stops along the way.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Forms */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-brand-tan/50">
              <div className="flex border-b border-brand-tan/50">
                <button
                  onClick={() => setActiveTab('vehicle')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === 'vehicle'
                      ? 'bg-brand-yellow text-brand-brown'
                      : 'text-brand-gray hover:bg-brand-cream'
                  }`}
                >
                  <Caravan size={18} />
                  My Rig
                </button>
                <button
                  onClick={() => setActiveTab('route')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === 'route'
                      ? 'bg-brand-eucalyptus text-white'
                      : 'text-brand-gray hover:bg-brand-cream'
                  }`}
                >
                  <Compass size={18} />
                  Route
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {activeTab === 'vehicle' ? (
                  <VehicleForm
                    profile={vehicleProfile.currentProfile}
                    presets={vehicleProfile.presets}
                    savedProfiles={vehicleProfile.savedProfiles}
                    onUpdateProfile={vehicleProfile.updateProfile}
                    onLoadPreset={vehicleProfile.loadPreset}
                    onSaveProfile={vehicleProfile.saveProfile}
                    onLoadSavedProfile={vehicleProfile.loadSavedProfile}
                    onDeleteProfile={vehicleProfile.deleteSavedProfile}
                  />
                ) : (
                  <RouteForm onCalculateRoute={handleCalculateRoute} loading={loading} />
                )}
              </div>
            </div>

            {/* Fuel Stops Panel */}
            {fuelStops.length > 0 && (
              <FuelStopsPanel stops={fuelStops} />
            )}

            {/* Saved Routes Panel */}
            {savedRoutes.hasSavedRoutes && (
              <SavedRoutesPanel
                savedRoutes={savedRoutes.savedRoutes}
                onLoadRoute={handleLoadSavedRoute}
                onDeleteRoute={savedRoutes.deleteRoute}
                onRenameRoute={savedRoutes.renameRoute}
              />
            )}
          </div>

          {/* Right Panel - Map & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-brand-tan/50">
              <div className="h-[400px] lg:h-[500px]">
                {loading ? (
                  <div className="h-full flex items-center justify-center bg-brand-cream">
                    <LoadingSpinner message="Planning your route..." />
                  </div>
                ) : (
                  <RouteMap
                    routeData={routeData}
                    origin={origin}
                    destination={destination}
                    fuelStops={fuelStops}
                  />
                )}
              </div>
            </div>

            {/* Route Summary */}
            {routeData && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-tan/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline text-xl font-bold text-brand-brown">Trip Summary</h3>
                  <button
                    onClick={handleSaveRoute}
                    disabled={routeSaved}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      routeSaved
                        ? 'bg-success/10 text-success cursor-default'
                        : 'bg-brand-eucalyptus hover:bg-brand-brown text-white'
                    }`}
                  >
                    {routeSaved ? (
                      <>
                        <Heart size={16} fill="currentColor" />
                        Route Saved
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Route
                      </>
                    )}
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-brand-tan/20 border border-brand-tan/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-brand-brown">
                      {formatDistance(routeData.summary.distance / 1000)}
                    </div>
                    <div className="text-sm text-brand-gray">Total Distance</div>
                  </div>
                  <div className="bg-brand-tan/20 border border-brand-tan/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-brand-brown">
                      {formatDuration(routeData.summary.duration)}
                    </div>
                    <div className="text-sm text-brand-gray">Est. Duration</div>
                  </div>
                  <div className="bg-brand-eucalyptus/10 border border-brand-eucalyptus/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-brand-eucalyptus">
                      {fuelStops.length}
                    </div>
                    <div className="text-sm text-brand-gray">Fuel Stops</div>
                  </div>
                  <div className="bg-success/10 border border-success/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-success">
                      {fuelStops[0]?.price?.toFixed(1) || '-'}
                    </div>
                    <div className="text-sm text-brand-gray">Cheapest (c/L)</div>
                  </div>
                </div>

                {/* Fuel Calculator */}
                {fuelStops.length > 0 && (
                  <div className="mb-6">
                    <FuelCalculator
                      distanceKm={routeData.summary.distance / 1000}
                      cheapestPrice={fuelStops[0]?.price || 180}
                      fuelCalculator={fuelCalculator}
                    />
                  </div>
                )}

                {/* Warnings */}
                {routeData.warnings && routeData.warnings.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-brand-brown mb-2 flex items-center gap-2">
                      <AlertTriangle size={18} className="text-warning" />
                      Route Warnings
                    </h4>
                    <ul className="space-y-2">
                      {routeData.warnings.map((warning, index) => (
                        <li
                          key={index}
                          className="text-sm text-brand-gray bg-warning/10 border border-warning/30 px-3 py-2 rounded"
                        >
                          {warning.title || warning.code || 'Route restriction'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Directions */}
                <DirectionsList instructions={routeData.instructions} />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!routeData && !loading && !error && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-brand-tan/50">
                <div className="w-20 h-20 bg-brand-ochre/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-brand-ochre" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="6" width="14" height="10" rx="2"/>
                    <path d="M16 10h4l2 2v4a2 2 0 01-2 2h-4"/>
                    <circle cx="6" cy="18" r="2"/>
                    <circle cx="18" cy="18" r="2"/>
                    <path d="M8 18h8"/>
                  </svg>
                </div>
                <h3 className="font-headline text-xl font-bold text-brand-brown mb-2">
                  Plan Your Adventure
                </h3>
                <p className="text-brand-gray mb-4">
                  Set up your rig dimensions first, then enter your route to find the best path for your caravan, motorhome, or 4WD.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setActiveTab('vehicle')}
                    className="px-4 py-2 bg-brand-yellow text-brand-brown rounded-lg text-sm font-medium hover:bg-brand-gold transition-colors"
                  >
                    Set Up My Rig
                  </button>
                  <button
                    onClick={() => setActiveTab('route')}
                    className="px-4 py-2 bg-brand-eucalyptus text-white rounded-lg text-sm font-medium hover:bg-brand-brown transition-colors"
                  >
                    Enter Route
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoutePlanner
