import { useState, useEffect, useCallback, useMemo } from 'react'

const STORAGE_KEY = 'berrima-fuel-calculator'

/**
 * Hook for fuel consumption calculations
 */
export function useFuelCalculator() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : {
        consumption: 12, // L/100km - typical for diesel 4WD with caravan
        tankSize: 80,    // Litres
      }
    } catch {
      return { consumption: 12, tankSize: 80 }
    }
  })

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const setConsumption = useCallback((value) => {
    setSettings((prev) => ({ ...prev, consumption: value }))
  }, [])

  const setTankSize = useCallback((value) => {
    setSettings((prev) => ({ ...prev, tankSize: value }))
  }, [])

  // Calculate fuel needed for a distance (in km)
  const calculateFuelNeeded = useCallback((distanceKm) => {
    return (distanceKm / 100) * settings.consumption
  }, [settings.consumption])

  // Calculate fuel cost for a distance at a given price
  const calculateFuelCost = useCallback((distanceKm, pricePerLitre) => {
    const litresNeeded = calculateFuelNeeded(distanceKm)
    return (litresNeeded * pricePerLitre) / 100 // price is in cents, return dollars
  }, [calculateFuelNeeded])

  // Calculate range on a full tank
  const calculateRange = useMemo(() => {
    return (settings.tankSize / settings.consumption) * 100
  }, [settings.tankSize, settings.consumption])

  // Calculate number of fill-ups needed for a distance
  const calculateFillUps = useCallback((distanceKm) => {
    const litresNeeded = calculateFuelNeeded(distanceKm)
    return Math.ceil(litresNeeded / settings.tankSize)
  }, [calculateFuelNeeded, settings.tankSize])

  return {
    settings,
    setConsumption,
    setTankSize,
    calculateFuelNeeded,
    calculateFuelCost,
    calculateRange,
    calculateFillUps,
  }
}

export default useFuelCalculator
