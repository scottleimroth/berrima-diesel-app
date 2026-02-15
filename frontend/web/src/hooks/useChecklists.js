import { useState, useCallback } from 'react'

const STORAGE_KEY = 'berrima-checklists'

const DEFAULT_CHECKLISTS = [
  {
    id: 'vehicle-check',
    name: 'Vehicle Pre-Trip Check',
    items: [
      { id: 'v1', text: 'Engine oil level', checked: false },
      { id: 'v2', text: 'Coolant level', checked: false },
      { id: 'v3', text: 'Tyre pressures (including spare)', checked: false },
      { id: 'v4', text: 'Brake fluid level', checked: false },
      { id: 'v5', text: 'Windscreen washer fluid', checked: false },
      { id: 'v6', text: 'Lights working (headlights, indicators, brake)', checked: false },
      { id: 'v7', text: 'Battery terminals clean and tight', checked: false },
      { id: 'v8', text: 'Air filter check', checked: false },
      { id: 'v9', text: 'Fan belts condition', checked: false },
      { id: 'v10', text: 'Fuel filter / water separator drained', checked: false },
      { id: 'v11', text: 'Recovery gear checked (snatch strap, shackles)', checked: false },
      { id: 'v12', text: 'Jack and wheel brace accessible', checked: false },
      { id: 'v13', text: 'Tool kit packed', checked: false },
      { id: 'v14', text: 'Fire extinguisher charged', checked: false },
      { id: 'v15', text: 'First aid kit stocked', checked: false },
    ],
  },
  {
    id: 'caravan-check',
    name: 'Caravan / Trailer Check',
    items: [
      { id: 'c1', text: 'Hitch coupling locked and pin secure', checked: false },
      { id: 'c2', text: 'Safety chains crossed under coupling', checked: false },
      { id: 'c3', text: 'Breakaway cable/chain attached', checked: false },
      { id: 'c4', text: 'Electric brakes tested', checked: false },
      { id: 'c5', text: 'Trailer lights working (indicators, brake, tail)', checked: false },
      { id: 'c6', text: 'Tyre pressures checked', checked: false },
      { id: 'c7', text: 'Wheel bearings greased', checked: false },
      { id: 'c8', text: 'Jockey wheel raised and stowed', checked: false },
      { id: 'c9', text: 'Stabiliser legs fully up', checked: false },
      { id: 'c10', text: 'All hatches and windows closed', checked: false },
      { id: 'c11', text: 'Gas bottles turned off', checked: false },
      { id: 'c12', text: 'Fridge on 12V mode', checked: false },
      { id: 'c13', text: 'Aerial down', checked: false },
      { id: 'c14', text: 'Awning stowed and locked', checked: false },
      { id: 'c15', text: 'Water tanks secured', checked: false },
    ],
  },
  {
    id: 'packing-list',
    name: 'Packing Essentials',
    items: [
      { id: 'p1', text: 'Drinking water (minimum 10L per person)', checked: false },
      { id: 'p2', text: 'Food and cooking supplies', checked: false },
      { id: 'p3', text: 'Medications and prescriptions', checked: false },
      { id: 'p4', text: 'Sun protection (hat, sunscreen, sunglasses)', checked: false },
      { id: 'p5', text: 'Maps / offline navigation', checked: false },
      { id: 'p6', text: 'Phone charger / power bank', checked: false },
      { id: 'p7', text: 'Torch / headlamp with spare batteries', checked: false },
      { id: 'p8', text: 'Insect repellent', checked: false },
      { id: 'p9', text: 'Camp chairs and table', checked: false },
      { id: 'p10', text: 'Bedding / sleeping bags', checked: false },
      { id: 'p11', text: 'Firewood / fire starter (if permitted)', checked: false },
      { id: 'p12', text: 'Rubbish bags', checked: false },
    ],
  },
  {
    id: 'campsite-setup',
    name: 'Campsite Setup',
    items: [
      { id: 's1', text: 'Level the vehicle/van', checked: false },
      { id: 's2', text: 'Chock wheels', checked: false },
      { id: 's3', text: 'Extend stabiliser legs', checked: false },
      { id: 's4', text: 'Connect power (if available)', checked: false },
      { id: 's5', text: 'Fill water tank (if available)', checked: false },
      { id: 's6', text: 'Set up awning', checked: false },
      { id: 's7', text: 'Set up camp kitchen', checked: false },
      { id: 's8', text: 'Connect gas', checked: false },
      { id: 's9', text: 'Switch fridge to gas/240V', checked: false },
      { id: 's10', text: 'Set up solar panels', checked: false },
      { id: 's11', text: 'Check for hazards (branches, ants, slope)', checked: false },
    ],
  },
]

function loadChecklists() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_CHECKLISTS
}

function saveChecklists(checklists) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checklists))
}

export function useChecklists() {
  const [checklists, setChecklists] = useState(loadChecklists)

  const toggleItem = useCallback((checklistId, itemId) => {
    setChecklists((prev) => {
      const updated = prev.map((cl) => {
        if (cl.id !== checklistId) return cl
        return {
          ...cl,
          items: cl.items.map((item) => {
            if (item.id !== itemId) return item
            return { ...item, checked: !item.checked, checkedAt: !item.checked ? new Date().toISOString() : null }
          }),
        }
      })
      saveChecklists(updated)
      return updated
    })
  }, [])

  const resetChecklist = useCallback((checklistId) => {
    setChecklists((prev) => {
      const updated = prev.map((cl) => {
        if (cl.id !== checklistId) return cl
        return {
          ...cl,
          items: cl.items.map((item) => ({ ...item, checked: false, checkedAt: null })),
        }
      })
      saveChecklists(updated)
      return updated
    })
  }, [])

  const resetAll = useCallback(() => {
    const reset = checklists.map((cl) => ({
      ...cl,
      items: cl.items.map((item) => ({ ...item, checked: false, checkedAt: null })),
    }))
    setChecklists(reset)
    saveChecklists(reset)
  }, [checklists])

  const addItem = useCallback((checklistId, text) => {
    setChecklists((prev) => {
      const updated = prev.map((cl) => {
        if (cl.id !== checklistId) return cl
        return {
          ...cl,
          items: [...cl.items, { id: `custom-${Date.now()}`, text, checked: false }],
        }
      })
      saveChecklists(updated)
      return updated
    })
  }, [])

  const removeItem = useCallback((checklistId, itemId) => {
    setChecklists((prev) => {
      const updated = prev.map((cl) => {
        if (cl.id !== checklistId) return cl
        return {
          ...cl,
          items: cl.items.filter((item) => item.id !== itemId),
        }
      })
      saveChecklists(updated)
      return updated
    })
  }, [])

  const restoreDefaults = useCallback(() => {
    setChecklists(DEFAULT_CHECKLISTS)
    saveChecklists(DEFAULT_CHECKLISTS)
  }, [])

  return {
    checklists,
    toggleItem,
    resetChecklist,
    resetAll,
    addItem,
    removeItem,
    restoreDefaults,
  }
}
