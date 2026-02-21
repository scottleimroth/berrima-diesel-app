import { Routes, Route } from 'react-router-dom'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import FuelTracker from './pages/FuelTracker'
import RoutePlanner from './pages/RoutePlanner'
import Weather from './pages/Weather'
import Bushfires from './pages/Bushfires'
import Campgrounds from './pages/Campgrounds'
import RestAreas from './pages/RestAreas'
import TyrePressure from './pages/TyrePressure'
import WeightCalculator from './pages/WeightCalculator'
import Checklists from './pages/Checklists'
import DumpPoints from './pages/DumpPoints'
import FuelEconomy from './pages/FuelEconomy'
import SolarEstimator from './pages/SolarEstimator'
import TowingSpeedLimits from './pages/TowingSpeedLimits'
import ServiceTracker from './pages/ServiceTracker'
import WaterPoints from './pages/WaterPoints'
import GasRefills from './pages/GasRefills'
import WifiHotspots from './pages/WifiHotspots'
import Laundromats from './pages/Laundromats'
import FloodWarnings from './pages/FloodWarnings'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Header />
      <main className="flex-1">
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
          <Route path="/flood-warnings" element={<FloodWarnings />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
