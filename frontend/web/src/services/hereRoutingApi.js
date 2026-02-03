import axios from 'axios'
import { decode } from '@here/flexpolyline'

const API_KEY = import.meta.env.VITE_HERE_API_KEY
const ROUTING_BASE_URL = 'https://router.hereapi.com/v8'
const GEOCODE_BASE_URL = 'https://geocode.search.hereapi.com/v1'
const AUTOSUGGEST_BASE_URL = 'https://autosuggest.search.hereapi.com/v1'

/**
 * Calculate a truck route between origin and destination
 * @param {Object} params - Route parameters
 * @param {Object} params.origin - { lat, lng }
 * @param {Object} params.destination - { lat, lng }
 * @param {Object} params.vehicle - Vehicle specifications
 * @param {Array} params.via - Optional waypoints
 * @param {Object} params.avoid - Optional avoid options
 * @returns {Promise<Object>} Route data
 */
export async function calculateTruckRoute({
  origin,
  destination,
  vehicle = {},
  via = [],
  avoid = {},
}) {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.warn('HERE API key not configured, using demo route')
    return getDemoRoute(origin, destination)
  }

  try {
    console.log('HERE API: Calculating route with API key:', API_KEY?.substring(0, 10) + '...')

    const params = new URLSearchParams({
      apiKey: API_KEY,
      transportMode: 'truck',
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      return: 'polyline,summary,actions,instructions',
    })

    // Add vehicle specifications
    if (vehicle.grossWeight) {
      params.append('truck[grossWeight]', vehicle.grossWeight)
    }
    if (vehicle.height) {
      params.append('truck[height]', vehicle.height)
    }
    if (vehicle.width) {
      params.append('truck[width]', vehicle.width)
    }
    if (vehicle.length) {
      params.append('truck[length]', vehicle.length)
    }
    if (vehicle.axleCount) {
      params.append('truck[axleCount]', vehicle.axleCount)
    }
    if (vehicle.type) {
      params.append('truck[type]', vehicle.type)
    }
    if (vehicle.trailersCount) {
      params.append('truck[trailersCount]', vehicle.trailersCount)
    }
    if (vehicle.hazardousGoods && vehicle.hazardousGoods.length > 0) {
      params.append('truck[shippedHazardousGoods]', vehicle.hazardousGoods.join(','))
    }
    if (vehicle.tunnelCategory) {
      params.append('truck[tunnelCategory]', vehicle.tunnelCategory)
    }

    // Add waypoints
    via.forEach((waypoint, index) => {
      params.append(`via`, `${waypoint.lat},${waypoint.lng}`)
    })

    // Add avoid options
    const avoidFeatures = []
    if (avoid.tollRoads) avoidFeatures.push('tollRoad')
    if (avoid.ferries) avoidFeatures.push('ferry')
    if (avoid.unpaved) avoidFeatures.push('dirtRoad')
    if (avoid.difficultTurns) avoidFeatures.push('difficultTurns')
    if (avoidFeatures.length > 0) {
      params.append('avoid[features]', avoidFeatures.join(','))
    }

    console.log('HERE API: Request URL:', `${ROUTING_BASE_URL}/routes`)
    const response = await axios.get(`${ROUTING_BASE_URL}/routes?${params.toString()}`)

    console.log('HERE API: Response received', response.data)

    if (response.data.routes && response.data.routes.length > 0) {
      const processedRoute = processRouteResponse(response.data.routes[0])
      console.log('HERE API: Processed route, polyline points:', processedRoute.polyline?.length)
      return processedRoute
    }

    throw new Error('No route found')
  } catch (error) {
    console.error('HERE API Error:', error.response?.data || error.message || error)
    console.warn('Falling back to demo route')
    return getDemoRoute(origin, destination)
  }
}

/**
 * Search for an address and get coordinates
 * @param {string} query - Address query
 * @returns {Promise<Array>} Array of address suggestions
 */
export async function geocodeAddress(query) {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    return getDemoSuggestions(query)
  }

  try {
    const response = await axios.get(`${GEOCODE_BASE_URL}/geocode`, {
      params: {
        apiKey: API_KEY,
        q: query,
        in: 'countryCode:AUS',
        limit: 5,
      },
    })

    return (response.data.items || []).map((item) => ({
      id: item.id,
      title: item.title,
      address: item.address?.label || item.title,
      position: item.position,
    }))
  } catch (error) {
    console.error('Error geocoding address:', error)
    return getDemoSuggestions(query)
  }
}

/**
 * Get address suggestions for autocomplete
 * Uses autosuggest first, falls back to geocoding if no results
 * @param {string} query - Partial address query
 * @param {Object} near - Optional nearby location { lat, lng }
 * @returns {Promise<Array>} Array of suggestions
 */
export async function getAddressSuggestions(query, near = null) {
  if (!query || query.length < 3) {
    return []
  }

  if (!API_KEY || API_KEY === 'your_api_key_here') {
    return getDemoSuggestions(query)
  }

  try {
    // Try autosuggest first
    const params = {
      apiKey: API_KEY,
      q: query,
      in: 'countryCode:AUS',
      limit: 5,
    }

    if (near) {
      params.at = `${near.lat},${near.lng}`
    }

    const response = await axios.get(`${AUTOSUGGEST_BASE_URL}/autosuggest`, { params })

    let results = (response.data.items || [])
      .filter((item) => item.position)
      .map((item) => ({
        id: item.id,
        title: item.title,
        address: item.address?.label || item.title,
        position: item.position,
      }))

    // If autosuggest returns no results, try geocoding as fallback
    if (results.length === 0) {
      const geocodeResponse = await axios.get(`${GEOCODE_BASE_URL}/geocode`, {
        params: {
          apiKey: API_KEY,
          q: query,
          in: 'countryCode:AUS',
          limit: 5,
        },
      })

      results = (geocodeResponse.data.items || []).map((item) => ({
        id: item.id,
        title: item.title,
        address: item.address?.label || item.title,
        position: item.position,
      }))
    }

    return results
  } catch (error) {
    console.error('Error getting address suggestions:', error)
    return getDemoSuggestions(query)
  }
}

// Process route response into a cleaner format
function processRouteResponse(route) {
  const section = route.sections[0]

  // Decode the polyline using official HERE decoder
  let decodedPolyline = []
  if (typeof section.polyline === 'string') {
    try {
      // The decode function returns { polyline: [[lat, lng, alt?], ...] }
      const decoded = decode(section.polyline)
      decodedPolyline = decoded.polyline.map(([lat, lng]) => ({ lat, lng }))
    } catch (error) {
      console.error('Error decoding polyline:', error)
    }
  } else if (Array.isArray(section.polyline)) {
    decodedPolyline = section.polyline
  }

  return {
    summary: {
      distance: section.summary.length, // meters
      duration: section.summary.duration, // seconds
      baseDuration: section.summary.baseDuration,
    },
    polyline: decodedPolyline,
    instructions: (section.actions || []).map((action) => ({
      instruction: action.instruction,
      duration: action.duration,
      length: action.length,
      direction: action.direction,
      offset: action.offset,
    })),
    warnings: section.notices || [],
  }
}

// Demo data for when API key is not configured
function getDemoRoute(origin, destination) {
  // Create a simple demo route
  const distance = calculateDemoDistance(origin, destination)

  return {
    summary: {
      distance: distance * 1000, // Convert to meters
      duration: Math.round((distance / 80) * 3600), // Assume 80km/h average
      baseDuration: Math.round((distance / 80) * 3600),
    },
    polyline: createDemoPolyline(origin, destination),
    instructions: [
      { instruction: 'Start from origin', duration: 0, length: 0, direction: 'leave' },
      { instruction: 'Head towards destination', duration: 300, length: 5000, direction: 'straight' },
      { instruction: 'Continue on main road', duration: 600, length: 10000, direction: 'straight' },
      { instruction: 'Arrive at destination', duration: 0, length: 0, direction: 'arrive' },
    ],
    warnings: [],
  }
}

function calculateDemoDistance(origin, destination) {
  const R = 6371
  const dLat = ((destination.lat - origin.lat) * Math.PI) / 180
  const dLon = ((destination.lng - origin.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((origin.lat * Math.PI) / 180) *
      Math.cos((destination.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function createDemoPolyline(origin, destination) {
  // Create intermediate points for a basic polyline
  const points = []
  const steps = 10

  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps
    points.push({
      lat: origin.lat + (destination.lat - origin.lat) * ratio,
      lng: origin.lng + (destination.lng - origin.lng) * ratio,
    })
  }

  return points
}

function getDemoSuggestions(query) {
  const lowercaseQuery = query.toLowerCase()
  const demoLocations = [
    { id: '1', title: 'Berrima, NSW', address: 'Berrima NSW 2577, Australia', position: { lat: -34.4794, lng: 150.3369 } },
    { id: '2', title: 'Sydney, NSW', address: 'Sydney NSW 2000, Australia', position: { lat: -33.8688, lng: 151.2093 } },
    { id: '3', title: 'Melbourne, VIC', address: 'Melbourne VIC 3000, Australia', position: { lat: -37.8136, lng: 144.9631 } },
    { id: '4', title: 'Goulburn, NSW', address: 'Goulburn NSW 2580, Australia', position: { lat: -34.7545, lng: 149.7185 } },
    { id: '5', title: 'Mittagong, NSW', address: 'Mittagong NSW 2575, Australia', position: { lat: -34.4526, lng: 150.4532 } },
    { id: '6', title: 'Bowral, NSW', address: 'Bowral NSW 2576, Australia', position: { lat: -34.4783, lng: 150.4178 } },
    { id: '7', title: 'Canberra, ACT', address: 'Canberra ACT 2601, Australia', position: { lat: -35.2809, lng: 149.1300 } },
    { id: '8', title: 'Wollongong, NSW', address: 'Wollongong NSW 2500, Australia', position: { lat: -34.4278, lng: 150.8931 } },
    { id: '9', title: 'Broken Hill, NSW', address: 'Broken Hill NSW 2880, Australia', position: { lat: -31.9505, lng: 141.4538 } },
    { id: '10', title: 'Brisbane, QLD', address: 'Brisbane QLD 4000, Australia', position: { lat: -27.4698, lng: 153.0251 } },
    { id: '11', title: 'Adelaide, SA', address: 'Adelaide SA 5000, Australia', position: { lat: -34.9285, lng: 138.6007 } },
    { id: '12', title: 'Perth, WA', address: 'Perth WA 6000, Australia', position: { lat: -31.9505, lng: 115.8605 } },
    { id: '13', title: 'Darwin, NT', address: 'Darwin NT 0800, Australia', position: { lat: -12.4634, lng: 130.8456 } },
    { id: '14', title: 'Hobart, TAS', address: 'Hobart TAS 7000, Australia', position: { lat: -42.8821, lng: 147.3272 } },
    { id: '15', title: 'Alice Springs, NT', address: 'Alice Springs NT 0870, Australia', position: { lat: -23.6980, lng: 133.8807 } },
    { id: '16', title: 'Dubbo, NSW', address: 'Dubbo NSW 2830, Australia', position: { lat: -32.2569, lng: 148.6011 } },
  ]

  return demoLocations.filter(
    (loc) =>
      loc.title.toLowerCase().includes(lowercaseQuery) ||
      loc.address.toLowerCase().includes(lowercaseQuery)
  )
}
