import { useState, useEffect } from 'react'
import { BookOpen, Plus, Trash2, Edit3, Save, X, MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react'

const STORAGE_KEY = 'berrima-trip-journal'

function loadJournal() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveJournal(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function TripJournal() {
  const [entries, setEntries] = useState(loadJournal)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    location: '',
    notes: '',
    rating: 5,
    tags: '',
    odometerStart: '',
    odometerEnd: '',
  })

  useEffect(() => { saveJournal(entries) }, [entries])

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      title: '',
      location: '',
      notes: '',
      rating: 5,
      tags: '',
      odometerStart: '',
      odometerEnd: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSave = () => {
    if (!form.title.trim()) return

    const entry = {
      id: editingId || Date.now(),
      date: form.date,
      title: form.title.trim(),
      location: form.location.trim() || null,
      notes: form.notes.trim() || null,
      rating: parseInt(form.rating),
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      odometerStart: form.odometerStart ? parseFloat(form.odometerStart) : null,
      odometerEnd: form.odometerEnd ? parseFloat(form.odometerEnd) : null,
    }

    if (editingId) {
      setEntries(entries.map((e) => (e.id === editingId ? entry : e)))
    } else {
      setEntries([entry, ...entries])
    }
    resetForm()
  }

  const handleEdit = (entry) => {
    setForm({
      date: entry.date,
      title: entry.title,
      location: entry.location || '',
      notes: entry.notes || '',
      rating: entry.rating,
      tags: entry.tags ? entry.tags.join(', ') : '',
      odometerStart: entry.odometerStart || '',
      odometerEnd: entry.odometerEnd || '',
    })
    setEditingId(entry.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setEntries(entries.filter((e) => e.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const totalKm = entries.reduce((sum, e) => {
    if (e.odometerStart && e.odometerEnd) return sum + (e.odometerEnd - e.odometerStart)
    return sum
  }, 0)

  const allTags = [...new Set(entries.flatMap((e) => e.tags || []))]

  const stars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-brand-yellow' : 'text-brand-tan/50'}>
        ★
      </span>
    ))
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Trip Journal
          </h1>
          <p className="text-brand-gray">
            Record your travels, favourite camps, and road notes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Stats */}
          {entries.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-4 text-center">
                <p className="text-2xl font-bold text-brand-brown">{entries.length}</p>
                <p className="text-xs text-brand-gray">Entries</p>
              </div>
              <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-4 text-center">
                <p className="text-2xl font-bold text-brand-brown">{totalKm.toLocaleString()}</p>
                <p className="text-xs text-brand-gray">km Logged</p>
              </div>
              <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-4 text-center">
                <p className="text-2xl font-bold text-brand-brown">{allTags.length}</p>
                <p className="text-xs text-brand-gray">Tags</p>
              </div>
            </div>
          )}

          {/* Add Entry Button */}
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="w-full flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-gold text-brand-navy px-6 py-3 rounded-xl font-bold transition-colors mb-6 shadow"
          >
            <Plus size={20} />
            New Journal Entry
          </button>

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
              <h3 className="font-headline text-lg font-bold text-brand-brown mb-4">
                {editingId ? 'Edit Entry' : 'New Entry'}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-brown mb-1">Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-brown mb-1">Rating</label>
                    <select
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: e.target.value })}
                      className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                    >
                      <option value={5}>★★★★★ Excellent</option>
                      <option value={4}>★★★★☆ Great</option>
                      <option value={3}>★★★☆☆ Good</option>
                      <option value={2}>★★☆☆☆ Fair</option>
                      <option value={1}>★☆☆☆☆ Poor</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-brown mb-1">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Cape York Day 3 — Bamaga to Tip"
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-brown mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Cape York, QLD"
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-brown mb-1">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={4}
                    placeholder="Road conditions, highlights, things to remember..."
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm resize-y"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-brown mb-1">Odometer Start</label>
                    <input
                      type="number"
                      value={form.odometerStart}
                      onChange={(e) => setForm({ ...form, odometerStart: e.target.value })}
                      placeholder="km"
                      className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-brown mb-1">Odometer End</label>
                    <input
                      type="number"
                      value={form.odometerEnd}
                      onChange={(e) => setForm({ ...form, odometerEnd: e.target.value })}
                      placeholder="km"
                      className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-brown mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="e.g. 4WD, camping, beach, fishing"
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-gold text-brand-navy px-4 py-2.5 rounded-lg font-bold text-sm transition-colors"
                >
                  <Save size={16} />
                  {editingId ? 'Update' : 'Save'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2.5 bg-brand-cream border border-brand-tan rounded-lg text-sm text-brand-brown hover:bg-brand-tan/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Entries */}
          <div className="space-y-3">
            {entries
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl shadow border border-brand-tan/50 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-headline text-lg font-bold text-brand-brown">{entry.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-brand-gray">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {entry.date}
                        </span>
                        {entry.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {entry.location}
                          </span>
                        )}
                        <span className="text-xs">{stars(entry.rating)}</span>
                      </div>
                    </div>
                    {expandedId === entry.id ? <ChevronUp size={16} className="text-brand-gray" /> : <ChevronDown size={16} className="text-brand-gray" />}
                  </button>

                  {expandedId === entry.id && (
                    <div className="px-4 pb-4 border-t border-brand-tan/30">
                      {entry.notes && (
                        <p className="text-sm text-brand-gray mt-3 whitespace-pre-wrap">{entry.notes}</p>
                      )}
                      {entry.odometerStart && entry.odometerEnd && (
                        <p className="text-xs text-brand-gray/60 mt-2">
                          Distance: {(entry.odometerEnd - entry.odometerStart).toLocaleString()} km
                          ({entry.odometerStart.toLocaleString()} → {entry.odometerEnd.toLocaleString()})
                        </p>
                      )}
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {entry.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-brand-cream text-brand-brown px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="flex items-center gap-1 text-xs text-brand-gray hover:text-brand-ochre transition-colors"
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="flex items-center gap-1 text-xs text-brand-gray hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {entries.length === 0 && !showForm && (
            <div className="text-center py-12">
              <BookOpen size={48} className="text-brand-tan mx-auto mb-3" />
              <p className="text-brand-gray mb-2">No journal entries yet.</p>
              <p className="text-sm text-brand-gray/60">
                Start recording your travels — log road conditions, favourite spots, and trip memories.
              </p>
            </div>
          )}

          <p className="text-xs text-brand-gray/70 text-center mt-8">
            Data stored locally on your device. Not synced across devices.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TripJournal
