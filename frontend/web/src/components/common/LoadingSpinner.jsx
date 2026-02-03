import { Loader2 } from 'lucide-react'

function LoadingSpinner({ size = 'default', message = 'Loading...' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-brand-ochre`} />
      {message && <p className="text-brand-gray text-sm">{message}</p>}
    </div>
  )
}

export default LoadingSpinner
