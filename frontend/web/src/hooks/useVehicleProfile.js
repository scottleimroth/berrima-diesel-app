import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'berrima_vehicle_profiles'

// Default vehicle presets for touring travellers
const DEFAULT_PRESETS = {
  '4wd-caravan': {
    name: '4WD + Large Caravan',
    height: 320, // cm - typical caravan height
    width: 250,
    length: 1200, // 4WD ~5m + caravan ~7m
    grossWeight: 7000, // kg - 3t 4WD + 4t caravan
    axleCount: 4,
    type: 'straight',
    trailersCount: 1,
  },
  '4wd-camper': {
    name: '4WD + Camper Trailer',
    height: 280, // cm
    width: 220,
    length: 900, // 4WD ~5m + camper ~4m
    grossWeight: 5000, // kg
    axleCount: 3,
    type: 'straight',
    trailersCount: 1,
  },
  'motorhome-large': {
    name: 'Large Motorhome',
    height: 350, // cm
    width: 250,
    length: 900, // 9m motorhome
    grossWeight: 7500, // kg
    axleCount: 2,
    type: 'straight',
    trailersCount: 0,
  },
  'motorhome-small': {
    name: 'Campervan / Small RV',
    height: 300, // cm
    width: 220,
    length: 700, // 7m
    grossWeight: 4500, // kg
    axleCount: 2,
    type: 'straight',
    trailersCount: 0,
  },
  'small-truck': {
    name: 'Small Truck / Ute',
    height: 350, // cm
    width: 220,
    length: 800, // 8m
    grossWeight: 8000, // kg
    axleCount: 2,
    type: 'straight',
    trailersCount: 0,
  },
  '4wd-boat': {
    name: '4WD + Boat Trailer',
    height: 350, // cm - boat on trailer can be tall
    width: 250,
    length: 1100, // 4WD + boat trailer
    grossWeight: 5500, // kg
    axleCount: 3,
    type: 'straight',
    trailersCount: 1,
  },
}

const DEFAULT_PROFILE = DEFAULT_PRESETS['4wd-caravan']

/**
 * Hook for managing vehicle profiles
 * @returns {Object} Vehicle profile state and methods
 */
export function useVehicleProfile() {
  const [currentProfile, setCurrentProfile] = useState(DEFAULT_PROFILE)
  const [savedProfiles, setSavedProfiles] = useState({})

  // Load saved profiles from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setSavedProfiles(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading vehicle profiles:', error)
    }
  }, [])

  // Save profiles to localStorage whenever they change
  const persistProfiles = useCallback((profiles) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
    } catch (error) {
      console.error('Error saving vehicle profiles:', error)
    }
  }, [])

  const updateProfile = useCallback((updates) => {
    setCurrentProfile((prev) => ({ ...prev, ...updates }))
  }, [])

  const loadPreset = useCallback((presetKey) => {
    const preset = DEFAULT_PRESETS[presetKey]
    if (preset) {
      setCurrentProfile(preset)
    }
  }, [])

  const saveProfile = useCallback((name) => {
    const profileKey = name.toLowerCase().replace(/\s+/g, '-')
    const newProfiles = {
      ...savedProfiles,
      [profileKey]: { ...currentProfile, name },
    }
    setSavedProfiles(newProfiles)
    persistProfiles(newProfiles)
    return profileKey
  }, [currentProfile, savedProfiles, persistProfiles])

  const loadSavedProfile = useCallback((profileKey) => {
    const profile = savedProfiles[profileKey]
    if (profile) {
      setCurrentProfile(profile)
    }
  }, [savedProfiles])

  const deleteSavedProfile = useCallback((profileKey) => {
    const newProfiles = { ...savedProfiles }
    delete newProfiles[profileKey]
    setSavedProfiles(newProfiles)
    persistProfiles(newProfiles)
  }, [savedProfiles, persistProfiles])

  const resetToDefault = useCallback(() => {
    setCurrentProfile(DEFAULT_PROFILE)
  }, [])

  return {
    currentProfile,
    savedProfiles,
    presets: DEFAULT_PRESETS,
    updateProfile,
    loadPreset,
    saveProfile,
    loadSavedProfile,
    deleteSavedProfile,
    resetToDefault,
  }
}

export default useVehicleProfile
