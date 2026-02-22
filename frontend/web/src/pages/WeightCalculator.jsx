import { useState } from 'react'
import { Scale, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react'

const VEHICLE_PRESETS = [
  { name: 'Toyota LandCruiser 300', tare: 2510, gvm: 3300, gcm: 7000, frontAxle: 55, rearAxle: 45 },
  { name: 'Toyota LandCruiser 200', tare: 2580, gvm: 3350, gcm: 7000, frontAxle: 54, rearAxle: 46 },
  { name: 'Toyota HiLux SR5', tare: 2045, gvm: 3100, gcm: 5950, frontAxle: 53, rearAxle: 47 },
  { name: 'Ford Ranger Wildtrak', tare: 2156, gvm: 3200, gcm: 6000, frontAxle: 55, rearAxle: 45 },
  { name: 'Isuzu D-MAX X-Terrain', tare: 2080, gvm: 3100, gcm: 5950, frontAxle: 54, rearAxle: 46 },
  { name: 'Nissan Patrol Y62', tare: 2760, gvm: 3500, gcm: 7100, frontAxle: 56, rearAxle: 44 },
  { name: 'Toyota Prado 150', tare: 2225, gvm: 2900, gcm: 6100, frontAxle: 55, rearAxle: 45 },
  { name: 'Mitsubishi Pajero Sport', tare: 2075, gvm: 2800, gcm: 5800, frontAxle: 55, rearAxle: 45 },
]

function WeightCalculator() {
  const [vehicle, setVehicle] = useState(VEHICLE_PRESETS[0])
  const [customMode, setCustomMode] = useState(false)

  // Custom vehicle specs
  const [tare, setTare] = useState(VEHICLE_PRESETS[0].tare)
  const [gvm, setGvm] = useState(VEHICLE_PRESETS[0].gvm)
  const [gcm, setGcm] = useState(VEHICLE_PRESETS[0].gcm)

  // Load items
  const [accessories, setAccessories] = useState(0)
  const [cargo, setCargo] = useState(0)
  const [passengers, setPassengers] = useState(160) // 2 adults default
  const [towBallWeight, setTowBallWeight] = useState(0)
  const [trailerAtm, setTrailerAtm] = useState(0)

  const activeTare = customMode ? tare : vehicle.tare
  const activeGvm = customMode ? gvm : vehicle.gvm
  const activeGcm = customMode ? gcm : vehicle.gcm

  const totalVehicleWeight = activeTare + accessories + cargo + passengers + towBallWeight
  const totalCombinedWeight = totalVehicleWeight + trailerAtm
  const gvmRemaining = activeGvm - totalVehicleWeight
  const gcmRemaining = activeGcm - totalCombinedWeight
  const gvmPercent = Math.round((totalVehicleWeight / activeGvm) * 100)
  const gcmPercent = trailerAtm > 0 ? Math.round((totalCombinedWeight / activeGcm) * 100) : 0
  const payload = activeGvm - activeTare

  const gvmStatus = gvmPercent > 100 ? 'over' : gvmPercent > 90 ? 'warning' : 'ok'
  const gcmStatus = gcmPercent > 100 ? 'over' : gcmPercent > 90 ? 'warning' : 'ok'

  const statusColors = {
    over: 'text-red-600 bg-red-50 border-red-200',
    warning: 'text-amber-600 bg-amber-50 border-amber-200',
    ok: 'text-brand-eucalyptus bg-green-50 border-green-200',
  }

  const barColors = {
    over: 'bg-red-500',
    warning: 'bg-amber-500',
    ok: 'bg-brand-eucalyptus',
  }

  const handlePresetSelect = (preset) => {
    setVehicle(preset)
    setCustomMode(false)
    setTare(preset.tare)
    setGvm(preset.gvm)
    setGcm(preset.gcm)
  }

  const handleReset = () => {
    handlePresetSelect(VEHICLE_PRESETS[0])
    setAccessories(0)
    setCargo(0)
    setPassengers(160)
    setTowBallWeight(0)
    setTrailerAtm(0)
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Page Header */}
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Weight Distribution Calculator
          </h1>
          <p className="text-brand-gray">
            Check GVM and GCM compliance for your rig. Stay legal and safe.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* GVM Result */}
          <div className={`rounded-xl shadow-lg border p-6 ${statusColors[gvmStatus]}`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-headline text-xl font-bold">GVM — Gross Vehicle Mass</h2>
              {gvmStatus === 'over' ? (
                <AlertTriangle size={24} />
              ) : (
                <CheckCircle size={24} />
              )}
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="font-headline text-4xl font-bold">{totalVehicleWeight.toLocaleString()}</span>
              <span className="text-lg mb-1">/ {activeGvm.toLocaleString()} kg</span>
            </div>
            <div className="w-full bg-white/60 rounded-full h-4 mb-2">
              <div
                className={`h-4 rounded-full transition-all ${barColors[gvmStatus]}`}
                style={{ width: `${Math.min(gvmPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>{gvmPercent}% of GVM</span>
              <span className="font-bold">
                {gvmRemaining > 0 ? `${gvmRemaining.toLocaleString()} kg remaining` : `${Math.abs(gvmRemaining).toLocaleString()} kg OVER`}
              </span>
            </div>
          </div>

          {/* GCM Result (only if towing) */}
          {trailerAtm > 0 && (
            <div className={`rounded-xl shadow-lg border p-6 ${statusColors[gcmStatus]}`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-headline text-xl font-bold">GCM — Gross Combined Mass</h2>
                {gcmStatus === 'over' ? (
                  <AlertTriangle size={24} />
                ) : (
                  <CheckCircle size={24} />
                )}
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="font-headline text-4xl font-bold">{totalCombinedWeight.toLocaleString()}</span>
                <span className="text-lg mb-1">/ {activeGcm.toLocaleString()} kg</span>
              </div>
              <div className="w-full bg-white/60 rounded-full h-4 mb-2">
                <div
                  className={`h-4 rounded-full transition-all ${barColors[gcmStatus]}`}
                  style={{ width: `${Math.min(gcmPercent, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>{gcmPercent}% of GCM</span>
                <span className="font-bold">
                  {gcmRemaining > 0 ? `${gcmRemaining.toLocaleString()} kg remaining` : `${Math.abs(gcmRemaining).toLocaleString()} kg OVER`}
                </span>
              </div>
            </div>
          )}

          {/* Payload Summary */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6">
            <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Payload Breakdown</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-brand-gray">Max Payload</p>
                <p className="font-headline text-2xl font-bold text-brand-brown">{payload.toLocaleString()}</p>
                <p className="text-xs text-brand-gray">kg</p>
              </div>
              <div>
                <p className="text-sm text-brand-gray">Used</p>
                <p className="font-headline text-2xl font-bold text-brand-ochre">
                  {(accessories + cargo + passengers + towBallWeight).toLocaleString()}
                </p>
                <p className="text-xs text-brand-gray">kg</p>
              </div>
              <div>
                <p className="text-sm text-brand-gray">Available</p>
                <p className={`font-headline text-2xl font-bold ${gvmRemaining < 0 ? 'text-red-600' : 'text-brand-eucalyptus'}`}>
                  {gvmRemaining.toLocaleString()}
                </p>
                <p className="text-xs text-brand-gray">kg</p>
              </div>
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6">
            <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Vehicle</h3>
            <select
              value={customMode ? '__custom__' : vehicle.name}
              onChange={(e) => {
                if (e.target.value === '__custom__') {
                  setCustomMode(true)
                } else {
                  handlePresetSelect(VEHICLE_PRESETS.find((v) => v.name === e.target.value))
                }
              }}
              className="w-full border border-brand-tan rounded-lg px-3 py-2.5 text-brand-brown bg-brand-cream/50 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            >
              {VEHICLE_PRESETS.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} (Tare: {v.tare}kg, GVM: {v.gvm}kg)
                </option>
              ))}
              <option value="__custom__">Custom Vehicle</option>
            </select>

            {customMode && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="text-xs text-brand-gray">Tare (kg)</label>
                  <input
                    type="number"
                    value={tare}
                    onChange={(e) => setTare(parseInt(e.target.value) || 0)}
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-gray">GVM (kg)</label>
                  <input
                    type="number"
                    value={gvm}
                    onChange={(e) => setGvm(parseInt(e.target.value) || 0)}
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-gray">GCM (kg)</label>
                  <input
                    type="number"
                    value={gcm}
                    onChange={(e) => setGcm(parseInt(e.target.value) || 0)}
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Load Inputs */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6">
            <h3 className="font-headline text-lg font-bold text-brand-brown mb-4">Load</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-brand-gray">Accessories (bull bar, roof rack, etc.)</label>
                  <span className="font-bold text-brand-brown">{accessories} kg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={accessories}
                  onChange={(e) => setAccessories(parseInt(e.target.value))}
                  className="w-full accent-brand-ochre"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-brand-gray">Cargo (gear, water, food, tools)</label>
                  <span className="font-bold text-brand-brown">{cargo} kg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={cargo}
                  onChange={(e) => setCargo(parseInt(e.target.value))}
                  className="w-full accent-brand-ochre"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-brand-gray">Passengers</label>
                  <span className="font-bold text-brand-brown">{passengers} kg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value))}
                  className="w-full accent-brand-ochre"
                />
                <div className="flex justify-between text-xs text-brand-gray">
                  <span>0</span>
                  <span>~{Math.round(passengers / 80)} adults</span>
                  <span>500kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Towing Section */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6">
            <h3 className="font-headline text-lg font-bold text-brand-brown mb-4">Towing</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-brand-gray">Tow ball weight (on vehicle)</label>
                  <span className="font-bold text-brand-brown">{towBallWeight} kg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="350"
                  step="5"
                  value={towBallWeight}
                  onChange={(e) => setTowBallWeight(parseInt(e.target.value))}
                  className="w-full accent-brand-ochre"
                />
                <p className="text-xs text-brand-gray">Counts towards vehicle GVM</p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-brand-gray">Trailer ATM (loaded trailer weight)</label>
                  <span className="font-bold text-brand-brown">{trailerAtm.toLocaleString()} kg</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3500"
                  step="50"
                  value={trailerAtm}
                  onChange={(e) => setTrailerAtm(parseInt(e.target.value))}
                  className="w-full accent-brand-ochre"
                />
              </div>
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 mx-auto text-sm text-brand-gray hover:text-brand-brown transition-colors"
          >
            <RotateCcw size={14} />
            Reset to defaults
          </button>

          <p className="text-xs text-brand-gray/70 text-center mt-8">
            Vehicle weights are approximate and vary by model year, variant, and options.
            Always check your vehicle's compliance plate for actual GVM, GCM, and tare weight.
            This calculator is a guide only — not a substitute for weighbridge measurements.
          </p>
        </div>
      </div>
    </div>
  )
}

export default WeightCalculator
