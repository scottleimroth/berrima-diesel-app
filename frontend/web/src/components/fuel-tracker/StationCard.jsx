import { MapPin, Clock, Star, Navigation, ExternalLink, Bell } from 'lucide-react'
import { formatDistance, formatTimeAgo } from '../../utils/formatters'

function StationCard({ station, isBookmarked, onToggleBookmark, rank, isBelowAlert }) {
  const priceColor = isBelowAlert ? 'text-success' : rank === 1 ? 'text-success' : rank <= 3 ? 'text-brand-brown' : 'text-brand-gray'

  const getDirectionsUrl = () => {
    const lat = station.location?.latitude || station.lat
    const lng = station.location?.longitude || station.lng
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 overflow-hidden ${
      isBelowAlert ? 'border-success bg-success/5' : 'border-brand-ochre'
    }`}>
      <div className="p-4">
        <div className="flex justify-between items-start gap-4">
          {/* Station Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {rank <= 3 && (
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    rank === 1
                      ? 'bg-success text-white'
                      : rank === 2
                      ? 'bg-brand-tan text-brand-brown'
                      : 'bg-brand-gold/30 text-brand-brown'
                  }`}
                >
                  {rank}
                </span>
              )}
              <span className="text-xs font-medium text-brand-gray uppercase tracking-wide">
                {station.brand}
              </span>
              {station.state && (
                <span className="text-xs font-medium bg-brand-tan/40 text-brand-brown px-1.5 py-0.5 rounded">
                  {station.state}
                </span>
              )}
            </div>
            <h3 className="font-bold text-lg text-brand-brown truncate">{station.name}</h3>
            <p className="text-brand-gray text-sm flex items-start gap-1 mt-1">
              <MapPin size={14} className="flex-shrink-0 mt-0.5 text-brand-ochre" />
              <span className="truncate">{station.address}</span>
            </p>
            <div className="flex items-center gap-3 mt-2 text-sm text-brand-gray">
              <span className="flex items-center gap-1">
                <Navigation size={12} className="text-brand-ochre" />
                {formatDistance(station.distance)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-brand-ochre" />
                {formatTimeAgo(station.lastupdated)}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            {isBelowAlert && (
              <div className="flex items-center justify-end gap-1 text-success text-xs font-medium mb-1">
                <Bell size={12} />
                Below Alert
              </div>
            )}
            <div className={`text-3xl font-bold ${priceColor}`}>
              {station.price?.toFixed(1)}
            </div>
            <div className="text-xs text-brand-gray">c/L</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-brand-tan/30">
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-brown hover:bg-brand-ochre text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ExternalLink size={16} />
            Get Directions
          </a>
          <button
            onClick={() => onToggleBookmark(station)}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'bg-warning/10 text-warning hover:bg-warning/20'
                : 'bg-brand-tan/30 text-brand-gray hover:bg-brand-tan/50 hover:text-warning'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Star size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default StationCard
