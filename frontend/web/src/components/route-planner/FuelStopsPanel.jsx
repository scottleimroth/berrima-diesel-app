import { Fuel, MapPin, ExternalLink } from 'lucide-react'
import { formatDistance } from '../../utils/formatters'

function FuelStopsPanel({ stops }) {
  if (!stops || stops.length === 0) {
    return null
  }

  const cheapestPrice = Math.min(...stops.map((s) => s.price))

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-brand-tan/50">
      <div className="bg-brand-brown text-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Fuel size={20} />
          <h3 className="font-bold">Fuel Stops Along Route</h3>
        </div>
        <p className="text-sm text-white/80 mt-1">
          {stops.length} diesel stations near your route
        </p>
      </div>

      <div className="divide-y divide-brand-tan/30">
        {stops.map((stop, index) => {
          const isCheapest = stop.price === cheapestPrice
          const lat = stop.location?.latitude || stop.lat
          const lng = stop.location?.longitude || stop.lng

          return (
            <div
              key={stop.code}
              className={`p-4 ${isCheapest ? 'bg-success/5' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isCheapest && (
                      <span className="text-xs font-bold text-success bg-success/20 px-2 py-0.5 rounded">
                        CHEAPEST
                      </span>
                    )}
                    <span className="text-xs text-brand-gray">#{index + 1}</span>
                  </div>
                  <h4 className="font-medium text-brand-brown truncate">{stop.name}</h4>
                  <p className="text-xs text-brand-gray">{stop.brand}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-brand-gray">
                    <MapPin size={12} />
                    <span className="truncate">{stop.address}</span>
                  </div>
                  {stop.distance && (
                    <div className="text-xs text-brand-gray mt-1">
                      {formatDistance(stop.distance)} from search point
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className={`text-2xl font-bold ${
                      isCheapest ? 'text-success' : 'text-brand-ochre'
                    }`}
                  >
                    {stop.price?.toFixed(1)}
                  </div>
                  <div className="text-xs text-brand-gray">c/L</div>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-3 px-3 py-2 bg-brand-cream hover:bg-brand-tan/30 rounded-lg text-sm font-medium text-brand-brown transition-colors"
              >
                <ExternalLink size={14} />
                Get Directions
              </a>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="bg-brand-cream px-4 py-3 border-t border-brand-tan/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-gray">Best price along route:</span>
          <span className="font-bold text-success">{cheapestPrice.toFixed(1)}c/L</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-brand-gray">Price range:</span>
          <span className="font-medium text-brand-brown">
            {cheapestPrice.toFixed(1)} - {Math.max(...stops.map((s) => s.price)).toFixed(1)}c/L
          </span>
        </div>
      </div>
    </div>
  )
}

export default FuelStopsPanel
