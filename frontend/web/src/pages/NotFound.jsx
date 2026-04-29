import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-brand-navy mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-brand-brown mb-4">Page Not Found</h2>
        <p className="text-brand-brown/80 mb-8">
          Sorry, the page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Link
          to="/"
          className="inline-block bg-brand-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-brown transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
