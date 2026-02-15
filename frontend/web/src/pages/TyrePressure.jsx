import { useState } from 'react'
import { Gauge, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'

const TERRAIN_MODES = [
  { id: 'highway', label: 'Highway', description: 'Sealed roads, normal driving', icon: '🛣️', factor: 1.0 },
  { id: 'gravel', label: 'Gravel / Dirt', description: 'Unsealed roads, corrugations', icon: '🪨', factor: 0.85 },
  { id: 'sand', label: 'Sand', description: 'Beach, desert, soft sand', icon: '🏖️', factor: 0.55 },
  { id: 'mud', label: 'Mud', description: 'Wet tracks, boggy conditions', icon: '💧', factor: 0.7 },
  { id: 'rock', label: 'Rocky Terrain', description: 'Rock crawling, slow speed', icon: '⛰️', factor: 0.75 },
]

const TYRE_PRESETS = [
  { name: 'BFGoodrich KO2 265/70R17', basePsi: 36, loadRange: 'E', maxPsi: 80 },
  { name: 'BFGoodrich KO2 285/75R16', basePsi: 35, loadRange: 'E', maxPsi: 80 },
  { name: 'Cooper AT3 LT 265/70R17', basePsi: 36, loadRange: 'E', maxPsi: 80 },
  { name: 'Cooper AT3 LT 285/75R16', basePsi: 35, loadRange: 'E', maxPsi: 80 },
  { name: 'Toyo Open Country AT3 265/70R17', basePsi: 36, loadRange: 'E', maxPsi: 80 },
  { name: 'Mickey Thompson Baja Boss AT 265/70R17', basePsi: 36, loadRange: 'E', maxPsi: 80 },
  { name: 'Falken Wildpeak AT3W 265/65R17', basePsi: 35, loadRange: 'SL', maxPsi: 44 },
  { name: 'Nitto Ridge Grappler 285/70R17', basePsi: 35, loadRange: 'E', maxPsi: 80 },
  { name: 'General Grabber AT3 265/70R17', basePsi: 36, loadRange: 'SL', maxPsi: 44 },
  { name: 'Custom / Other', basePsi: 36, loadRange: 'SL', maxPsi: 65 },
]

const VEHICLE_PRESETS = [
  { name: '4WD Wagon (solo)', loadKg: 2200, towing: false },
  { name: '4WD + Roof Top Tent', loadKg: 2500, towing: false },
  { name: '4WD + Caravan (light)', loadKg: 2400, towing: true },
  { name: '4WD + Caravan (heavy)', loadKg: 2800, towing: true },
  { name: 'Dual Cab Ute (loaded)', loadKg: 2600, towing: false },
  { name: 'Dual Cab Ute + Trailer', loadKg: 2500, towing: true },
]

function TyrePressure() {
  const [selectedTyre, setSelectedTyre] = useState(TYRE_PRESETS[0])
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_PRESETS[0])
  const [terrain, setTerrain] = useState('highway')
  const [customBasePsi, setCustomBasePsi] = useState(36)
  const [temperatureC, setTemperatureC] = useState(25)
  const [altitudeM, setAltitudeM] = useState(0)
  const [showGuide, setShowGuide] = useState(false)

  const isCustomTyre = selectedTyre.name === 'Custom / Other'
  const basePsi = isCustomTyre ? customBasePsi : selectedTyre.basePsi

  // Calculate adjusted pressure
  const terrainMode = TERRAIN_MODES.find((t) => t.id === terrain)
  const terrainFactor = terrainMode?.factor || 1.0

  // Temperature adjustment: ~1 PSI per 5.5°C change from 25°C baseline
  const tempAdjustment = (temperatureC - 25) / 5.5

  // Altitude adjustment: ~0.5 PSI per 300m elevation (lower atmospheric pressure)
  const altitudeAdjustment = -(altitudeM / 300) * 0.5

  // Load adjustment: heavier vehicles need higher base pressure
  const loadFactor = selectedVehicle.towing ? 1.05 : 1.0

  // Calculate front and rear differently when towing
  const frontPsi = Math.round((basePsi * terrainFactor + tempAdjustment + altitudeAdjustment) * loadFactor)
  const rearPsi = Math.round(
    (basePsi * terrainFactor + tempAdjustment + altitudeAdjustment) *
      (selectedVehicle.towing ? loadFactor + 0.08 : loadFactor)
  )

  // Clamp values
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val))
  const finalFront = clamp(frontPsi, 15, selectedTyre.maxPsi)
  const finalRear = clamp(rearPsi, 15, selectedTyre.maxPsi)

  const getPressureColor = (psi) => {
    if (psi < 20) return 'text-red-600'
    if (psi < 28) return 'text-brand-ochre'
    return 'text-brand-eucalyptus'
  }

  const handleReset = () => {
    setSelectedTyre(TYRE_PRESETS[0])
    setSelectedVehicle(VEHICLE_PRESETS[0])
    setTerrain('highway')
    setCustomBasePsi(36)
    setTemperatureC(25)
    setAltitudeM(0)
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Page Header */}
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Tyre Pressure Calculator
          </h1>
          <p className="text-brand-gray">
            Recommended pressures adjusted for terrain, temperature, altitude, and load.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Result Display */}
          <div className="bg-white rounded-xl shadow-lg border border-brand-tan/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline text-xl font-bold text-brand-brown">
                Recommended Pressure
              </h2>
              <span className="text-xs bg-brand-tan/30 text-brand-gray px-2 py-1 rounded">
                {terrainMode?.label} mode
              </span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-sm text-brand-gray mb-1">Front</p>
                <p className={`font-headline text-5xl font-bold ${getPressureColor(finalFront)}`}>
                  {finalFront}
                </p>
                <p className="text-sm text-brand-gray">PSI</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-brand-gray mb-1">Rear</p>
                <p className={`font-headline text-5xl font-bold ${getPressureColor(finalRear)}`}>
                  {finalRear}
                </p>
                <p className="text-sm text-brand-gray">PSI</p>
              </div>
            </div>
            {selectedVehicle.towing && (
              <p className="text-xs text-brand-ochre text-center mt-3">
                Rear pressure increased for towing load
              </p>
            )}
          </div>

          {/* Tyre Selection */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6">
            <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Tyre</h3>
            <select
              value={selectedTyre.name}
              onChange={(e) => {
                const tyre = TYRE_PRESETS.find((t) => t.name === e.target.value)
                setSelectedTyre(tyre)
              }}
              className="w-full border border-brand-tan rounded-lg px-3 py-2.5 text-brand-brown bg-brand-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            >
              {TYRE_PRESETS.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name} ({t.basePsi} PSI base)
                </option>
              ))}
            </select>
            {isCustomTyre && (
              <div className="mt-3">
                <label className="text-sm text-brand-gray">Base pressure (PSI)</label>
                <input
                  type="range"
                  min="20"
                  max="65"
                  value={customBasePsi}
                  onChange={(e) => setCustomBasePsi(parseInt(e.target.value))}
                  className="w-full mt-1 accent-brand-ochre"
                />
                <div className="flex justify-between text-xs text-brand-gray">
                  <span>20</span>
                  <span className="font-bold text-brand-brown">{customBasePsi} PSI</span>
                  <span>65</span>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle / Load */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6">
            <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Vehicle Setup</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {VEHICLE_PRESETS.map((v) => (
                <button
                  key={v.name}
                  onClick={() => setSelectedVehicle(v)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    selectedVehicle.name === v.name
                      ? 'bg-brand-yellow text-brand-navy border-brand-gold'
                      : 'bg-brand-cream/50 text-brand-gray border-brand-tan/50 hover:border-brand-ochre'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          {/* Terrain Selection */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6">
            <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Terrain</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TERRAIN_MODES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTerrain(t.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg text-sm font-medium transition-colors border ${
                    terrain === t.id
                      ? 'bg-brand-yellow text-brand-navy border-brand-gold'
                      : 'bg-brand-cream/50 text-brand-gray border-brand-tan/50 hover:border-brand-ochre'
                  }`}
                >
                  <span className="text-lg">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-brand-gray mt-2">{terrainMode?.description}</p>
          </div>

          {/* Temperature & Altitude */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6">
            <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Conditions</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-brand-gray">Temperature</label>
                <input
                  type="range"
                  min="-5"
                  max="50"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(parseInt(e.target.value))}
                  className="w-full mt-1 accent-brand-ochre"
                />
                <div className="flex justify-between text-xs text-brand-gray">
                  <span>-5°C</span>
                  <span className="font-bold text-brand-brown">{temperatureC}°C</span>
                  <span>50°C</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-brand-gray">Altitude</label>
                <input
                  type="range"
                  min="0"
                  max="2500"
                  step="100"
                  value={altitudeM}
                  onChange={(e) => setAltitudeM(parseInt(e.target.value))}
                  className="w-full mt-1 accent-brand-ochre"
                />
                <div className="flex justify-between text-xs text-brand-gray">
                  <span>Sea level</span>
                  <span className="font-bold text-brand-brown">{altitudeM}m</span>
                  <span>2,500m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between p-6"
            >
              <h3 className="font-headline text-lg font-bold text-brand-brown">Quick Pressure Guide</h3>
              {showGuide ? <ChevronUp size={20} className="text-brand-gray" /> : <ChevronDown size={20} className="text-brand-gray" />}
            </button>
            {showGuide && (
              <div className="px-6 pb-6 text-sm text-brand-gray space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-bold text-brand-brown">Highway</p>
                    <p>32-40 PSI. Manufacturer recommended. Best fuel economy and tyre life.</p>
                  </div>
                  <div>
                    <p className="font-bold text-brand-brown">Gravel / Dirt</p>
                    <p>28-34 PSI. Slightly lower for better grip and comfort on corrugations.</p>
                  </div>
                  <div>
                    <p className="font-bold text-brand-brown">Sand</p>
                    <p>16-22 PSI. Much lower to float on soft sand. Air up before returning to road.</p>
                  </div>
                  <div>
                    <p className="font-bold text-brand-brown">Mud</p>
                    <p>22-28 PSI. Lower for wider footprint and better traction.</p>
                  </div>
                  <div>
                    <p className="font-bold text-brand-brown">Rock</p>
                    <p>24-30 PSI. Lower to conform to rocks. Watch for pinch flats.</p>
                  </div>
                  <div>
                    <p className="font-bold text-brand-brown">Towing</p>
                    <p>Add 2-4 PSI to rear tyres when towing. Check tow vehicle placard.</p>
                  </div>
                </div>
                <p className="text-xs text-brand-gray/70 mt-4 border-t border-brand-tan/30 pt-3">
                  Always check your vehicle's tyre placard for manufacturer recommendations.
                  These calculations are a guide only — adjust based on experience and conditions.
                </p>
              </div>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 mx-auto text-sm text-brand-gray hover:text-brand-brown transition-colors"
          >
            <RotateCcw size={14} />
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  )
}

export default TyrePressure
