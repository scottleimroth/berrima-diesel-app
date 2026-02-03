import {
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  CornerUpLeft,
  CornerUpRight,
  Navigation,
  Flag,
  Circle,
} from 'lucide-react'
import { formatDuration, formatDistance } from '../../utils/formatters'

// Map direction codes to icons
const getDirectionIcon = (direction) => {
  switch (direction?.toLowerCase()) {
    case 'left':
    case 'sharpLeft':
    case 'slightLeft':
      return ArrowLeft
    case 'right':
    case 'sharpRight':
    case 'slightRight':
      return ArrowRight
    case 'uturnLeft':
      return CornerUpLeft
    case 'uturnRight':
      return CornerUpRight
    case 'straight':
    case 'continue':
      return ArrowUp
    case 'arrive':
      return Flag
    case 'leave':
    case 'depart':
      return Navigation
    default:
      return Circle
  }
}

function DirectionsList({ instructions }) {
  if (!instructions || instructions.length === 0) {
    return null
  }

  return (
    <div>
      <h4 className="font-medium text-brand-brown mb-3">Turn-by-Turn Directions</h4>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {instructions.map((instruction, index) => {
          const Icon = getDirectionIcon(instruction.direction)
          const isFirst = index === 0
          const isLast = index === instructions.length - 1

          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                isFirst
                  ? 'bg-success/10 border border-success/20'
                  : isLast
                  ? 'bg-brand-ochre/10 border border-brand-ochre/20'
                  : 'bg-brand-cream'
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isFirst
                    ? 'bg-success text-white'
                    : isLast
                    ? 'bg-brand-ochre text-white'
                    : 'bg-brand-tan/50 text-brand-brown'
                }`}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-brand-dark">{instruction.instruction}</p>
                {(instruction.length > 0 || instruction.duration > 0) && (
                  <div className="flex items-center gap-3 mt-1 text-xs text-brand-gray">
                    {instruction.length > 0 && (
                      <span>{formatDistance(instruction.length / 1000)}</span>
                    )}
                    {instruction.duration > 0 && (
                      <span>{formatDuration(instruction.duration)}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 text-sm text-brand-gray font-mono">
                {index + 1}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DirectionsList
