import { useState } from 'react'
import { Search, Navigation, MapPin, Loader2 } from 'lucide-react'
import { getAddressSuggestions } from '../../services/hereRoutingApi'

function FuelSearch({ onLocationSelect, onUseMyLocation, locationLoading, currentSource }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searching, setSearching] = useState(false)

  const handleInputChange = async (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.length >= 3) {
      setSearching(true)
      try {
        const results = await getAddressSuggestions(value)
        setSuggestions(results)
        setShowSuggestions(true)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
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
    onLocationSelect({
      lat: suggestion.position.lat,
      lng: suggestion.position.lng,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0])
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ochre"
            />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search suburb or postcode..."
              className="w-full pl-10 pr-10 py-3 border border-brand-tan rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-ochre focus:border-transparent text-brand-dark"
            />
            {searching && (
              <Loader2
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-ochre animate-spin"
              />
            )}
          </div>
        </form>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-brand-tan rounded-lg shadow-lg">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-brand-light flex items-start gap-3 border-b last:border-b-0"
              >
                <MapPin size={18} className="text-brand-ochre mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-brand-brown">{suggestion.title}</div>
                  <div className="text-sm text-brand-gray">{suggestion.address}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Use My Location Button */}
      <button
        onClick={onUseMyLocation}
        disabled={locationLoading}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
          currentSource === 'gps'
            ? 'bg-success text-white'
            : 'bg-brand-brown text-white hover:bg-brand-ochre'
        }`}
      >
        {locationLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span className="hidden sm:inline">Locating...</span>
          </>
        ) : (
          <>
            <Navigation size={20} />
            <span className="hidden sm:inline">
              {currentSource === 'gps' ? 'Location Set' : 'Use My Location'}
            </span>
          </>
        )}
      </button>
    </div>
  )
}

export default FuelSearch
