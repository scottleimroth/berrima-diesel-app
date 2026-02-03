import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { formatDistance } from '../../utils/formatters'

// Fix for default marker icons in webpack/vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom marker icons - using heritage colors
const createPriceIcon = (price, isBookmarked, rank) => {
  const bgColor = rank === 1 ? '#22c55e' : rank <= 3 ? '#CC7722' : '#6B4423'  // success, ochre, brown
  const borderColor = isBookmarked ? '#f59e0b' : bgColor

  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div style="
        background: ${bgColor};
        border: 3px solid ${borderColor};
        color: white;
        padding: 4px 8px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 12px;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transform: translate(-50%, -100%);
      ">
        ${price.toFixed(1)}
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 30],
  })
}

const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: #00205B;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

// Component to handle map center changes
function MapUpdater({ center }) {
  const map = useMap()
  const prevCenter = useRef(center)

  useEffect(() => {
    if (
      center &&
      (center.lat !== prevCenter.current?.lat || center.lng !== prevCenter.current?.lng)
    ) {
      map.setView([center.lat, center.lng], map.getZoom())
      prevCenter.current = center
    }
  }, [center, map])

  return null
}

function PriceMap({ stations, center, bookmarks }) {
  const mapCenter = center ? [center.lat, center.lng] : [-34.4794, 150.3369]

  return (
    <MapContainer
      center={mapCenter}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater center={center} />

      {/* User Location Marker */}
      {center && (
        <Marker position={[center.lat, center.lng]} icon={userLocationIcon}>
          <Popup>
            <div className="text-center">
              <strong>Your Location</strong>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Station Markers */}
      {stations.map((station, index) => {
        const lat = station.location?.latitude || station.lat
        const lng = station.location?.longitude || station.lng
        const isBookmarked = bookmarks.isBookmarked(station.code)

        return (
          <Marker
            key={station.code}
            position={[lat, lng]}
            icon={createPriceIcon(station.price, isBookmarked, index + 1)}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="font-bold text-lg text-brand-brown">{station.name}</div>
                <div className="text-brand-gray text-sm mb-2">{station.brand}</div>
                <div className="text-2xl font-bold text-brand-ochre mb-2">
                  {station.price.toFixed(1)}c/L
                </div>
                <div className="text-sm text-brand-gray mb-2">{station.address}</div>
                <div className="text-sm text-brand-gray mb-3">
                  {formatDistance(station.distance)} away
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-brand-brown text-white px-4 py-2 rounded text-sm font-medium hover:bg-brand-ochre transition-colors"
                >
                  Get Directions
                </a>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default PriceMap
