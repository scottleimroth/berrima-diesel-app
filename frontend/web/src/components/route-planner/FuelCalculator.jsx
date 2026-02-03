import { Fuel, DollarSign, Gauge, Settings2 } from 'lucide-react'
import { useState } from 'react'

function FuelCalculator({
  distanceKm,
  cheapestPrice,
  fuelCalculator
}) {
  const [showSettings, setShowSettings] = useState(false)

  const litresNeeded = fuelCalculator.calculateFuelNeeded(distanceKm)
  const estimatedCost = fuelCalculator.calculateFuelCost(distanceKm, cheapestPrice)
  const fillUpsNeeded = fuelCalculator.calculateFillUps(distanceKm)

  return (
    <div className="bg-brand-cream rounded-lg p-4 border border-brand-tan/50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-brand-brown flex items-center gap-2">
          <Fuel size={18} className="text-brand-ochre" />
          Fuel Calculator
        </h4>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-1.5 rounded transition-colors ${
            showSettings ? 'bg-brand-ochre text-white' : 'text-brand-gray hover:bg-brand-tan/30'
          }`}
          title="Settings"
        >
          <Settings2 size={16} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-brand-tan/30">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-brand-gray mb-1">
                Consumption (L/100km)
              </label>
              <input
                type="number"
                value={fuelCalculator.settings.consumption}
                onChange={(e) => fuelCalculator.setConsumption(parseFloat(e.target.value) || 0)}
                min="5"
                max="30"
                step="0.5"
                className="w-full px-2 py-1.5 border border-brand-tan rounded text-sm text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-ochre"
              />
            </div>
            <div>
              <label className="block text-xs text-brand-gray mb-1">
                Tank Size (L)
              </label>
              <input
                type="number"
                value={fuelCalculator.settings.tankSize}
                onChange={(e) => fuelCalculator.setTankSize(parseFloat(e.target.value) || 0)}
                min="30"
                max="200"
                step="5"
                className="w-full px-2 py-1.5 border border-brand-tan rounded text-sm text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-ochre"
              />
            </div>
          </div>
          <p className="text-xs text-brand-gray mt-2">
            Range on full tank: {fuelCalculator.calculateRange.toFixed(0)} km
          </p>
        </div>
      )}

      {/* Calculations */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-brand-ochre mb-1">
            <Fuel size={14} />
          </div>
          <div className="text-xl font-bold text-brand-brown">
            {litresNeeded.toFixed(1)}L
          </div>
          <div className="text-xs text-brand-gray">Fuel Needed</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-success mb-1">
            <DollarSign size={14} />
          </div>
          <div className="text-xl font-bold text-success">
            ${estimatedCost.toFixed(2)}
          </div>
          <div className="text-xs text-brand-gray">Est. Cost</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-brand-eucalyptus mb-1">
            <Gauge size={14} />
          </div>
          <div className="text-xl font-bold text-brand-eucalyptus">
            {fillUpsNeeded}
          </div>
          <div className="text-xs text-brand-gray">Fill-ups</div>
        </div>
      </div>

      <p className="text-xs text-brand-gray mt-3 text-center">
        Based on {fuelCalculator.settings.consumption}L/100km at {cheapestPrice.toFixed(1)}c/L
      </p>
    </div>
  )
}

export default FuelCalculator
