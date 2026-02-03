import { AlertCircle, RefreshCw } from 'lucide-react'

function ErrorDisplay({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
      <h3 className="font-headline font-bold text-lg text-red-700 mb-2">{title}</h3>
      {message && <p className="text-red-600 text-sm mb-4">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorDisplay
