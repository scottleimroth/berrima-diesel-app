import { useState } from 'react'
import { Route, Trash2, Edit2, Check, X, MapPin } from 'lucide-react'

function SavedRoutesPanel({ savedRoutes, onLoadRoute, onDeleteRoute, onRenameRoute }) {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const handleStartEdit = (route) => {
    setEditingId(route.id)
    setEditName(route.name)
  }

  const handleSaveEdit = (routeId) => {
    if (editName.trim()) {
      onRenameRoute(routeId, editName.trim())
    }
    setEditingId(null)
    setEditName('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  if (!savedRoutes || savedRoutes.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-brand-tan/50">
      <div className="bg-brand-eucalyptus text-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Route size={20} />
          <h3 className="font-bold">Saved Routes</h3>
        </div>
        <p className="text-sm text-white/80 mt-1">
          {savedRoutes.length} saved route{savedRoutes.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="divide-y divide-brand-tan/30 max-h-[300px] overflow-y-auto">
        {savedRoutes.map((route) => (
          <div key={route.id} className="p-3 hover:bg-brand-cream/50">
            {editingId === route.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-2 py-1 border border-brand-tan rounded text-sm text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-eucalyptus"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveEdit(route.id)}
                  className="p-1 text-success hover:bg-success/10 rounded"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 text-brand-gray hover:bg-brand-tan/30 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => onLoadRoute(route)}
                    className="flex-1 text-left group"
                  >
                    <div className="font-medium text-brand-brown group-hover:text-brand-eucalyptus transition-colors">
                      {route.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-brand-gray mt-1">
                      <MapPin size={10} />
                      <span className="truncate">{route.origin.title}</span>
                      <span>→</span>
                      <span className="truncate">{route.destination.title}</span>
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(route)}
                      className="p-1 text-brand-gray hover:text-brand-ochre hover:bg-brand-tan/30 rounded"
                      title="Rename"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteRoute(route.id)}
                      className="p-1 text-brand-gray hover:text-red-500 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-brand-gray mt-1">
                  Saved {new Date(route.createdAt).toLocaleDateString()}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavedRoutesPanel
