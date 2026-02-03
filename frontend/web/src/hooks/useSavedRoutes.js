import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'berrima-saved-routes'

/**
 * Hook for managing saved/favourite routes
 */
export function useSavedRoutes() {
  const [savedRoutes, setSavedRoutes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Save to localStorage whenever routes change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRoutes))
  }, [savedRoutes])

  const saveRoute = useCallback((route) => {
    const newRoute = {
      id: Date.now().toString(),
      name: route.name || `${route.origin.title} to ${route.destination.title}`,
      origin: route.origin,
      destination: route.destination,
      waypoints: route.waypoints || [],
      avoid: route.avoid || {},
      createdAt: new Date().toISOString(),
    }
    setSavedRoutes((prev) => [newRoute, ...prev])
    return newRoute
  }, [])

  const deleteRoute = useCallback((routeId) => {
    setSavedRoutes((prev) => prev.filter((r) => r.id !== routeId))
  }, [])

  const renameRoute = useCallback((routeId, newName) => {
    setSavedRoutes((prev) =>
      prev.map((r) => (r.id === routeId ? { ...r, name: newName } : r))
    )
  }, [])

  const getRoute = useCallback((routeId) => {
    return savedRoutes.find((r) => r.id === routeId)
  }, [savedRoutes])

  return {
    savedRoutes,
    saveRoute,
    deleteRoute,
    renameRoute,
    getRoute,
    hasSavedRoutes: savedRoutes.length > 0,
  }
}

export default useSavedRoutes
