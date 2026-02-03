import { Fuel } from 'lucide-react'
import StationCard from './StationCard'

function StationList({ stations, bookmarks, userLocation, priceAlerts }) {
  if (!stations || stations.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-brand-tan/50">
        <div className="w-16 h-16 bg-brand-tan/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Fuel size={32} className="text-brand-ochre" />
        </div>
        <h3 className="font-headline text-xl font-bold text-brand-brown mb-2">
          No Stations Found
        </h3>
        <p className="text-brand-gray">
          Try expanding your search radius or searching in a different area.
        </p>
      </div>
    )
  }

  // Find cheapest price for highlighting
  const cheapestPrice = Math.min(...stations.map((s) => s.price))

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-brand-tan/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-sm text-brand-gray">Cheapest price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-success">
                {cheapestPrice.toFixed(1)}c/L
              </span>
              <span className="text-sm text-brand-gray">
                at {stations[0]?.name}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-brand-gray">Price range</span>
            <div className="text-lg font-semibold text-brand-brown">
              {cheapestPrice.toFixed(1)} - {Math.max(...stations.map((s) => s.price)).toFixed(1)}c/L
            </div>
          </div>
        </div>
      </div>

      {/* Station Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stations.map((station, index) => (
          <StationCard
            key={station.code}
            station={station}
            rank={index + 1}
            isBookmarked={bookmarks.isBookmarked(station.code)}
            onToggleBookmark={bookmarks.toggleBookmark}
            isBelowAlert={priceAlerts?.enabled && station.price <= priceAlerts?.targetPrice}
          />
        ))}
      </div>
    </div>
  )
}

export default StationList
