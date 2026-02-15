/**
 * Weather API Service
 *
 * Uses Open-Meteo BOM API for Australian weather forecasts.
 * Endpoint: https://api.open-meteo.com/v1/bom
 * Free, no auth, no CORS issues.
 * Uses Bureau of Meteorology (BOM) data under the hood.
 */

import axios from 'axios'

const API_BASE = 'https://api.open-meteo.com/v1/bom'

/**
 * Get 7-day weather forecast for a location
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>} Weather forecast data
 */
export async function getWeatherForecast(latitude, longitude) {
  const response = await axios.get(API_BASE, {
    params: {
      latitude,
      longitude,
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_gusts_10m_max',
        'wind_direction_10m_dominant',
        'uv_index_max',
        'weather_code',
      ].join(','),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
        'uv_index',
      ].join(','),
      timezone: 'Australia/Sydney',
      forecast_days: 7,
    },
  })

  return response.data
}

/**
 * Map WMO weather codes to descriptions and icons
 */
export function getWeatherDescription(code) {
  const codes = {
    0: { description: 'Clear sky', icon: '☀️' },
    1: { description: 'Mainly clear', icon: '🌤️' },
    2: { description: 'Partly cloudy', icon: '⛅' },
    3: { description: 'Overcast', icon: '☁️' },
    45: { description: 'Foggy', icon: '🌫️' },
    48: { description: 'Depositing rime fog', icon: '🌫️' },
    51: { description: 'Light drizzle', icon: '🌦️' },
    53: { description: 'Moderate drizzle', icon: '🌦️' },
    55: { description: 'Dense drizzle', icon: '🌧️' },
    61: { description: 'Slight rain', icon: '🌧️' },
    63: { description: 'Moderate rain', icon: '🌧️' },
    65: { description: 'Heavy rain', icon: '🌧️' },
    71: { description: 'Slight snow', icon: '🌨️' },
    73: { description: 'Moderate snow', icon: '🌨️' },
    75: { description: 'Heavy snow', icon: '❄️' },
    80: { description: 'Slight rain showers', icon: '🌦️' },
    81: { description: 'Moderate rain showers', icon: '🌧️' },
    82: { description: 'Violent rain showers', icon: '⛈️' },
    95: { description: 'Thunderstorm', icon: '⛈️' },
    96: { description: 'Thunderstorm with hail', icon: '⛈️' },
    99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
  }
  return codes[code] || { description: 'Unknown', icon: '❓' }
}

/**
 * Get wind direction as compass text
 */
export function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

/**
 * Get UV index severity level
 */
export function getUVLevel(index) {
  if (index <= 2) return { level: 'Low', color: 'text-green-600' }
  if (index <= 5) return { level: 'Moderate', color: 'text-yellow-600' }
  if (index <= 7) return { level: 'High', color: 'text-orange-600' }
  if (index <= 10) return { level: 'Very High', color: 'text-red-600' }
  return { level: 'Extreme', color: 'text-purple-600' }
}
