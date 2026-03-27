import { AlertTriangle, Clock } from 'lucide-react'

function StaleWarning({ staleStatus }) {
  if (!staleStatus || staleStatus.status === 'fresh') return null

  const isWarning = staleStatus.status === 'warning'
  const bgColor = isWarning ? 'bg-amber-50' : 'bg-red-50'
  const borderColor = isWarning ? 'border-amber-200' : 'border-red-200'
  const textColor = isWarning ? 'text-amber-700' : 'text-red-700'
  const iconColor = isWarning ? 'text-amber-500' : 'text-red-500'

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg px-3 py-2 mb-2`}>
      <div className="flex items-start gap-2">
        <Clock size={14} className={`${iconColor} flex-shrink-0 mt-0.5`} />
        <p className={`text-xs ${textColor}`}>
          {staleStatus.message}
        </p>
      </div>
    </div>
  )
}

export default StaleWarning
