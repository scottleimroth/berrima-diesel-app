import { Routes, Route } from 'react-router-dom'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import FuelTracker from './pages/FuelTracker'
import RoutePlanner from './pages/RoutePlanner'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fuel" element={<FuelTracker />} />
          <Route path="/route" element={<RoutePlanner />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
