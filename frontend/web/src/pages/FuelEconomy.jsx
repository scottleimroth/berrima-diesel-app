import { useState, useEffect } from 'react'
import { Fuel, Plus, Trash2, TrendingDown, TrendingUp, BarChart3 } from 'lucide-react'

const STORAGE_KEY = 'berrima-fuel-log'

function loadLog() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveLog(log) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log))
}

function FuelEconomy() {
  const [log, setLog] = useState(loadLog)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    odometer: '',
    litres: '',
    cost: '',
    station: '',
    fullTank: true,
  })

  useEffect(() => { saveLog(log) }, [log])

  const handleAdd = () => {
    if (!form.odometer || !form.litres) return

    const entry = {
      id: Date.now(),
      date: form.date,
      odometer: parseFloat(form.odometer),
      litres: parseFloat(form.litres),
      cost: form.cost ? parseFloat(form.cost) : null,
      station: form.station || null,
      fullTank: form.fullTank,
    }

    const newLog = [...log, entry].sort((a, b) => a.odometer - b.odometer)
    setLog(newLog)
    setForm({ date: new Date().toISOString().split('T')[0], odometer: '', litres: '', cost: '', station: '', fullTank: true })
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setLog(log.filter((e) => e.id !== id))
  }

  // Calculate economy between consecutive full-tank entries
  const entries = log.filter((e) => e.fullTank)
  const fillUps = []
  for (let i = 1; i < entries.length; i++) {
    const km = entries[i].odometer - entries[i - 1].odometer
    if (km > 0) {
      const lPer100 = (entries[i].litres / km) * 100
      const costPerKm = entries[i].cost ? entries[i].cost / km : null
      fillUps.push({
        ...entries[i],
        km,
        lPer100: Math.round(lPer100 * 10) / 10,
        costPerKm: costPerKm ? Math.round(costPerKm * 100) / 100 : null,
      })
    }
  }

  const avgEconomy = fillUps.length > 0
    ? Math.round((fillUps.reduce((sum, f) => sum + f.lPer100, 0) / fillUps.length) * 10) / 10
    : null
  const bestEconomy = fillUps.length > 0 ? Math.min(...fillUps.map((f) => f.lPer100)) : null
  const worstEconomy = fillUps.length > 0 ? Math.max(...fillUps.map((f) => f.lPer100)) : null
  const totalKm = fillUps.length > 0 ? fillUps.reduce((sum, f) => sum + f.km, 0) : 0
  const totalLitres = fillUps.length > 0 ? fillUps.reduce((sum, f) => sum + f.litres, 0) : 0
  const totalCost = log.filter((e) => e.cost).reduce((sum, e) => sum + e.cost, 0)

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Fuel Economy Tracker
          </h1>
          <p className="text-brand-gray">
            Log fill-ups to track your diesel consumption and costs over time.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Stats Cards */}
          {fillUps.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-4 text-center">
                <BarChart3 size={20} className="text-brand-ochre mx-auto mb-1" />
                <p className="text-2xl font-bold text-brand-brown">{avgEconomy}</p>
                <p className="text-xs text-brand-gray">Avg L/100km</p>
              </div>
              <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-4 text-center">
                <TrendingDown size={20} className="text-green-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-600">{bestEconomy}</p>
                <p className="text-xs text-brand-gray">Best L/100km</p>
              </div>
              <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-4 text-center">
                <TrendingUp size={20} className="text-red-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-500">{worstEconomy}</p>
                <p className="text-xs text-brand-gray">Worst L/100km</p>
              </div>
              <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-4 text-center">
                <Fuel size={20} className="text-brand-navy mx-auto mb-1" />
                <p className="text-2xl font-bold text-brand-brown">${Math.round(totalCost)}</p>
                <p className="text-xs text-brand-gray">Total Spent</p>
              </div>
            </div>
          )}

          {fillUps.length > 0 && (
            <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-4 mb-6">
              <p className="text-sm text-brand-gray">
                <span className="font-medium text-brand-brown">{totalKm.toLocaleString()} km</span> tracked across{' '}
                <span className="font-medium text-brand-brown">{fillUps.length} fill-ups</span> using{' '}
                <span className="font-medium text-brand-brown">{Math.round(totalLitres)} litres</span>
              </p>
            </div>
          )}

          {/* Add Entry Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-gold text-brand-navy px-6 py-3 rounded-xl font-bold transition-colors mb-6 shadow"
          >
            <Plus size={20} />
            Log Fill-Up
          </button>

          {/* Add Entry Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
              <h3 className="font-headline text-lg font-bold text-brand-brown mb-4">New Fill-Up</h3>
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
                  <label className="block text-sm font-medium text-brand-brown mb-1">Odometer (km)</label>
                  <input
                    type="number"
                    value={form.odometer}
                    onChange={(e) => setForm({ ...form, odometer: e.target.value })}
                    placeholder="e.g. 85420"
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-brown mb-1">Litres</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.litres}
                    onChange={(e) => setForm({ ...form, litres: e.target.value })}
                    placeholder="e.g. 72.5"
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-brown mb-1">Total Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: e.target.value })}
                    placeholder="e.g. 125.50"
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-brown mb-1">Station (optional)</label>
                  <input
                    type="text"
                    value={form.station}
                    onChange={(e) => setForm({ ...form, station: e.target.value })}
                    placeholder="e.g. Shell Berrima"
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 pb-2">
                    <input
                      type="checkbox"
                      checked={form.fullTank}
                      onChange={(e) => setForm({ ...form, fullTank: e.target.checked })}
                      className="rounded border-brand-tan text-brand-ochre focus:ring-brand-yellow"
                    />
                    <span className="text-sm text-brand-brown">Full tank fill</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-brand-yellow hover:bg-brand-gold text-brand-navy px-4 py-2.5 rounded-lg font-bold text-sm transition-colors"
                >
                  Save Entry
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 bg-brand-cream border border-brand-tan rounded-lg text-sm text-brand-brown hover:bg-brand-tan/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-brand-gray/60 mt-3">
                Economy is calculated between consecutive full-tank fill-ups. Partial fills are logged but excluded from calculations.
              </p>
            </div>
          )}

          {/* Economy History */}
          {fillUps.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="font-headline text-lg font-bold text-brand-brown">Fill-Up History</h3>
              {[...fillUps].reverse().map((f) => (
                <div
                  key={f.id}
                  className="bg-white rounded-xl shadow border border-brand-tan/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xl font-bold ${
                          f.lPer100 <= (avgEconomy || 0) ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {f.lPer100} L/100km
                        </span>
                        <span className="text-sm text-brand-gray">{f.km} km</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-brand-gray mt-1">
                        <span>{f.date}</span>
                        <span>{f.litres}L</span>
                        {f.cost && <span>${f.cost.toFixed(2)}</span>}
                        {f.costPerKm && <span>${f.costPerKm}/km</span>}
                        {f.station && <span>{f.station}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full Log */}
          {log.length > 0 && (
            <div className="mb-6">
              <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">All Entries</h3>
              <div className="bg-white rounded-xl shadow border border-brand-tan/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-brand-cream border-b border-brand-tan/50">
                        <th className="text-left px-4 py-2 text-brand-brown font-medium">Date</th>
                        <th className="text-right px-4 py-2 text-brand-brown font-medium">Odo</th>
                        <th className="text-right px-4 py-2 text-brand-brown font-medium">Litres</th>
                        <th className="text-right px-4 py-2 text-brand-brown font-medium">Cost</th>
                        <th className="text-center px-4 py-2 text-brand-brown font-medium">Full</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...log].reverse().map((entry) => (
                        <tr key={entry.id} className="border-b border-brand-tan/30 last:border-0">
                          <td className="px-4 py-2 text-brand-gray">{entry.date}</td>
                          <td className="px-4 py-2 text-right text-brand-gray">{entry.odometer.toLocaleString()}</td>
                          <td className="px-4 py-2 text-right text-brand-gray">{entry.litres}</td>
                          <td className="px-4 py-2 text-right text-brand-gray">
                            {entry.cost ? `$${entry.cost.toFixed(2)}` : '-'}
                          </td>
                          <td className="px-4 py-2 text-center text-brand-gray">{entry.fullTank ? 'Yes' : 'No'}</td>
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="text-brand-gray/40 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {log.length === 0 && !showForm && (
            <div className="text-center py-12">
              <Fuel size={48} className="text-brand-tan mx-auto mb-3" />
              <p className="text-brand-gray mb-2">No fill-ups logged yet.</p>
              <p className="text-sm text-brand-gray/60">
                Tap "Log Fill-Up" to start tracking your diesel economy. You'll need at least 2 full-tank
                fill-ups to calculate L/100km.
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

export default FuelEconomy
