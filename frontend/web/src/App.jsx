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
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
