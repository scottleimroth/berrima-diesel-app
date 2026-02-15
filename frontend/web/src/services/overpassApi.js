/**
 * OpenStreetMap Overpass API Service
 *
 * Queries OSM data for campgrounds, rest areas, dump points, etc.
 * Endpoint: https://overpass-api.de/api/interpreter
 * Free, no auth, CORS supported.
 *
 * Rate limit: Be respectful — cache results aggressively.
 */

import axios from 'axios'

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

// Simple in-memory cache
const cache = new Map()
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

function getCached(key) {
  const entry = cache.get(key)
  if (entry && Date.now() - entry.time < CACHE_TTL) return entry.data
  return null
}

function setCache(key, data) {
  cache.set(key, { data, time: Date.now() })
}

/**
 * Execute an Overpass QL query
 */
async function query(overpassQL) {
  const cacheKey = overpassQL
  const cached = getCached(cacheKey)
  if (cached) return cached

  const response = await axios.post(
    OVERPASS_URL,
    `data=${encodeURIComponent(overpassQL)}`,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000,
    }
  )

  const data = response.data
  setCache(cacheKey, data)
  return data
}

/**
 * Calculate distance using Haversine formula
 */
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Find campgrounds near a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radiusKm - Search radius in km (default 50)
 * @returns {Promise<Array>}
 */
