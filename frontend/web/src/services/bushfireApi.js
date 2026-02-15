/**
 * Bushfire Information Service
 *
 * Fetches live bushfire/incident data from state emergency services.
 * All feeds are free, no auth, public GeoJSON/JSON.
 *
 * Sources:
 * - NSW: Rural Fire Service (RFS) Major Incidents GeoJSON
 * - VIC: Country Fire Authority (CFA) incidents
 * - QLD: Queensland Fire and Emergency Services
 * - WA: Department of Fire and Emergency Services (DFES)
 * - SA: Country Fire Service (CFS)
 * - TAS: Tasmania Fire Service (TFS)
 */

import axios from 'axios'

const FEEDS = {
  NSW: {
    url: 'https://www.rfs.nsw.gov.au/feeds/majorIncidents.json',
    name: 'NSW Rural Fire Service',
  },
}

/**
 * Fetch NSW RFS major incidents
 * @returns {Promise<Array>} Array of incident objects
 */
export async function fetchBushfireIncidents() {
  const incidents = []

  // NSW RFS GeoJSON feed
  try {
    const response = await axios.get(FEEDS.NSW.url, { timeout: 10000 })
    const geojson = response.data

    if (geojson?.features) {
      for (const feature of geojson.features) {
        const props = feature.properties || {}
        const geometry = feature.geometry

        // Extract center point from geometry
        let lat = null
        let lng = null
        if (geometry?.type === 'Point') {
          lng = geometry.coordinates[0]
          lat = geometry.coordinates[1]
        } else if (geometry?.type === 'GeometryCollection' && geometry.geometries?.length > 0) {
          // Take the first point geometry
          const point = geometry.geometries.find((g) => g.type === 'Point')
          if (point) {
            lng = point.coordinates[0]
            lat = point.coordinates[1]
          }
        }

        incidents.push({
          id: `nsw-${props.guid || Math.random().toString(36).slice(2)}`,
          title: props.title || 'Unknown Incident',
          description: props.description || '',
          category: props.category || 'Unknown',
          status: props.status || '',
          alertLevel: categoriseAlertLevel(props.category),
          location: props.location || '',
          councilArea: props.councilArea || '',
          state: 'NSW',
          source: 'NSW RFS',
          lat,
          lng,
          updated: props.pubDate || null,
          type: extractFireType(props.category),
          size: props.size || '',
          responsible: props.responsibleAgency || 'NSW RFS',
        })
      }
    }
  } catch (error) {
    console.error('Error fetching NSW RFS incidents:', error)
  }

  return incidents
}

/**
 * Categorise alert level from RFS category strings
 */
function categoriseAlertLevel(category) {
  if (!category) return 'advice'
  const cat = category.toLowerCase()
  if (cat.includes('emergency')) return 'emergency'
  if (cat.includes('watch and act')) return 'watch-and-act'
  if (cat.includes('advice')) return 'advice'
  if (cat.includes('not applicable')) return 'info'
  return 'advice'
}

/**
 * Extract fire type from category
 */
function extractFireType(category) {
  if (!category) return 'other'
  const cat = category.toLowerCase()
  if (cat.includes('bush fire') || cat.includes('bushfire') || cat.includes('grass fire')) return 'bushfire'
  if (cat.includes('structure fire') || cat.includes('house fire')) return 'structure'
  if (cat.includes('hazard reduction')) return 'hazard-reduction'
  if (cat.includes('motor vehicle')) return 'mva'
  if (cat.includes('flood') || cat.includes('storm')) return 'flood'
  return 'other'
}

/**
 * Get alert level styling
 */
export function getAlertStyle(level) {
  const styles = {
    emergency: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', badge: 'bg-red-600 text-white', label: 'Emergency Warning' },
    'watch-and-act': { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-700', badge: 'bg-orange-500 text-white', label: 'Watch and Act' },
    advice: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700', badge: 'bg-yellow-500 text-white', label: 'Advice' },
    info: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', badge: 'bg-blue-500 text-white', label: 'Information' },
  }
  return styles[level] || styles.info
}
