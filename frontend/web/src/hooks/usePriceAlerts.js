import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'berrima-price-alerts'

/**
 * Hook for managing fuel price alerts
 * Stores target prices and notifies when stations are below target
 */
export function usePriceAlerts() {
  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : { enabled: false, targetPrice: 180, fuelType: 'DL' }
    } catch {
      return { enabled: false, targetPrice: 180, fuelType: 'DL' }
    }
  })

  // Save to localStorage whenever alerts change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts))
  }, [alerts])

  const setTargetPrice = useCallback((price) => {
    setAlerts((prev) => ({ ...prev, targetPrice: price }))
  }, [])

  const setEnabled = useCallback((enabled) => {
    setAlerts((prev) => ({ ...prev, enabled }))
  }, [])

  const setFuelType = useCallback((fuelType) => {
    setAlerts((prev) => ({ ...prev, fuelType }))
  }, [])

  // Check if any stations are below target price
  const checkAlerts = useCallback((stations) => {
    if (!alerts.enabled || !stations || stations.length === 0) {
      return []
    }
    return stations.filter((station) => station.price <= alerts.targetPrice)
  }, [alerts.enabled, alerts.targetPrice])

  // Get count of stations below target
  const getAlertCount = useCallback((stations) => {
    return checkAlerts(stations).length
  }, [checkAlerts])

  return {
    alerts,
    setTargetPrice,
    setEnabled,
    setFuelType,
    checkAlerts,
    getAlertCount,
  }
}

export default usePriceAlerts
