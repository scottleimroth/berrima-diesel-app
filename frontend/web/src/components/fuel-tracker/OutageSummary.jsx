import { AlertTriangle, Info } from 'lucide-react'

function OutageSummary({ summary, minutesAgo, isStale, stationCount }) {
  if (!summary || summary.totalOutages === 0) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-bold text-red-700">
            Fuel Crisis: {summary.totalOutages} stations reported out of fuel
          </p>
          {stationCount > 0 && (
            <p className="text-xs text-red-600 mt-1">
              {stationCount} station{stationCount !== 1 ? 's' : ''} in your search area affected
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Info size={12} className="text-red-400" />
            <p className="text-xs text-red-500">
              {minutesAgo !== null
                ? `Outage reports updated ${minutesAgo < 60 ? `${minutesAgo} minutes` : `${Math.floor(minutesAgo / 60)}h ${minutesAgo % 60}m`} ago`
                : 'No outage data available yet'}
              {isStale && ' — data may be outdated'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OutageSummary
