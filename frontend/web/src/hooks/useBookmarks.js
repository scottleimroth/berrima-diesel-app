import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'berrima_fuel_bookmarks'

/**
 * Hook for managing bookmarked fuel stations
 * @returns {Object} Bookmarks state and methods
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([])

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setBookmarks(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error)
    }
  }, [])

  // Save bookmarks to localStorage
  const persistBookmarks = useCallback((newBookmarks) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks))
    } catch (error) {
      console.error('Error saving bookmarks:', error)
    }
  }, [])

  const addBookmark = useCallback((station) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.code === station.code)) {
        return prev // Already bookmarked
      }
      const newBookmarks = [
        ...prev,
        {
          code: station.code,
          name: station.name,
          brand: station.brand,
          address: station.address,
          addedAt: new Date().toISOString(),
        },
      ]
      persistBookmarks(newBookmarks)
      return newBookmarks
    })
  }, [persistBookmarks])

  const removeBookmark = useCallback((stationCode) => {
    setBookmarks((prev) => {
      const newBookmarks = prev.filter((b) => b.code !== stationCode)
      persistBookmarks(newBookmarks)
      return newBookmarks
    })
  }, [persistBookmarks])

  const toggleBookmark = useCallback((station) => {
    if (bookmarks.some((b) => b.code === station.code)) {
      removeBookmark(station.code)
    } else {
      addBookmark(station)
    }
  }, [bookmarks, addBookmark, removeBookmark])

  const isBookmarked = useCallback((stationCode) => {
    return bookmarks.some((b) => b.code === stationCode)
  }, [bookmarks])

  const clearAllBookmarks = useCallback(() => {
    setBookmarks([])
    persistBookmarks([])
  }, [persistBookmarks])

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearAllBookmarks,
    count: bookmarks.length,
  }
}

export default useBookmarks
