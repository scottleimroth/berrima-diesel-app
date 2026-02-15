import { useState } from 'react'
import { Sun, Battery, Zap, Info } from 'lucide-react'

const PANEL_PRESETS = [
  { name: '100W Portable', watts: 100 },
  { name: '160W Portable', watts: 160 },
  { name: '200W Portable', watts: 200 },
  { name: '200W Roof Mount', watts: 200 },
  { name: '300W Roof Mount', watts: 300 },
  { name: '400W Roof Mount', watts: 400 },
  { name: '2x 200W (400W)', watts: 400 },
  { name: '3x 200W (600W)', watts: 600 },
]

const BATTERY_PRESETS = [
  { name: '100Ah Lithium (12V)', wh: 1200 },
  { name: '120Ah Lithium (12V)', wh: 1440 },
  { name: '200Ah Lithium (12V)', wh: 2400 },
  { name: '300Ah Lithium (12V)', wh: 3600 },
  { name: '100Ah AGM (12V)', wh: 600 },
  { name: '120Ah AGM (12V)', wh: 720 },
  { name: '200Ah AGM (12V)', wh: 1000 },
]

const COMMON_LOADS = [
  { name: 'LED Lights', watts: 10, hours: 5 },
  { name: 'Phone Charger', watts: 15, hours: 3 },
  { name: 'Laptop', watts: 60, hours: 4 },
  { name: '12V Fridge (40L)', watts: 35, hours: 24 },
  { name: '12V Fridge (65L)', watts: 45, hours: 24 },
  { name: '12V Fridge (80L)', watts: 55, hours: 24 },
  { name: 'Starlink', watts: 50, hours: 8 },
  { name: 'CPAP Machine', watts: 30, hours: 8 },
  { name: 'Water Pump', watts: 60, hours: 0.5 },
  { name: 'Diesel Heater', watts: 15, hours: 8 },
  { name: 'Fan', watts: 20, hours: 6 },
  { name: 'TV (12V)', watts: 40, hours: 3 },
]

// Average peak sun hours by Australian region (annual average)
const SUN_HOURS = [
  { region: 'Far North QLD (Cairns)', hours: 5.5 },
  { region: 'North QLD (Townsville)', hours: 5.8 },
  { region: 'Central QLD (Rockhampton)', hours: 5.5 },
  { region: 'SE QLD / Brisbane', hours: 5.2 },
  { region: 'Northern NSW', hours: 5.0 },
  { region: 'Sydney / Central NSW', hours: 4.6 },
  { region: 'Southern NSW / ACT', hours: 4.5 },
  { region: 'Melbourne / VIC', hours: 4.2 },
  { region: 'Adelaide / SA', hours: 4.8 },
  { region: 'Perth / WA', hours: 5.3 },
  { region: 'NT / Alice Springs', hours: 6.0 },
  { region: 'Darwin / Top End', hours: 5.5 },
  { region: 'TAS / Hobart', hours: 3.8 },
]

