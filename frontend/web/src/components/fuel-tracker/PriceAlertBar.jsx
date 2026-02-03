import { Bell, BellOff, TrendingDown } from 'lucide-react'

function PriceAlertBar({ alerts, onToggle, onPriceChange, alertCount }) {
  return (
    <div className="bg-white border border-brand-tan/50 rounded-lg p-4 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Alert Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              alerts.enabled
                ? 'bg-success text-white'
                : 'bg-brand-tan/30 text-brand-gray hover:bg-brand-tan/50'
            }`}
          >
            {alerts.enabled ? <Bell size={18} /> : <BellOff size={18} />}
            Price Alert {alerts.enabled ? 'On' : 'Off'}
          </button>

          {alerts.enabled && alertCount > 0 && (
            <div className="flex items-center gap-2 text-success font-medium">
              <TrendingDown size={18} />
              <span>{alertCount} station{alertCount !== 1 ? 's' : ''} below target!</span>
            </div>
          )}
        </div>

        {/* Target Price Input */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-brand-gray">Alert when below:</label>
          <div className="flex items-center">
            <input
              type="number"
              value={alerts.targetPrice}
              onChange={(e) => onPriceChange(parseFloat(e.target.value) || 0)}
              min="100"
              max="300"
              step="1"
              className="w-20 px-3 py-2 border border-brand-tan rounded-l-lg text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-ochre text-right"
            />
            <span className="px-3 py-2 bg-brand-tan/30 border border-l-0 border-brand-tan rounded-r-lg text-sm text-brand-gray">
              c/L
            </span>
          </div>
        </div>
      </div>

      {alerts.enabled && (
        <p className="text-xs text-brand-gray mt-3">
          Stations at or below {alerts.targetPrice.toFixed(1)}c/L will be highlighted in green.
        </p>
      )}
    </div>
  )
}

export default PriceAlertBar
