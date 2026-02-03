import { useState } from 'react'
import { Caravan, Save, Trash2, RotateCcw } from 'lucide-react'

function VehicleForm({
  profile,
  presets,
  savedProfiles,
  onUpdateProfile,
  onLoadPreset,
  onSaveProfile,
  onLoadSavedProfile,
  onDeleteProfile,
}) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [profileName, setProfileName] = useState('')

  const handleSave = () => {
    if (profileName.trim()) {
      onSaveProfile(profileName.trim())
      setProfileName('')
      setSaveDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Preset Selection */}
      <div>
        <label className="block text-sm font-medium text-brand-brown mb-2">
          Vehicle Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(presets).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => onLoadPreset(key)}
              className="px-3 py-2 text-sm bg-brand-yellow/20 hover:bg-brand-yellow/40 border border-brand-yellow/30 rounded-lg text-left transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Profiles */}
      {Object.keys(savedProfiles).length > 0 && (
        <div>
          <label className="block text-sm font-medium text-brand-brown mb-2">
            My Saved Rigs
          </label>
          <div className="space-y-2">
            {Object.entries(savedProfiles).map(([key, saved]) => (
              <div
                key={key}
                className="flex items-center justify-between px-3 py-2 bg-brand-light rounded-lg border border-brand-yellow/30"
              >
                <button
                  onClick={() => onLoadSavedProfile(key)}
                  className="text-sm font-medium text-brand-dark hover:text-brand-navy"
                >
                  {saved.name}
                </button>
                <button
                  onClick={() => onDeleteProfile(key)}
                  className="text-brand-gray hover:text-brand-ochre"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Profile Display */}
      <div className="bg-brand-yellow/20 border border-brand-yellow rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Caravan size={18} className="text-brand-navy" />
          <span className="font-medium">{profile.name || 'Custom Setup'}</span>
        </div>
        <div className="text-sm text-brand-gray">
          {(profile.height / 100).toFixed(1)}m H × {(profile.width / 100).toFixed(1)}m W × {(profile.length / 100).toFixed(1)}m L | {(profile.grossWeight / 1000).toFixed(1)}t
        </div>
      </div>

      {/* Dimensions */}
      <div>
        <h4 className="font-medium text-brand-brown mb-3">Dimensions (Total Rig)</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-brand-gray mb-1">Height (cm)</label>
            <input
              type="number"
              value={profile.height}
              onChange={(e) => onUpdateProfile({ height: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-brand-tan rounded-lg text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          <div>
            <label className="block text-xs text-brand-gray mb-1">Width (cm)</label>
            <input
              type="number"
              value={profile.width}
              onChange={(e) => onUpdateProfile({ width: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-brand-tan rounded-lg text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          <div>
            <label className="block text-xs text-brand-gray mb-1">Total Length (cm)</label>
            <input
              type="number"
              value={profile.length}
              onChange={(e) => onUpdateProfile({ length: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-brand-tan rounded-lg text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          <div>
            <label className="block text-xs text-brand-gray mb-1">Total Weight (kg)</label>
            <input
              type="number"
              value={profile.grossWeight}
              onChange={(e) => onUpdateProfile({ grossWeight: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-brand-tan rounded-lg text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
        </div>
        <p className="text-xs text-brand-gray mt-2">
          Include vehicle + trailer/caravan combined measurements
        </p>
      </div>

      {/* Vehicle Configuration */}
      <div>
        <h4 className="font-medium text-brand-brown mb-3">Configuration</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-brand-gray mb-1">Total Axles</label>
            <input
              type="number"
              value={profile.axleCount}
              onChange={(e) => onUpdateProfile({ axleCount: parseInt(e.target.value) || 0 })}
              min="2"
              max="6"
              className="w-full px-3 py-2 border border-brand-tan rounded-lg text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          <div>
            <label className="block text-xs text-brand-gray mb-1">Towing</label>
            <select
              value={profile.trailersCount}
              onChange={(e) => onUpdateProfile({ trailersCount: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-brand-tan rounded-lg text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            >
              <option value={0}>No trailer</option>
              <option value={1}>Towing caravan/trailer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-brand-tan/30">
        {saveDialogOpen ? (
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="My rig name..."
              className="flex-1 px-3 py-2 border border-brand-tan rounded-lg text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-brand-brown text-white rounded-lg text-sm font-medium hover:bg-brand-ochre"
            >
              Save
            </button>
            <button
              onClick={() => setSaveDialogOpen(false)}
              className="px-4 py-2 bg-brand-tan/30 text-brand-brown rounded-lg text-sm font-medium hover:bg-brand-tan/50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setSaveDialogOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-brown text-white rounded-lg text-sm font-medium hover:bg-brand-ochre"
            >
              <Save size={16} />
              Save My Rig
            </button>
            <button
              onClick={() => onLoadPreset('4wd-caravan')}
              className="px-4 py-2 bg-brand-tan/30 text-brand-brown rounded-lg text-sm font-medium hover:bg-brand-tan/50"
              title="Reset to default"
            >
              <RotateCcw size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default VehicleForm