function SolarEstimator() {
  const [panelWatts, setPanelWatts] = useState(400)
  const [batteryWh, setBatteryWh] = useState(2400)
  const [sunHours, setSunHours] = useState(4.8)
  const [loads, setLoads] = useState([
    { name: '12V Fridge (65L)', watts: 45, hours: 24, enabled: true },
    { name: 'LED Lights', watts: 10, hours: 5, enabled: true },
    { name: 'Phone Charger', watts: 15, hours: 3, enabled: true },
  ])
  const [showAddLoad, setShowAddLoad] = useState(false)
  const [customLoad, setCustomLoad] = useState({ name: '', watts: '', hours: '' })

  // Calculations
  const totalDailyLoad = loads
    .filter((l) => l.enabled)
    .reduce((sum, l) => sum + l.watts * l.hours, 0)

  // Solar production with ~80% system efficiency (controller, wiring, temperature losses)
  const solarProduction = panelWatts * sunHours * 0.80
  const surplus = solarProduction - totalDailyLoad
  const batteryDays = totalDailyLoad > 0 ? Math.round((batteryWh / totalDailyLoad) * 10) / 10 : 0
  const chargeTime = totalDailyLoad > 0 ? Math.round((totalDailyLoad / (panelWatts * 0.80)) * 10) / 10 : 0

  const toggleLoad = (index) => {
    setLoads(loads.map((l, i) => i === index ? { ...l, enabled: !l.enabled } : l))
  }

  const removeLoad = (index) => {
    setLoads(loads.filter((_, i) => i !== index))
  }

  const addCommonLoad = (load) => {
    setLoads([...loads, { ...load, enabled: true }])
    setShowAddLoad(false)
  }

  const addCustomLoad = () => {
    if (!customLoad.name || !customLoad.watts || !customLoad.hours) return
    setLoads([...loads, {
      name: customLoad.name,
      watts: parseFloat(customLoad.watts),
      hours: parseFloat(customLoad.hours),
      enabled: true,
    }])
    setCustomLoad({ name: '', watts: '', hours: '' })
    setShowAddLoad(false)
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Solar Panel Estimator
          </h1>
          <p className="text-brand-gray">
            Calculate if your solar setup can keep up with your off-grid power needs.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Result Summary */}
          <div className={`rounded-xl shadow border-2 p-6 mb-6 ${
            surplus >= 0
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <Sun size={20} className="text-brand-yellow mx-auto mb-1" />
                <p className="text-xl font-bold text-brand-brown">{Math.round(solarProduction)}</p>
                <p className="text-xs text-brand-gray">Wh/day generated</p>
              </div>
              <div>
                <Zap size={20} className="text-brand-ochre mx-auto mb-1" />
                <p className="text-xl font-bold text-brand-brown">{Math.round(totalDailyLoad)}</p>
                <p className="text-xs text-brand-gray">Wh/day consumed</p>
              </div>
              <div>
                <Battery size={20} className="text-brand-navy mx-auto mb-1" />
                <p className="text-xl font-bold text-brand-brown">{batteryDays}</p>
                <p className="text-xs text-brand-gray">days on battery</p>
              </div>
              <div>
                <span className={`text-xl font-bold ${surplus >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {surplus >= 0 ? '+' : ''}{Math.round(surplus)}
                </span>
                <p className="text-xs text-brand-gray">Wh {surplus >= 0 ? 'surplus' : 'deficit'}</p>
              </div>
            </div>
            <p className={`text-center text-sm font-medium mt-4 ${
              surplus >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {surplus >= 0
                ? `Your solar setup produces enough power. ${chargeTime}h of sun needed daily.`
                : `You need ${Math.abs(Math.round(surplus))}Wh more per day. Consider more panels or reducing loads.`}
            </p>
          </div>

          {/* Solar Setup */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
            <h3 className="font-headline text-lg font-bold text-brand-brown mb-4">Solar Setup</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-brown mb-2">
                  Panel Size: {panelWatts}W
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {PANEL_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setPanelWatts(preset.watts)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        panelWatts === preset.watts
                          ? 'bg-brand-yellow text-brand-navy border-brand-gold'
                          : 'bg-white text-brand-gray border-brand-tan hover:border-brand-ochre'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={50}
                  value={panelWatts}
                  onChange={(e) => setPanelWatts(parseInt(e.target.value))}
                  className="w-full accent-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-brown mb-2">
                  Battery: {batteryWh}Wh ({Math.round(batteryWh / 12)}Ah @ 12V)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {BATTERY_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setBatteryWh(preset.wh)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        batteryWh === preset.wh
                          ? 'bg-brand-yellow text-brand-navy border-brand-gold'
                          : 'bg-white text-brand-gray border-brand-tan hover:border-brand-ochre'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min={200}
                  max={6000}
                  step={100}
                  value={batteryWh}
                  onChange={(e) => setBatteryWh(parseInt(e.target.value))}
                  className="w-full accent-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-brown mb-2">
                  Peak Sun Hours: {sunHours}h/day
                </label>
                <select
                  value={sunHours}
                  onChange={(e) => setSunHours(parseFloat(e.target.value))}
                  className="w-full border border-brand-tan rounded-lg px-3 py-2 text-sm mb-1"
                >
                  {SUN_HOURS.map((s) => (
                    <option key={s.region} value={s.hours}>
                      {s.region} — {s.hours}h
                    </option>
                  ))}
                </select>
                <input
                  type="range"
                  min={2}
                  max={7}
                  step={0.1}
                  value={sunHours}
                  onChange={(e) => setSunHours(parseFloat(e.target.value))}
                  className="w-full accent-brand-yellow"
                />
              </div>
            </div>
          </div>

          {/* Power Loads */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-lg font-bold text-brand-brown">Daily Power Loads</h3>
              <button
                onClick={() => setShowAddLoad(!showAddLoad)}
                className="flex items-center gap-1 text-sm text-brand-ochre hover:text-brand-brown transition-colors font-medium"
              >
                <Zap size={14} /> Add Load
              </button>
            </div>

            {showAddLoad && (
              <div className="bg-brand-cream rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-brand-brown mb-2">Common Loads</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {COMMON_LOADS.map((load) => (
                    <button
                      key={load.name}
                      onClick={() => addCommonLoad(load)}
                      className="px-2 py-1 bg-white border border-brand-tan rounded text-xs text-brand-brown hover:border-brand-ochre transition-colors"
                    >
                      {load.name} ({load.watts}W)
                    </button>
                  ))}
                </div>
                <p className="text-sm font-medium text-brand-brown mb-2">Custom Load</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customLoad.name}
                    onChange={(e) => setCustomLoad({ ...customLoad, name: e.target.value })}
                    placeholder="Name"
                    className="flex-1 border border-brand-tan rounded-lg px-2 py-1.5 text-xs"
                  />
                  <input
                    type="number"
                    value={customLoad.watts}
                    onChange={(e) => setCustomLoad({ ...customLoad, watts: e.target.value })}
                    placeholder="Watts"
                    className="w-20 border border-brand-tan rounded-lg px-2 py-1.5 text-xs"
                  />
                  <input
                    type="number"
                    value={customLoad.hours}
                    onChange={(e) => setCustomLoad({ ...customLoad, hours: e.target.value })}
                    placeholder="Hours"
                    className="w-20 border border-brand-tan rounded-lg px-2 py-1.5 text-xs"
                  />
                  <button
                    onClick={addCustomLoad}
                    className="px-3 py-1.5 bg-brand-yellow text-brand-navy rounded-lg text-xs font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {loads.map((load, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    load.enabled
                      ? 'bg-white border-brand-tan/50'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={load.enabled}
                    onChange={() => toggleLoad(i)}
                    className="rounded border-brand-tan text-brand-ochre focus:ring-brand-yellow"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-brand-brown">{load.name}</span>
                    <span className="text-xs text-brand-gray ml-2">
                      {load.watts}W × {load.hours}h = {load.watts * load.hours}Wh
                    </span>
                  </div>
                  <button
                    onClick={() => removeLoad(i)}
                    className="text-brand-gray/40 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {loads.length > 0 && (
              <div className="border-t border-brand-tan/30 mt-3 pt-3 text-right">
                <span className="text-sm font-bold text-brand-brown">
                  Total: {Math.round(totalDailyLoad)} Wh/day
                </span>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6">
            <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Solar Tips</h3>
            <ul className="space-y-2 text-sm text-brand-gray">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-yellow rounded-full mt-1.5 flex-shrink-0"></span>
                Lithium batteries can use 80-100% capacity; AGM only 50% (already factored into presets)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-yellow rounded-full mt-1.5 flex-shrink-0"></span>
                Winter sun hours can be 30-50% less than summer in southern states
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-yellow rounded-full mt-1.5 flex-shrink-0"></span>
                Keep panels clean and angled toward the sun for best performance
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-yellow rounded-full mt-1.5 flex-shrink-0"></span>
                A MPPT controller is 20-30% more efficient than PWM
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-yellow rounded-full mt-1.5 flex-shrink-0"></span>
                Shade on even one cell can reduce panel output by 50% or more
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolarEstimator
