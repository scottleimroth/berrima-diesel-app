import { useState } from 'react'
import { CheckSquare, Square, RotateCcw, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useChecklists } from '../hooks/useChecklists'

function Checklists() {
  const { checklists, toggleItem, resetChecklist, resetAll, addItem, removeItem, restoreDefaults } = useChecklists()
  const [expandedList, setExpandedList] = useState(checklists[0]?.id || null)
  const [newItemText, setNewItemText] = useState({})

  const getProgress = (checklist) => {
    const total = checklist.items.length
    const done = checklist.items.filter((i) => i.checked).length
    return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 }
  }

  const totalProgress = checklists.reduce(
    (acc, cl) => {
      const p = getProgress(cl)
      return { total: acc.total + p.total, done: acc.done + p.done }
    },
    { total: 0, done: 0 }
  )
  const overallPercent = totalProgress.total > 0 ? Math.round((totalProgress.done / totalProgress.total) * 100) : 0

  const handleAddItem = (checklistId) => {
    const text = newItemText[checklistId]?.trim()
    if (!text) return
    addItem(checklistId, text)
    setNewItemText((prev) => ({ ...prev, [checklistId]: '' }))
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Page Header */}
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Pre-Trip Checklists
          </h1>
          <p className="text-brand-gray">
            Never forget a thing. Check off items as you go — progress is saved automatically.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Overall Progress */}
          <div className="bg-white rounded-xl shadow-lg border border-brand-tan/50 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-headline text-xl font-bold text-brand-brown">Overall Progress</h2>
              <span className="text-sm text-brand-gray">
                {totalProgress.done} / {totalProgress.total} items
              </span>
            </div>
            <div className="w-full bg-brand-tan/30 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  overallPercent === 100 ? 'bg-brand-eucalyptus' : 'bg-brand-yellow'
                }`}
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <p className="text-sm text-brand-gray mt-2 text-center">
              {overallPercent === 100 ? 'All done — ready to hit the road!' : `${overallPercent}% complete`}
            </p>
          </div>

          {/* Checklists */}
          {checklists.map((checklist) => {
            const progress = getProgress(checklist)
            const isExpanded = expandedList === checklist.id

            return (
              <div key={checklist.id} className="bg-white rounded-xl shadow border border-brand-tan/50 overflow-hidden">
                <button
                  onClick={() => setExpandedList(isExpanded ? null : checklist.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-brand-cream/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                        progress.percent === 100 ? 'bg-brand-eucalyptus' : 'bg-brand-ochre'
                      }`}
                    >
                      {progress.percent}%
                    </div>
                    <div className="text-left">
                      <h3 className="font-headline text-lg font-bold text-brand-brown">{checklist.name}</h3>
                      <p className="text-xs text-brand-gray">
                        {progress.done} / {progress.total} items
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-brand-gray" />
                  ) : (
                    <ChevronDown size={20} className="text-brand-gray" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-brand-tan/30">
                    <ul className="divide-y divide-brand-tan/20">
                      {checklist.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-brand-cream/30 transition-colors group"
                        >
                          <button
                            onClick={() => toggleItem(checklist.id, item.id)}
                            className="flex-shrink-0"
                          >
                            {item.checked ? (
                              <CheckSquare size={22} className="text-brand-eucalyptus" />
                            ) : (
                              <Square size={22} className="text-brand-tan" />
                            )}
                          </button>
                          <span
                            className={`flex-1 text-sm ${
                              item.checked ? 'line-through text-brand-gray/50' : 'text-brand-brown'
                            }`}
                          >
                            {item.text}
                          </span>
                          {item.id.startsWith('custom-') && (
                            <button
                              onClick={() => removeItem(checklist.id, item.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>

                    {/* Add Custom Item */}
                    <div className="px-5 py-3 border-t border-brand-tan/30 flex gap-2">
                      <input
                        type="text"
                        value={newItemText[checklist.id] || ''}
                        onChange={(e) =>
                          setNewItemText((prev) => ({ ...prev, [checklist.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddItem(checklist.id)
                        }}
                        placeholder="Add custom item..."
                        className="flex-1 border border-brand-tan rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                      />
                      <button
                        onClick={() => handleAddItem(checklist.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-brand-yellow text-brand-navy rounded-lg text-sm font-medium hover:bg-brand-gold transition-colors"
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    </div>

                    {/* Reset This List */}
                    <div className="px-5 py-2 border-t border-brand-tan/30">
                      <button
                        onClick={() => resetChecklist(checklist.id)}
                        className="flex items-center gap-1 text-xs text-brand-gray hover:text-brand-brown transition-colors"
                      >
                        <RotateCcw size={12} />
                        Reset this checklist
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={resetAll}
              className="flex items-center gap-2 text-sm text-brand-gray hover:text-brand-brown transition-colors"
            >
              <RotateCcw size={14} />
              Reset all checklists
            </button>
            <span className="text-brand-tan">|</span>
            <button
              onClick={restoreDefaults}
              className="text-sm text-brand-gray hover:text-brand-brown transition-colors"
            >
              Restore defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checklists