export async function findCampgrounds(lat, lng, radiusKm = 50) {
  const radiusM = radiusKm * 1000
  const ql = `
    [out:json][timeout:25];
    (
      node["tourism"="camp_site"](around:${radiusM},${lat},${lng});
      way["tourism"="camp_site"](around:${radiusM},${lat},${lng});
      node["tourism"="caravan_site"](around:${radiusM},${lat},${lng});
      way["tourism"="caravan_site"](around:${radiusM},${lat},${lng});
    );
    out center body;
  `

  const data = await query(ql)
  const elements = data.elements || []

  return elements
    .map((el) => {
      const elLat = el.lat || el.center?.lat
      const elLng = el.lon || el.center?.lon
      if (!elLat || !elLng) return null

      const tags = el.tags || {}
      return {
        id: el.id,
        name: tags.name || 'Unnamed Campground',
        lat: elLat,
        lng: elLng,
        distance: Math.round(haversine(lat, lng, elLat, elLng) * 10) / 10,
        type: tags.tourism === 'caravan_site' ? 'caravan_park' : 'campground',
        fee: tags.fee === 'yes' ? 'Paid' : tags.fee === 'no' ? 'Free' : 'Unknown',
        access: tags.access || 'unknown',
        website: tags.website || tags['contact:website'] || null,
        phone: tags.phone || tags['contact:phone'] || null,
        operator: tags.operator || null,
        facilities: {
          toilets: tags.toilets === 'yes' || tags['amenity:toilets'] === 'yes',
          water: tags.drinking_water === 'yes' || tags['water_point'] === 'yes',
          showers: tags.shower === 'yes' || tags.showers === 'yes',
          power: tags.power_supply === 'yes' || tags['caravans:electric_hookup'] === 'yes',
          bbq: tags.bbq === 'yes',
          pets: tags.dog === 'yes' || tags.pets === 'yes',
          dump_station: tags.sanitary_dump_station === 'yes',
          wifi: tags.internet_access === 'wlan' || tags.internet_access === 'yes',
        },
        source: 'osm',
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Find rest areas near a location
 * @param {number} lat
 * @param {number} lng
 * @param {number} radiusKm
 * @returns {Promise<Array>}
 */
/**
 * Find dump points (sanitary dump stations) near a location
 * @param {number} lat
 * @param {number} lng
 * @param {number} radiusKm
 * @returns {Promise<Array>}
 */
export async function findDumpPoints(lat, lng, radiusKm = 100) {
  const radiusM = radiusKm * 1000
  const ql = `
    [out:json][timeout:25];
    (
      node["amenity"="sanitary_dump_station"](around:${radiusM},${lat},${lng});
      way["amenity"="sanitary_dump_station"](around:${radiusM},${lat},${lng});
      node["sanitary_dump_station"="yes"](around:${radiusM},${lat},${lng});
      way["sanitary_dump_station"="yes"](around:${radiusM},${lat},${lng});
    );
    out center body;
  `

  const data = await query(ql)
  const elements = data.elements || []

  return elements
    .map((el) => {
      const elLat = el.lat || el.center?.lat
      const elLng = el.lon || el.center?.lon
      if (!elLat || !elLng) return null

      const tags = el.tags || {}
      return {
        id: el.id,
        name: tags.name || 'Dump Point',
        lat: elLat,
        lng: elLng,
        distance: Math.round(haversine(lat, lng, elLat, elLng) * 10) / 10,
        fee: tags.fee === 'yes' ? 'Paid' : tags.fee === 'no' ? 'Free' : 'Unknown',
        access: tags.access || 'unknown',
        operator: tags.operator || null,
        website: tags.website || tags['contact:website'] || null,
        facilities: {
          water: tags.drinking_water === 'yes' || tags.water_point === 'yes',
          grey_water: tags['waste_disposal:grey_water'] === 'yes',
          chemical_toilet: tags['waste_disposal:chemical_toilet'] === 'yes',
          cassette: tags['waste_disposal:cassette'] === 'yes',
        },
        source: 'osm',
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Find drinking water points near a location
 */
export async function findWaterPoints(lat, lng, radiusKm = 50) {
  const radiusM = radiusKm * 1000
  const ql = `
    [out:json][timeout:25];
    (
      node["amenity"="drinking_water"](around:${radiusM},${lat},${lng});
      node["amenity"="water_point"](around:${radiusM},${lat},${lng});
      node["drinking_water"="yes"](around:${radiusM},${lat},${lng});
    );
    out body;
  `

  const data = await query(ql)
  const elements = data.elements || []

  return elements
    .map((el) => {
      if (!el.lat || !el.lon) return null
      const tags = el.tags || {}
      return {
        id: el.id,
        name: tags.name || 'Water Point',
        lat: el.lat,
        lng: el.lon,
        distance: Math.round(haversine(lat, lng, el.lat, el.lon) * 10) / 10,
        potable: tags.drinking_water !== 'no',
        access: tags.access || 'yes',
        operator: tags.operator || null,
        source: 'osm',
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Find LPG/gas refill locations near a location
 */
export async function findGasRefills(lat, lng, radiusKm = 100) {
  const radiusM = radiusKm * 1000
  const ql = `
    [out:json][timeout:25];
    (
      node["fuel:lpg"="yes"](around:${radiusM},${lat},${lng});
      way["fuel:lpg"="yes"](around:${radiusM},${lat},${lng});
      node["shop"="gas"](around:${radiusM},${lat},${lng});
    );
    out center body;
  `

  const data = await query(ql)
  const elements = data.elements || []

  return elements
    .map((el) => {
      const elLat = el.lat || el.center?.lat
      const elLng = el.lon || el.center?.lon
      if (!elLat || !elLng) return null

      const tags = el.tags || {}
      return {
        id: el.id,
        name: tags.name || tags.brand || 'Gas/LPG Station',
        lat: elLat,
        lng: elLng,
        distance: Math.round(haversine(lat, lng, elLat, elLng) * 10) / 10,
        brand: tags.brand || null,
        type: tags.shop === 'gas' ? 'gas_shop' : 'fuel_station',
        website: tags.website || tags['contact:website'] || null,
        phone: tags.phone || tags['contact:phone'] || null,
        opening_hours: tags.opening_hours || null,
        source: 'osm',
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Find car repair workshops near a location
 */
export async function findWorkshops(lat, lng, radiusKm = 50) {
  const radiusM = radiusKm * 1000
  const ql = `
    [out:json][timeout:25];
    (
      node["shop"="car_repair"](around:${radiusM},${lat},${lng});
      way["shop"="car_repair"](around:${radiusM},${lat},${lng});
      node["craft"="car_repair"](around:${radiusM},${lat},${lng});
      node["shop"="tyres"](around:${radiusM},${lat},${lng});
    );
    out center body;
  `

  const data = await query(ql)
  const elements = data.elements || []

  return elements
    .map((el) => {
      const elLat = el.lat || el.center?.lat
      const elLng = el.lon || el.center?.lon
      if (!elLat || !elLng) return null

      const tags = el.tags || {}
      return {
        id: el.id,
        name: tags.name || 'Workshop',
        lat: elLat,
        lng: elLng,
        distance: Math.round(haversine(lat, lng, elLat, elLng) * 10) / 10,
        type: tags.shop === 'tyres' ? 'tyre_shop' : 'mechanic',
        diesel: tags['service:vehicle:diesel'] === 'yes',
        fourwd: tags['service:vehicle:4wd'] === 'yes' || tags['service:vehicle:4x4'] === 'yes',
        website: tags.website || tags['contact:website'] || null,
        phone: tags.phone || tags['contact:phone'] || null,
        opening_hours: tags.opening_hours || null,
        source: 'osm',
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Find free WiFi hotspots near a location
 */
export async function findWifiHotspots(lat, lng, radiusKm = 25) {
  const radiusM = radiusKm * 1000
  const ql = `
    [out:json][timeout:25];
    (
      node["internet_access"="wlan"](around:${radiusM},${lat},${lng});
      way["internet_access"="wlan"](around:${radiusM},${lat},${lng});
    );
    out center body;
  `

  const data = await query(ql)
  const elements = data.elements || []

  return elements
    .map((el) => {
      const elLat = el.lat || el.center?.lat
      const elLng = el.lon || el.center?.lon
      if (!elLat || !elLng) return null

      const tags = el.tags || {}
      return {
        id: el.id,
        name: tags.name || 'WiFi Hotspot',
        lat: elLat,
        lng: elLng,
        distance: Math.round(haversine(lat, lng, elLat, elLng) * 10) / 10,
        free: tags['internet_access:fee'] === 'no' || tags['internet_access:fee'] !== 'yes',
        type: tags.amenity || tags.shop || tags.tourism || 'other',
        opening_hours: tags.opening_hours || null,
        source: 'osm',
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Find laundromats near a location
 */
export async function findLaundromats(lat, lng, radiusKm = 50) {
  const radiusM = radiusKm * 1000
  const ql = `
    [out:json][timeout:25];
    (
      node["shop"="laundry"](around:${radiusM},${lat},${lng});
      way["shop"="laundry"](around:${radiusM},${lat},${lng});
      node["amenity"="laundry"](around:${radiusM},${lat},${lng});
    );
    out center body;
  `

  const data = await query(ql)
  const elements = data.elements || []

  return elements
    .map((el) => {
      const elLat = el.lat || el.center?.lat
      const elLng = el.lon || el.center?.lon
      if (!elLat || !elLng) return null

      const tags = el.tags || {}
      return {
        id: el.id,
        name: tags.name || 'Laundromat',
        lat: elLat,
        lng: elLng,
        distance: Math.round(haversine(lat, lng, elLat, elLng) * 10) / 10,
        selfService: tags.self_service !== 'no',
        website: tags.website || tags['contact:website'] || null,
        phone: tags.phone || tags['contact:phone'] || null,
        opening_hours: tags.opening_hours || null,
        source: 'osm',
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
}

export async function findRestAreas(lat, lng, radiusKm = 50) {
  const radiusM = radiusKm * 1000
  const ql = `
    [out:json][timeout:25];
    (
      node["highway"="rest_area"](around:${radiusM},${lat},${lng});
      way["highway"="rest_area"](around:${radiusM},${lat},${lng});
      node["amenity"="parking"]["parking"="layby"](around:${radiusM},${lat},${lng});
    );
    out center body;
  `

  const data = await query(ql)
  const elements = data.elements || []

  return elements
    .map((el) => {
      const elLat = el.lat || el.center?.lat
      const elLng = el.lon || el.center?.lon
      if (!elLat || !elLng) return null

      const tags = el.tags || {}
      return {
        id: el.id,
        name: tags.name || 'Rest Area',
        lat: elLat,
        lng: elLng,
        distance: Math.round(haversine(lat, lng, elLat, elLng) * 10) / 10,
        facilities: {
          toilets: tags.toilets === 'yes',
          water: tags.drinking_water === 'yes',
          shelter: tags.shelter === 'yes',
          picnic_table: tags.bench === 'yes' || tags.picnic_table === 'yes',
          bbq: tags.bbq === 'yes',
        },
        source: 'osm',
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
}
