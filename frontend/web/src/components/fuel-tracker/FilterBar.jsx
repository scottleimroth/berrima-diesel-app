import { ArrowUpDown, Fuel, MapPin, Globe } from 'lucide-react'
import { getAvailableStates } from '../../services/nationalFuelApi'

function FilterBar({
  sortBy,
  onSortChange,
  fuelType,
  onFuelTypeChange,
  fuelTypes,
  radius,
  onRadiusChange,
  state,
  onStateChange,
}) {
  const radiusOptions = [10, 25, 50, 100, 500]
  const availableStates = getAvailableStates()

  // Filter to show only diesel types
  const dieselTypes = (fuelTypes || []).filter(
    (ft) => ft.code === 'DL' || ft.code === 'PDL' || ft.name?.toLowerCase().includes('diesel')
  )

  // Fallback if no diesel types found
  const displayFuelTypes = dieselTypes.length > 0
    ? dieselTypes
    : [
        { code: 'DL', name: 'Diesel' },
        { code: 'PDL', name: 'Premium Diesel' },
      ]

  return (
    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-brand-tan/30">
      {/* State Selector */}
      <div className="flex items-center gap-2">
        <Globe size={16} className="text-brand-ochre" />
        <span className="text-sm text-brand-gray">State:</span>
        <select
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          className="px-3 py-1.5 text-sm bg-white border border-brand-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ochre text-brand-brown"
        >
          {availableStates.map((s) => (
            <option key={s.code} value={s.code} disabled={!s.available}>
              {s.label}{!s.available ? ' (coming soon)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div className="flex items-center gap-2">
        <ArrowUpDown size={16} className="text-brand-ochre" />
        <span className="text-sm text-brand-gray">Sort:</span>
        <div className="flex bg-brand-tan/30 rounded-lg p-0.5">
          <button
            onClick={() => onSortChange('price')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              sortBy === 'price'
                ? 'bg-white text-brand-brown shadow-sm'
                : 'text-brand-gray hover:text-brand-brown'
            }`}
          >
            Price
          </button>
          <button
            onClick={() => onSortChange('distance')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              sortBy === 'distance'
                ? 'bg-white text-brand-brown shadow-sm'
                : 'text-brand-gray hover:text-brand-brown'
            }`}
          >
            Distance
          </button>
        </div>
      </div>

      {/* Fuel Type */}
      <div className="flex items-center gap-2">
        <Fuel size={16} className="text-brand-ochre" />
        <span className="text-sm text-brand-gray">Fuel:</span>
        <select
          value={fuelType}
          onChange={(e) => onFuelTypeChange(e.target.value)}
          className="px-3 py-1.5 text-sm bg-white border border-brand-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ochre text-brand-brown"
        >
          {displayFuelTypes.map((ft) => (
            <option key={ft.code} value={ft.code}>
              {ft.name}
            </option>
          ))}
        </select>
      </div>

      {/* Radius */}
      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-brand-ochre" />
        <span className="text-sm text-brand-gray">Radius:</span>
        <div className="flex bg-brand-tan/30 rounded-lg p-0.5">
          {radiusOptions.map((r) => (
            <button
              key={r}
              onClick={() => onRadiusChange(r)}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                radius === r
                  ? 'bg-white text-brand-brown shadow-sm'
                  : 'text-brand-gray hover:text-brand-brown'
              }`}
            >
              {r}km
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterBar
