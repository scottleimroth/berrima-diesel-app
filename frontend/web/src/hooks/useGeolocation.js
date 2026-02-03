import { useState, useCallback } from 'react'

const DEFAULT_LOCATION = {
  lat: parseFloat(import.meta.env.VITE_DEFAULT_LAT) || -34.4794,
  lng: parseFloat(import.meta.env.VITE_DEFAULT_LNG) || 150.3369,
}

/**
 * Hook for managing geolocation
 * @returns {Object} Geolocation state and methods
 */
export function useGeolocation() {
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('default') // 'default', 'gps', 'manual'

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setSource('gps')
        setLoading(false)
      },
      (err) => {
        let errorMessage = 'Unable to get your location'
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.'
            break
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case err.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        setError(errorMessage)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Cache for 1 minute
      }
    )
  }, [])

  const setManualLocation = useCallback((lat, lng) => {
    setLocation({ lat, lng })
    setSource('manual')
    setError(null)
  }, [])

  const resetToDefault = useCallback(() => {
    setLocation(DEFAULT_LOCATION)
    setSource('default')
    setError(null)
  }, [])

  return {
    location,
    loading,
    error,
    source,
    getCurrentPosition,
    setManualLocation,
    resetToDefault,
    isDefault: source === 'default',
  }
}

export default useGeolocation
