import { Routes, Route, useLocation } from 'react-router-dom'
import { Suspense, lazy, Component, useState, useEffect } from 'react'
import Header from './components/common/Header'
import Footer from './components/common/Footer'

const Home = lazy(() => import('./pages/Home'))
const FuelTracker = lazy(() => import('./pages/FuelTracker'))
const RoutePlanner = lazy(() => import('./pages/RoutePlanner'))
const Weather = lazy(() => import('./pages/Weather'))
const Bushfires = lazy(() => import('./pages/Bushfires'))
const Campgrounds = lazy(() => import('./pages/Campgrounds'))
const RestAreas = lazy(() => import('./pages/RestAreas'))
const TyrePressure = lazy(() => import('./pages/TyrePressure'))
const WeightCalculator = lazy(() => import('./pages/WeightCalculator'))
const Checklists = lazy(() => import('./pages/Checklists'))
const DumpPoints = lazy(() => import('./pages/DumpPoints'))
const FuelEconomy = lazy(() => import('./pages/FuelEconomy'))
const SolarEstimator = lazy(() => import('./pages/SolarEstimator'))
const TowingSpeedLimits = lazy(() => import('./pages/TowingSpeedLimits'))
const ServiceTracker = lazy(() => import('./pages/ServiceTracker'))
const WaterPoints = lazy(() => import('./pages/WaterPoints'))
const GasRefills = lazy(() => import('./pages/GasRefills'))
const WifiHotspots = lazy(() => import('./pages/WifiHotspots'))
const Laundromats = lazy(() => import('./pages/Laundromats'))
const PayphonesPostboxes = lazy(() => import('./pages/PayphonesPostboxes'))
const FloodWarnings = lazy(() => import('./pages/FloodWarnings'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const NotFound = lazy(() => import('./pages/NotFound'))

const pageTitles = {
  '/': 'Home',
  '/fuel': 'Diesel Prices',
  '/route': 'Trip Planner',
  '/weather': 'Weather Forecast',
  '/bushfires': 'Bushfire Info',
  '/campgrounds': 'Campgrounds',
  '/rest-areas': 'Rest Areas',
  '/tyre-pressure': 'Tyre Pressure',
  '/weight-calculator': 'Weight Calculator',
  '/checklists': 'Checklists',
  '/dump-points': 'Dump Points',
  '/fuel-economy': 'Fuel Economy',
  '/solar-estimator': 'Solar Estimator',
  '/towing-speed-limits': 'Speed Limits',
  '/service-tracker': 'Service Tracker',
  '/water-points': 'Water Points',
  '/gas-refills': 'Gas Refills',
  '/wifi': 'WiFi Hotspots',
  '/laundromats': 'Laundromats',
  '/payphones-postboxes': 'Payphones & Postboxes',
  '/flood-warnings': 'Flood Warnings',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Use',
}

function usePageTitle() {
  const location = useLocation()
  useEffect(() => {
    const title = pageTitles[location.pathname] || 'Page Not Found'
    document.title = `${title} \u2014 Berrima Diesel Touring Tools`
  }, [location.pathname])
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-light px-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-brand-navy mb-4">Something went wrong</h1>
            <p className="text-brand-brown mb-6">We apologise for the inconvenience. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-navy text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-brown transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function SwUpdateBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const handleUpdate = () => setShowBanner(true)
    window.addEventListener('sw-update-available', handleUpdate)
    return () => window.removeEventListener('sw-update-available', handleUpdate)
  }, [])

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-navy text-white px-4 py-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <p className="text-sm font-medium">A new version is available.</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="bg-brand-yellow text-brand-navy text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-brand-gold transition-colors"
          >
            Update Now
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="text-white/70 hover:text-white text-sm px-2 py-1"
            aria-label="Dismiss update"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  usePageTitle()

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-brand-light">
        <Header />
        <main className="flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fuel" element={<FuelTracker />} />
              <Route path="/route" element={<RoutePlanner />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/bushfires" element={<Bushfires />} />
              <Route path="/campgrounds" element={<Campgrounds />} />
              <Route path="/rest-areas" element={<RestAreas />} />
              <Route path="/tyre-pressure" element={<TyrePressure />} />
              <Route path="/weight-calculator" element={<WeightCalculator />} />
              <Route path="/checklists" element={<Checklists />} />
              <Route path="/dump-points" element={<DumpPoints />} />
              <Route path="/fuel-economy" element={<FuelEconomy />} />
              <Route path="/solar-estimator" element={<SolarEstimator />} />
              <Route path="/towing-speed-limits" element={<TowingSpeedLimits />} />
              <Route path="/service-tracker" element={<ServiceTracker />} />
              <Route path="/water-points" element={<WaterPoints />} />
              <Route path="/gas-refills" element={<GasRefills />} />
              <Route path="/wifi" element={<WifiHotspots />} />
              <Route path="/laundromats" element={<Laundromats />} />
              <Route path="/payphones-postboxes" element={<PayphonesPostboxes />} />
              <Route path="/flood-warnings" element={<FloodWarnings />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <SwUpdateBanner />
      </div>
    </ErrorBoundary>
  )
}

export default App
