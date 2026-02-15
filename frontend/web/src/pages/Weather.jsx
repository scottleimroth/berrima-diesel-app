import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Cloud, Droplets, Wind, Sun, Thermometer, Navigation } from 'lucide-react'
import { getWeatherForecast, getWeatherDescription, getWindDirection, getUVLevel } from '../services/weatherApi'
import { useGeolocation } from '../hooks/useGeolocation'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'

function Weather() {
  const { location, loading: locationLoading, getCurrentPosition, setManualLocation, source } = useGeolocation()
  const [searchInput, setSearchInput] = useState('')

  const { data: weather, isLoading, error, refetch } = useQuery({
    queryKey: ['weather', location.lat, location.lng],
    queryFn: () => getWeatherForecast(location.lat, location.lng),
    staleTime: 30 * 60 * 1000, // 30 min
  })

  const handleSearch = async () => {
    if (!searchInput.trim()) return
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}&countrycodes=au&limit=1`
      )
      const results = await response.json()
      if (results.length > 0) {
        setManualLocation(parseFloat(results[0].lat), parseFloat(results[0].lon))
      }
    } catch {
      // Geocoding failed silently
    }
  }

  const current = weather?.current
  const daily = weather?.daily
  const currentWeather = current ? getWeatherDescription(current.weather_code) : null

  const formatDay = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.getTime() === today.getTime()) return 'Today'
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow'
    return date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Page Header */}
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Weather Forecast
          </h1>
          <p className="text-brand-gray">
            7-day Australian forecast powered by Bureau of Meteorology data.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border-b border-brand-tan/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 max-w-lg">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search location (e.g. Alice Springs, Uluru)"
              className="flex-1 border border-brand-tan rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 bg-brand-yellow text-brand-navy rounded-lg font-medium text-sm hover:bg-brand-gold transition-colors"
            >
              Search
            </button>
            <button
              onClick={getCurrentPosition}
              disabled={locationLoading}
              className="flex items-center gap-1 px-3 py-2.5 bg-brand-cream border border-brand-tan rounded-lg text-sm text-brand-brown hover:bg-brand-tan/30 transition-colors"
            >
              <Navigation size={14} />
              GPS
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {isLoading ? (
            <LoadingSpinner message="Fetching weather forecast..." />
          ) : error ? (
            <ErrorDisplay
              title="Unable to load weather"
              message="Could not fetch forecast data. Please try again."
              onRetry={refetch}
            />
          ) : weather ? (
            <>
              {/* Current Conditions */}
              {current && (
                <div className="bg-white rounded-xl shadow-lg border border-brand-tan/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-headline text-xl font-bold text-brand-brown">Right Now</h2>
                    <span className="text-4xl">{currentWeather?.icon}</span>
                  </div>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="font-headline text-5xl font-bold text-brand-brown">
                      {Math.round(current.temperature_2m)}°
                    </span>
                    <span className="text-lg text-brand-gray mb-2">
                      Feels like {Math.round(current.apparent_temperature)}°
                    </span>
                  </div>
                  <p className="text-brand-gray mb-4">{currentWeather?.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Droplets size={16} className="text-blue-500" />
                      <div>
                        <p className="text-xs text-brand-gray">Humidity</p>
                        <p className="text-sm font-bold text-brand-brown">{current.relative_humidity_2m}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind size={16} className="text-brand-gray" />
                      <div>
                        <p className="text-xs text-brand-gray">Wind</p>
                        <p className="text-sm font-bold text-brand-brown">
                          {Math.round(current.wind_speed_10m)} km/h {getWindDirection(current.wind_direction_10m)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind size={16} className="text-red-500" />
                      <div>
                        <p className="text-xs text-brand-gray">Gusts</p>
                        <p className="text-sm font-bold text-brand-brown">{Math.round(current.wind_gusts_10m)} km/h</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun size={16} className="text-yellow-500" />
                      <div>
                        <p className="text-xs text-brand-gray">UV Index</p>
                        <p className={`text-sm font-bold ${getUVLevel(current.uv_index).color}`}>
                          {current.uv_index.toFixed(1)} ({getUVLevel(current.uv_index).level})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 7-Day Forecast */}
              {daily && (
                <div className="bg-white rounded-xl shadow border border-brand-tan/50 overflow-hidden">
                  <div className="p-5 border-b border-brand-tan/30">
                    <h2 className="font-headline text-xl font-bold text-brand-brown">7-Day Forecast</h2>
                  </div>
                  <div className="divide-y divide-brand-tan/20">
                    {daily.time.map((date, i) => {
                      const weatherInfo = getWeatherDescription(daily.weather_code[i])
                      const uv = getUVLevel(daily.uv_index_max[i])
                      return (
                        <div key={date} className="px-5 py-4 flex items-center gap-4">
                          <div className="w-24 flex-shrink-0">
                            <p className="text-sm font-bold text-brand-brown">{formatDay(date)}</p>
                          </div>
                          <span className="text-2xl flex-shrink-0">{weatherInfo.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-brand-gray truncate">{weatherInfo.description}</p>
                            <div className="flex items-center gap-3 text-xs text-brand-gray mt-1">
                              {daily.precipitation_probability_max[i] > 0 && (
                                <span className="flex items-center gap-1">
                                  <Droplets size={10} className="text-blue-500" />
                                  {daily.precipitation_probability_max[i]}%
                                </span>
                              )}
                              {daily.precipitation_sum[i] > 0 && (
                                <span>{daily.precipitation_sum[i].toFixed(1)}mm</span>
                              )}
                              <span className="flex items-center gap-1">
                                <Wind size={10} />
                                {Math.round(daily.wind_speed_10m_max[i])} km/h
                              </span>
                              <span className={`${uv.color}`}>UV {daily.uv_index_max[i].toFixed(0)}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-lg font-bold text-brand-brown">
                              {Math.round(daily.temperature_2m_max[i])}°
                            </span>
                            <span className="text-sm text-brand-gray ml-1">
                              / {Math.round(daily.temperature_2m_min[i])}°
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          ) : null}

          {/* Attribution */}
          <p className="text-xs text-brand-gray/70 text-center">
            Weather data from Open-Meteo using Bureau of Meteorology (BOM) sources.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Weather
