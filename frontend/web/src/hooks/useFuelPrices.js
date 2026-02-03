import { useQuery } from '@tanstack/react-query'
import { getFuelPricesNearby, getFuelTypes, getBrands } from '../services/nswFuelApi'

/**
 * Hook for fetching fuel prices near a location
 * @param {Object} location - { lat, lng }
 * @param {string} fuelType - Fuel type code (e.g., 'DL' for Diesel)
 * @param {string} sortBy - 'price' or 'distance'
 * @param {Object} options - React Query options
 */
export function useFuelPrices(location, fuelType = 'DL', sortBy = 'price', options = {}) {
  return useQuery({
    queryKey: ['fuelPrices', location?.lat, location?.lng, fuelType, sortBy],
    queryFn: () => getFuelPricesNearby(location.lat, location.lng, fuelType, sortBy),
    enabled: !!location?.lat && !!location?.lng,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    ...options,
  })
}

/**
 * Hook for fetching fuel type reference data
 */
export function useFuelTypes() {
  return useQuery({
    queryKey: ['fuelTypes'],
    queryFn: getFuelTypes,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
}

/**
 * Hook for fetching brand reference data
 */
export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  })
}

export default useFuelPrices
