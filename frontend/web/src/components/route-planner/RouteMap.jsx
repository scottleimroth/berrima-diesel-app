import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom icons - heritage colors
const originIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="
      width: 32px;
      height: 32px;
      background: #22c55e;
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      color: white;
      font-weight: bold;
      font-size: 14px;
    ">A</div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const destinationIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="
      width: 32px;
      height: 32px;
      background: #CC7722;
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      color: white;
      font-weight: bold;
      font-size: 14px;
    ">B</div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const fuelIcon = L.divIcon({
  className: 'fuel-marker',
  html: `
    <div style="
      width: 28px;
      height: 28px;
      background: #FFD700;
      border: 2px solid #6B4423;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      font-size: 14px;
    ">⛽</div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

// Component to fit map bounds
function FitBounds({ points }) {
  const map = useMap()

  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [points, map])

  return null
}

function RouteMap({ routeData, origin, destination, fuelStops }) {
  // Default center (Berrima)
  const defaultCenter = [-34.4794, 150.3369]

  // Determine map center
  const center = useMemo(() => {
    if (origin?.position) {
      return [origin.position.lat, origin.position.lng]
    }
    return defaultCenter
  }, [origin])

  // Get route polyline points
  const routePoints = useMemo(() => {
    if (!routeData?.polyline) return []

    // If polyline is already an array of points
    if (Array.isArray(routeData.polyline)) {
      return routeData.polyline.map((p) => [p.lat, p.lng])
    }

    // If it's an encoded string, we'd need to decode it
    // For now, return empty if not array format
    return []
  }, [routeData])

  // Collect all points for bounds fitting
  const allPoints = useMemo(() => {
    const points = []
    if (origin?.position) {
      points.push({ lat: origin.position.lat, lng: origin.position.lng })
    }
    if (destination?.position) {
      points.push({ lat: destination.position.lat, lng: destination.position.lng })
    }
    fuelStops?.forEach((stop) => {
      const lat = stop.location?.latitude || stop.lat
      const lng = stop.location?.longitude || stop.lng
      if (lat && lng) {
        points.push({ lat, lng })
      }
    })
    return points
  }, [origin, destination, fuelStops])

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {allPoints.length > 0 && <FitBounds points={allPoints} />}

      {/* Route Polyline */}
      {routePoints.length > 0 && (
        <Polyline
          positions={routePoints}
          color="#4A6741"
          weight={5}
          opacity={0.8}
        />
      )}

      {/* Origin Marker */}
      {origin?.position && (
        <Marker position={[origin.position.lat, origin.position.lng]} icon={originIcon}>
          <Popup>
            <div className="text-center">
              <strong className="text-brand-brown">Origin</strong>
              <br />
              <span className="text-brand-gray">{origin.title}</span>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Destination Marker */}
      {destination?.position && (
        <Marker
          position={[destination.position.lat, destination.position.lng]}
          icon={destinationIcon}
        >
          <Popup>
            <div className="text-center">
              <strong className="text-brand-brown">Destination</strong>
              <br />
              <span className="text-brand-gray">{destination.title}</span>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Fuel Stop Markers */}
      {fuelStops?.map((stop) => {
        const lat = stop.location?.latitude || stop.lat
        const lng = stop.location?.longitude || stop.lng
        if (!lat || !lng) return null

        return (
          <Marker key={stop.code} position={[lat, lng]} icon={fuelIcon}>
            <Popup>
              <div className="min-w-[180px]">
                <div className="font-bold text-brand-brown">{stop.name}</div>
                <div className="text-brand-gray text-sm">{stop.brand}</div>
                <div className="text-xl font-bold text-brand-ochre my-1">
                  {stop.price?.toFixed(1)}c/L
                </div>
                <div className="text-xs text-brand-gray">{stop.address}</div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-center bg-brand-brown text-white px-3 py-1.5 rounded text-sm hover:bg-brand-ochre"
                >
                  Directions
                </a>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default RouteMap
