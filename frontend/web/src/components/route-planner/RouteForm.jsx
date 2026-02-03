import { useState } from 'react'
import { MapPin, Navigation, Loader2, Plus, X } from 'lucide-react'
import { getAddressSuggestions } from '../../services/hereRoutingApi'

function AddressInput({ label, value, onChange, placeholder }) {
  const [query, setQuery] = useState(value?.title || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searching, setSearching] = useState(false)
  const [noResults, setNoResults] = useState(false)

  const handleInputChange = async (e) => {
    const val = e.target.value
    setQuery(val)
    onChange(null) // Clear selection when typing
    setNoResults(false)

    if (val.length >= 3) {
      setSearching(true)
      try {
        const results = await getAddressSuggestions(val)
        setSuggestions(results)
        setShowSuggestions(true)
        setNoResults(results.length === 0)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setNoResults(true)
      }
      setSearching(false)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title)
    setShowSuggestions(false)
    setNoResults(false)
    onChange(suggestion)
  }

  // Show hint when user has typed but not selected
  const showSelectHint = query.length >= 3 && !value && !searching && !showSuggestions && !noResults

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-brand-brown mb-1">{label}</label>
      <div className="relative">
        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ochre" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-ochre ${
            value ? 'border-success bg-success/5' : 'border-brand-tan'
          }`}
        />
        {searching && (
          <Loader2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-ochre animate-spin" />
        )}
        {value && !searching && (
          <Navigation size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-success" />
        )}
      </div>

      {/* Hint to select from dropdown */}
      {showSelectHint && (
        <p className="text-xs text-brand-ochre mt-1">
          Click a location from the dropdown to select it
        </p>
      )}

      {/* No results message */}
      {noResults && (
        <p className="text-xs text-warning mt-1">
          No locations found. Try a different search term.
        </p>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-brand-tan rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2.5 text-left hover:bg-brand-cream flex items-start gap-2 border-b border-brand-tan/30 last:border-b-0"
            >
              <MapPin size={16} className="text-brand-ochre mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-brand-brown">{suggestion.title}</div>
                <div className="text-xs text-brand-gray">{suggestion.address}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function RouteForm({ onCalculateRoute, loading }) {
  const [origin, setOrigin] = useState(null)
  const [destination, setDestination] = useState(null)
  const [waypoints, setWaypoints] = useState([])
  const [avoid, setAvoid] = useState({
    tollRoads: false,
    ferries: false,
    unpaved: false,
    difficultTurns: false,
  })

  const handleAddWaypoint = () => {
    setWaypoints([...waypoints, null])
  }

  const handleRemoveWaypoint = (index) => {
    setWaypoints(waypoints.filter((_, i) => i !== index))
  }

  const handleWaypointChange = (index, value) => {
    const newWaypoints = [...waypoints]
    newWaypoints[index] = value
    setWaypoints(newWaypoints)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (origin && destination) {
      onCalculateRoute({
        origin,
        destination,
        waypoints: waypoints.filter(Boolean).map((wp) => wp.position),
        avoid,
      })
    }
  }

  const canSubmit = origin && destination && !loading

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Origin */}
      <AddressInput
        label="Origin"
        value={origin}
        onChange={setOrigin}
        placeholder="Starting point..."
      />

      {/* Waypoints */}
      {waypoints.map((waypoint, index) => (
        <div key={index} className="relative">
          <AddressInput
            label={`Via Point ${index + 1}`}
            value={waypoint}
            onChange={(val) => handleWaypointChange(index, val)}
            placeholder="Add waypoint..."
          />
          <button
            type="button"
            onClick={() => handleRemoveWaypoint(index)}
            className="absolute top-0 right-0 p-1 text-brand-gray hover:text-brand-ochre"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      {/* Add Waypoint Button */}
      <button
        type="button"
        onClick={handleAddWaypoint}
        className="flex items-center gap-2 text-sm text-brand-ochre hover:text-brand-brown"
      >
        <Plus size={16} />
        Add Waypoint
      </button>

      {/* Destination */}
      <AddressInput
        label="Destination"
        value={destination}
        onChange={setDestination}
        placeholder="End point..."
      />

      {/* Avoid Options */}
      <div>
        <h4 className="text-sm font-medium text-brand-brown mb-2">Avoid</h4>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 text-sm text-brand-gray">
            <input
              type="checkbox"
              checked={avoid.tollRoads}
              onChange={(e) => setAvoid({ ...avoid, tollRoads: e.target.checked })}
              className="rounded border-brand-tan text-brand-ochre focus:ring-brand-ochre"
            />
            Toll Roads
          </label>
          <label className="flex items-center gap-2 text-sm text-brand-gray">
            <input
              type="checkbox"
              checked={avoid.ferries}
              onChange={(e) => setAvoid({ ...avoid, ferries: e.target.checked })}
              className="rounded border-brand-tan text-brand-ochre focus:ring-brand-ochre"
            />
            Ferries
          </label>
          <label className="flex items-center gap-2 text-sm text-brand-gray">
            <input
              type="checkbox"
              checked={avoid.unpaved}
              onChange={(e) => setAvoid({ ...avoid, unpaved: e.target.checked })}
              className="rounded border-brand-tan text-brand-ochre focus:ring-brand-ochre"
            />
            Unpaved Roads
          </label>
          <label className="flex items-center gap-2 text-sm text-brand-gray">
            <input
              type="checkbox"
              checked={avoid.difficultTurns}
              onChange={(e) => setAvoid({ ...avoid, difficultTurns: e.target.checked })}
              className="rounded border-brand-tan text-brand-ochre focus:ring-brand-ochre"
            />
            Difficult Turns
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
          canSubmit
            ? 'bg-brand-eucalyptus hover:bg-brand-brown text-white'
            : 'bg-brand-tan/30 text-brand-gray cursor-not-allowed'
        }`}
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Calculating Route...
          </>
        ) : (
          <>
            <Navigation size={20} />
            Calculate Route
          </>
        )}
      </button>
    </form>
  )
}

export default RouteForm
