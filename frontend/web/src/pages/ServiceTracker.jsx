import { useState, useEffect } from 'react'
import { Wrench, Plus, Trash2, AlertTriangle, Clock, ChevronDown, ChevronUp, Edit3, Save } from 'lucide-react'

const STORAGE_KEY = 'berrima-service-tracker'

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : { vehicle: null, services: [] }
  } catch {
    return { vehicle: null, services: [] }
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const VEHICLE_PRESETS = [
  { name: 'Toyota LandCruiser 300', serviceKm: 10000, serviceMonths: 6 },
  { name: 'Toyota LandCruiser 200', serviceKm: 10000, serviceMonths: 6 },
  { name: 'Toyota LandCruiser 79', serviceKm: 10000, serviceMonths: 6 },
  { name: 'Toyota HiLux', serviceKm: 10000, serviceMonths: 6 },
  { name: 'Toyota Prado', serviceKm: 10000, serviceMonths: 6 },
  { name: 'Ford Ranger', serviceKm: 15000, serviceMonths: 12 },
  { name: 'Ford Everest', serviceKm: 15000, serviceMonths: 12 },
  { name: 'Nissan Patrol Y62', serviceKm: 10000, serviceMonths: 6 },
  { name: 'Nissan Navara', serviceKm: 10000, serviceMonths: 6 },
  { name: 'Isuzu D-MAX', serviceKm: 15000, serviceMonths: 12 },
  { name: 'Isuzu MU-X', serviceKm: 15000, serviceMonths: 12 },
  { name: 'Mitsubishi Triton', serviceKm: 15000, serviceMonths: 12 },
  { name: 'Mitsubishi Pajero Sport', serviceKm: 15000, serviceMonths: 12 },
  { name: 'Mazda BT-50', serviceKm: 15000, serviceMonths: 12 },
  { name: 'Custom Vehicle', serviceKm: 10000, serviceMonths: 6 },
]

const SERVICE_TYPES = [
  'Oil & Filter Change',
  'Full Service',
  'Transmission Service',
  'Differential Service',
  'Brake Pads/Rotors',
  'Air Filter',
  'Fuel Filter',
  'Coolant Flush',
  'Tyre Rotation',
  'New Tyres',
  'Wheel Alignment',
  'Battery Replacement',
  'Suspension Check',
  'Pre-Trip Inspection',
  'Other',
]

function ServiceTracker() {
  const [data, setData] = useState(loadData)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [showVehicleSetup, setShowVehicleSetup] = useState(!loadData().vehicle)
  const [expandedId, setExpandedId] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const [vehicleForm, setVehicleForm] = useState({
    name: data.vehicle?.name || '',
    currentOdometer: data.vehicle?.currentOdometer || '',
    serviceIntervalKm: data.vehicle?.serviceIntervalKm || 10000,
    serviceIntervalMonths: data.vehicle?.serviceIntervalMonths || 6,
  })

  const [serviceForm, setServiceForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Full Service',
    odometer: '',
    cost: '',
    workshop: '',
    notes: '',
  })

  useEffect(() => { saveData(data) }, [data])

  const handleSaveVehicle = () => {
    if (!vehicleForm.name || !vehicleForm.currentOdometer) return
    setData({
      ...data,
      vehicle: {
        name: vehicleForm.name,
        currentOdometer: parseFloat(vehicleForm.currentOdometer),
        serviceIntervalKm: parseInt(vehicleForm.serviceIntervalKm),
        serviceIntervalMonths: parseInt(vehicleForm.serviceIntervalMonths),
      },
    })
    setShowVehicleSetup(false)
  }

  const handlePreset = (preset) => {
    setVehicleForm({
      ...vehicleForm,
      name: preset.name === 'Custom Vehicle' ? vehicleForm.name : preset.name,
      serviceIntervalKm: preset.serviceKm,
      serviceIntervalMonths: preset.serviceMonths,
    })
  }

  const handleAddService = () => {
    if (!serviceForm.odometer) return

    const entry = {
      id: editingId || Date.now(),
      date: serviceForm.date,
      type: serviceForm.type,
      odometer: parseFloat(serviceForm.odometer),
      cost: serviceForm.cost ? parseFloat(serviceForm.cost) : null,
      workshop: serviceForm.workshop || null,
      notes: serviceForm.notes || null,
    }

    if (editingId) {
      setData({ ...data, services: data.services.map((s) => (s.id === editingId ? entry : s)) })
    } else {
      setData({ ...data, services: [entry, ...data.services] })
    }

    setServiceForm({ date: new Date().toISOString().split('T')[0], type: 'Full Service', odometer: '', cost: '', workshop: '', notes: '' })
    setEditingId(null)
    setShowServiceForm(false)
  }

  const handleEditService = (service) => {
    setServiceForm({
      date: service.date,
      type: service.type,
      odometer: service.odometer,
      cost: service.cost || '',
      workshop: service.workshop || '',
      notes: service.notes || '',
    })
    setEditingId(service.id)
    setShowServiceForm(true)
  }

  const handleDeleteService = (id) => {
    setData({ ...data, services: data.services.filter((s) => s.id !== id) })
    if (expandedId === id) setExpandedId(null)
  }

  // Calculate next service
  const lastService = data.services.length > 0
    ? [...data.services].sort((a, b) => b.odometer - a.odometer)[0]
    : null
  const currentOdo = data.vehicle?.currentOdometer || 0
  const intervalKm = data.vehicle?.serviceIntervalKm || 10000
  const intervalMonths = data.vehicle?.serviceIntervalMonths || 6

  const nextServiceKm = lastService ? lastService.odometer + intervalKm : currentOdo + intervalKm
  const kmUntilService = nextServiceKm - currentOdo

  const nextServiceDate = lastService
    ? new Date(new Date(lastService.date).getTime() + intervalMonths * 30.44 * 24 * 60 * 60 * 1000)
    : null
  const daysUntilService = nextServiceDate
    ? Math.round((nextServiceDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    : null

  const serviceOverdue = kmUntilService < 0 || (daysUntilService !== null && daysUntilService < 0)
  const serviceSoon = !serviceOverdue && (kmUntilService < 1000 || (daysUntilService !== null && daysUntilService < 30))

  const totalSpent = data.services.filter((s) => s.cost).reduce((sum, s) => sum + s.cost, 0)

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Vehicle Service Tracker
          </h1>
          <p className="text-brand-gray">
            Track service history and see when your next service is due.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Vehicle Setup */}
          {showVehicleSetup ? (
            <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
              <h3 className="font-headline text-lg font-bold text-brand-brown mb-4">Vehicle Setup</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {VEHICLE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handlePreset(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      vehicleForm.name === preset.name
                        ? 'bg-brand-yellow text-brand-navy border-brand-gold'
                        : 'bg-white text-brand-gray border-brand-tan hover:border-brand-ochre'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-brown mb-1">Vehicle Name</label>
                  <input
                    type="text"
                    value={vehicleForm.name}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                    placeholder="e.g. 2023 LandCruiser 300"
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-brown mb-1">Current Odometer (km)</label>
                  <input
                    type="number"
                    value={vehicleForm.currentOdometer}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, currentOdometer: e.target.value })}
                    placeholder="e.g. 45000"
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-brown mb-1">Service Interval (km)</label>
                    <input
                      type="number"
                      value={vehicleForm.serviceIntervalKm}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, serviceIntervalKm: e.target.value })}
                      className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-brown mb-1">Service Interval (months)</label>
                    <input
                      type="number"
                      value={vehicleForm.serviceIntervalMonths}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, serviceIntervalMonths: e.target.value })}
                      className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSaveVehicle}
                className="w-full mt-4 bg-brand-yellow hover:bg-brand-gold text-brand-navy px-4 py-2.5 rounded-lg font-bold text-sm transition-colors"
              >
                Save Vehicle
              </button>
            </div>
          ) : data.vehicle && (
            <>
              {/* Next Service Alert */}
              <div className={`rounded-xl shadow border-2 p-5 mb-6 ${
                serviceOverdue ? 'bg-red-50 border-red-300' :
                serviceSoon ? 'bg-yellow-50 border-yellow-300' :
                'bg-green-50 border-green-300'
              }`}>
                <div className="flex items-start gap-3">
                  {serviceOverdue ? (
                    <AlertTriangle size={24} className="text-red-500 flex-shrink-0" />
                  ) : (
                    <Clock size={24} className={`flex-shrink-0 ${serviceSoon ? 'text-yellow-600' : 'text-green-600'}`} />
                  )}
                  <div className="flex-1">
                    <h3 className="font-headline font-bold text-brand-brown">
                      {data.vehicle.name}
                    </h3>
                    <p className={`text-sm font-medium ${
                      serviceOverdue ? 'text-red-700' : serviceSoon ? 'text-yellow-700' : 'text-green-700'
                    }`}>
                      {serviceOverdue
                        ? 'Service Overdue!'
                        : serviceSoon
                        ? 'Service Due Soon'
                        : 'Service Up To Date'}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-brand-gray">
                      <span>Next at {nextServiceKm.toLocaleString()} km ({kmUntilService > 0 ? `${kmUntilService.toLocaleString()} km to go` : `${Math.abs(kmUntilService).toLocaleString()} km overdue`})</span>
                      {nextServiceDate && (
                        <span>
                          {daysUntilService > 0 ? `${daysUntilService} days to go` : `${Math.abs(daysUntilService)} days overdue`}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowVehicleSetup(true)}
                    className="text-xs text-brand-gray hover:text-brand-ochre transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              </div>

              {/* Stats */}
              {data.services.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-4 text-center">
                    <p className="text-2xl font-bold text-brand-brown">{data.services.length}</p>
                    <p className="text-xs text-brand-gray">Services</p>
                  </div>
                  <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-4 text-center">
                    <p className="text-2xl font-bold text-brand-brown">${Math.round(totalSpent).toLocaleString()}</p>
                    <p className="text-xs text-brand-gray">Total Spent</p>
                  </div>
                  <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-4 text-center">
                    <p className="text-2xl font-bold text-brand-brown">
                      {data.vehicle.currentOdometer.toLocaleString()}
                    </p>
                    <p className="text-xs text-brand-gray">Current km</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Add Service Button */}
          {data.vehicle && (
            <button
              onClick={() => { setEditingId(null); setShowServiceForm(!showServiceForm) }}
              className="w-full flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-gold text-brand-navy px-6 py-3 rounded-xl font-bold transition-colors mb-6 shadow"
            >
              <Plus size={20} />
              Log Service
            </button>
          )}

          {/* Service Form */}
          {showServiceForm && (
            <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
              <h3 className="font-headline text-lg font-bold text-brand-brown mb-4">
                {editingId ? 'Edit Service' : 'Log Service'}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-brown mb-1">Date</label>
                    <input
                      type="date"
                      value={serviceForm.date}
                      onChange={(e) => setServiceForm({ ...serviceForm, date: e.target.value })}
                      className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-brown mb-1">Service Type</label>
                    <select
                      value={serviceForm.type}
                      onChange={(e) => setServiceForm({ ...serviceForm, type: e.target.value })}
                      className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                    >
                      {SERVICE_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-brown mb-1">Odometer (km)</label>
                    <input
                      type="number"
                      value={serviceForm.odometer}
                      onChange={(e) => setServiceForm({ ...serviceForm, odometer: e.target.value })}
                      placeholder="e.g. 45000"
                      className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-brown mb-1">Cost ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={serviceForm.cost}
                      onChange={(e) => setServiceForm({ ...serviceForm, cost: e.target.value })}
                      placeholder="e.g. 350"
                      className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-brown mb-1">Workshop</label>
                  <input
                    type="text"
                    value={serviceForm.workshop}
                    onChange={(e) => setServiceForm({ ...serviceForm, workshop: e.target.value })}
                    placeholder="e.g. Berrima Diesel Service"
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-brown mb-1">Notes</label>
                  <textarea
                    value={serviceForm.notes}
                    onChange={(e) => setServiceForm({ ...serviceForm, notes: e.target.value })}
                    rows={2}
                    placeholder="Any notes about the service..."
                    className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm resize-y"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAddService}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-gold text-brand-navy px-4 py-2.5 rounded-lg font-bold text-sm transition-colors"
                >
                  <Save size={16} />
                  {editingId ? 'Update' : 'Save'}
                </button>
                <button
                  onClick={() => { setShowServiceForm(false); setEditingId(null) }}
                  className="px-4 py-2.5 bg-brand-cream border border-brand-tan rounded-lg text-sm text-brand-brown hover:bg-brand-tan/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Service History */}
          {data.services.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-headline text-lg font-bold text-brand-brown">Service History</h3>
              {[...data.services]
                .sort((a, b) => b.odometer - a.odometer)
                .map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl shadow border border-brand-tan/50 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Wrench size={16} className="text-brand-ochre" />
                        <div>
                          <h4 className="font-bold text-brand-brown">{service.type}</h4>
                          <p className="text-xs text-brand-gray">
                            {service.date} — {service.odometer.toLocaleString()} km
                            {service.cost && ` — $${service.cost.toFixed(2)}`}
                          </p>
                        </div>
                      </div>
                      {expandedId === service.id ? <ChevronUp size={16} className="text-brand-gray" /> : <ChevronDown size={16} className="text-brand-gray" />}
                    </button>

                    {expandedId === service.id && (
                      <div className="px-4 pb-4 border-t border-brand-tan/30">
                        {service.workshop && (
                          <p className="text-sm text-brand-gray mt-2">Workshop: {service.workshop}</p>
                        )}
                        {service.notes && (
                          <p className="text-sm text-brand-gray mt-1">{service.notes}</p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEditService(service)}
                            className="flex items-center gap-1 text-xs text-brand-gray hover:text-brand-ochre transition-colors"
                          >
                            <Edit3 size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
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
          )}

          {data.vehicle && data.services.length === 0 && !showServiceForm && (
            <div className="text-center py-12">
              <Wrench size={48} className="text-brand-tan mx-auto mb-3" />
              <p className="text-brand-gray mb-2">No services logged yet.</p>
              <p className="text-sm text-brand-gray/60">
                Log your first service to start tracking your vehicle's maintenance history.
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

export default ServiceTracker
