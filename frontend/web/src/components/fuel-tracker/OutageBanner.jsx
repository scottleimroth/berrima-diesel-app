import { AlertTriangle } from 'lucide-react'

function OutageBanner({ outage }) {
  if (!outage) return null

  const fuelTypes = outage.fuelTypes?.join(', ')?.toUpperCase() || 'FUEL'
  const reportedAt = outage.lastConfirmed ? new Date(outage.lastConfirmed) : null
  const hoursAgo = reportedAt
    ? Math.floor((Date.now() - reportedAt.getTime()) / 3600000)
    : null

  const confidenceLabel = {
    high: 'Multiple reports',
    medium: 'Single report',
    low: 'Unconfirmed report',
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-2">
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-red-700">
            REPORTED OUT OF {fuelTypes}
          </p>
          <p className="text-xs text-red-600">
            {hoursAgo !== null && hoursAgo < 1
              ? 'Reported less than 1 hour ago'
              : hoursAgo !== null
              ? `Reported ${hoursAgo}h ago`
              : 'Recently reported'}
            {' via community reports'}
            {outage.confidence && ` (${confidenceLabel[outage.confidence] || outage.confidence})`}
          </p>
        </div>
      </div>
    </div>
  )
}

export default OutageBanner
