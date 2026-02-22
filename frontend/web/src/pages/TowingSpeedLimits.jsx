import { useState } from 'react'
import { Gauge, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react'

const STATES = [
  {
    code: 'NSW',
    name: 'New South Wales',
    rules: [
      { vehicle: 'Car towing trailer/caravan', limit: 'Posted speed limit (up to 110 km/h)', notes: 'No specific reduced limit for towing. Standard speed limits apply.' },
      { vehicle: 'Vehicle + trailer (GCM > 4.5t)', limit: 'Posted speed limit', notes: 'Heavy vehicle speed limits may apply if GVM over 4.5t (100 km/h max).' },
    ],
    keyPoints: [
      'No blanket reduced speed for towing with a light vehicle',
      'Heavy vehicles (GVM > 4.5t) limited to 100 km/h',
      'Always adjust speed for conditions and load',
    ],
  },
  {
    code: 'VIC',
    name: 'Victoria',
    rules: [
      { vehicle: 'Car towing trailer/caravan', limit: 'Posted speed limit (up to 110 km/h)', notes: 'No specific towing speed restriction for light vehicles.' },
      { vehicle: 'Heavy vehicle (GVM > 4.5t)', limit: '100 km/h max', notes: 'Applies on all roads regardless of posted limit.' },
    ],
    keyPoints: [
      'No specific reduced speed for light vehicles towing',
      'Recommended to drive 10-20 km/h below posted limit when towing',
      'Heavy vehicles capped at 100 km/h',
    ],
  },
  {
    code: 'QLD',
    name: 'Queensland',
    rules: [
      { vehicle: 'Car towing trailer/caravan', limit: 'Posted speed limit (up to 110 km/h)', notes: 'No specific reduced limit. Standard limits apply.' },
      { vehicle: 'Heavy vehicle (GVM > 4.5t)', limit: '100 km/h max', notes: 'On any road regardless of posted speed limit.' },
    ],
    keyPoints: [
      'No blanket towing speed reduction for light vehicles',
      'Heavy vehicles max 100 km/h',
      'Be mindful of crosswinds in outback QLD',
    ],
  },
  {
    code: 'SA',
    name: 'South Australia',
    rules: [
      { vehicle: 'Car towing trailer/caravan', limit: '100 km/h max', notes: 'SA has a specific 100 km/h limit for any vehicle towing a trailer on roads with a higher posted limit.' },
      { vehicle: 'Heavy vehicle (GVM > 4.5t)', limit: '100 km/h max', notes: 'Standard heavy vehicle limit.' },
    ],
    keyPoints: [
      'SA is the main state with a specific towing speed limit of 100 km/h',
      'Applies to all vehicles towing a trailer where posted limit exceeds 100 km/h',
      'This is actively enforced',
    ],
  },
  {
    code: 'WA',
    name: 'Western Australia',
    rules: [
      { vehicle: 'Car towing trailer/caravan', limit: 'Posted speed limit (up to 110 km/h)', notes: 'No specific reduced limit for towing.' },
      { vehicle: 'Heavy vehicle (GVM > 4.5t)', limit: '100 km/h max', notes: 'Standard heavy vehicle limit.' },
    ],
    keyPoints: [
      'No specific towing speed reduction for light vehicles',
      'Some roads in WA have 130 km/h limits — take extra care towing at high speed',
      'Triple road trains have their own limits',
    ],
  },
  {
    code: 'TAS',
    name: 'Tasmania',
    rules: [
      { vehicle: 'Car towing trailer/caravan', limit: 'Posted speed limit (up to 110 km/h)', notes: 'No specific towing speed restriction.' },
      { vehicle: 'Heavy vehicle (GVM > 4.5t)', limit: '100 km/h max', notes: 'Standard heavy vehicle limit.' },
    ],
    keyPoints: [
      'No specific towing speed reduction',
      'Winding mountain roads make safe speed well below posted limits',
      'Watch for logging trucks on rural roads',
    ],
  },
  {
    code: 'NT',
    name: 'Northern Territory',
    rules: [
      { vehicle: 'Car towing trailer/caravan', limit: 'Posted speed limit (up to 130 km/h)', notes: 'No specific reduced limit. Some NT roads have 130 km/h or open speed limits.' },
      { vehicle: 'Heavy vehicle (GVM > 4.5t)', limit: '100 km/h max (generally)', notes: 'Varies by road. Some roads allow higher speeds for road trains.' },
    ],
    keyPoints: [
      'NT has the highest speed limits in Australia (130 km/h on Stuart Hwy)',
      'No specific towing speed restriction, but extreme caution recommended',
      'Fatigue and wildlife are major risks at high speed',
    ],
  },
  {
    code: 'ACT',
    name: 'Australian Capital Territory',
    rules: [
      { vehicle: 'Car towing trailer/caravan', limit: 'Posted speed limit (up to 100 km/h)', notes: 'ACT max speed is 100 km/h, so towing limit is effectively the same.' },
      { vehicle: 'Heavy vehicle (GVM > 4.5t)', limit: '100 km/h max', notes: 'Standard heavy vehicle limit.' },
    ],
    keyPoints: [
      'Max posted speed in ACT is 100 km/h, so no additional towing restriction needed',
      'Urban areas have lower limits (40-80 km/h)',
    ],
  },
]

function TowingSpeedLimits() {
  const [expandedState, setExpandedState] = useState(null)

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Towing Speed Limits
          </h1>
          <p className="text-brand-gray">
            Speed limits by state for vehicles towing caravans, trailers, and campers.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Quick Summary */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-brand-ochre flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-headline text-lg font-bold text-brand-brown mb-2">Quick Summary</h3>
                <p className="text-sm text-brand-gray mb-3">
                  <strong>South Australia is the only state</strong> with a specific 100 km/h speed limit
                  for vehicles towing a trailer. All other states allow towing at the posted speed limit
                  (for light vehicles under 4.5t GVM).
                </p>
                <p className="text-sm text-brand-gray">
                  <strong>All states</strong> limit heavy vehicles (GVM over 4.5t) to 100 km/h maximum.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Reference Table */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-cream border-b border-brand-tan/50">
                    <th className="text-left px-4 py-3 text-brand-brown font-bold">State</th>
                    <th className="text-center px-4 py-3 text-brand-brown font-bold">Towing Limit</th>
                    <th className="text-center px-4 py-3 text-brand-brown font-bold">Heavy Vehicle</th>
                  </tr>
                </thead>
                <tbody>
                  {STATES.map((state) => (
                    <tr key={state.code} className="border-b border-brand-tan/30 last:border-0">
                      <td className="px-4 py-3 font-medium text-brand-brown">{state.code}</td>
                      <td className="px-4 py-3 text-center">
                        {state.code === 'SA' ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">100 km/h</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Posted limit</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs text-brand-gray">100 km/h</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* State Details */}
          <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">State Details</h3>
          <div className="space-y-3 mb-6">
            {STATES.map((state) => (
              <div
                key={state.code}
                className="bg-white rounded-xl shadow border border-brand-tan/50 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedState(expandedState === state.code ? null : state.code)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 bg-brand-cream rounded-lg flex items-center justify-center font-bold text-brand-brown text-sm">
                      {state.code}
                    </span>
                    <span className="font-headline font-bold text-brand-brown">{state.name}</span>
                  </div>
                  {expandedState === state.code ? (
                    <ChevronUp size={16} className="text-brand-gray" />
                  ) : (
                    <ChevronDown size={16} className="text-brand-gray" />
                  )}
                </button>

                {expandedState === state.code && (
                  <div className="px-4 pb-4 border-t border-brand-tan/30">
                    <div className="space-y-3 mt-3">
                      {state.rules.map((rule, i) => (
                        <div key={i} className="bg-brand-cream rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-brand-brown">{rule.vehicle}</span>
                            <span className="text-sm font-bold text-brand-navy">{rule.limit}</span>
                          </div>
                          <p className="text-xs text-brand-gray">{rule.notes}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-medium text-brand-brown mb-1">Key Points:</p>
                      <ul className="space-y-1">
                        {state.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-brand-gray">
                            <span className="w-1.5 h-1.5 bg-brand-ochre rounded-full mt-1 flex-shrink-0"></span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* General Tips */}
          <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6">
            <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Safe Towing Tips</h3>
            <ul className="space-y-2 text-sm text-brand-gray">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                Even where legal, towing above 100 km/h increases fuel consumption, sway risk, and stopping distances significantly
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                Most caravan manufacturers recommend a maximum towing speed of 100 km/h
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                Reduce speed in crosswinds, rain, or when being overtaken by trucks
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                Ensure your tyre pressures are correct for the load — under-inflation causes sway and blowouts
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-brand-ochre rounded-full mt-1.5 flex-shrink-0"></span>
                Electronic Stability Control (ESC) is your best friend when towing — don't disconnect it
              </li>
            </ul>
          </div>

          <div className="text-xs text-brand-gray/70 text-center mt-8 space-y-2">
            <p>
              Information current as of 2025. Always check current state legislation before travel. This is general guidance only, not legal advice.
            </p>
            <p>
              Official sources:{' '}
              <a href="https://www.nsw.gov.au/driving-boating-and-transport" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-ochre">Transport for NSW</a>{' · '}
              <a href="https://www.vicroads.vic.gov.au" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-ochre">VicRoads</a>{' · '}
              <a href="https://www.tmr.qld.gov.au" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-ochre">TMR QLD</a>{' · '}
              <a href="https://www.sa.gov.au/topics/driving-and-transport" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-ochre">SA Transport</a>{' · '}
              <a href="https://www.mainroads.wa.gov.au" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-ochre">Main Roads WA</a>{' · '}
              <a href="https://www.transport.tas.gov.au" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-ochre">Transport TAS</a>{' · '}
              <a href="https://nt.gov.au/driving" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-ochre">NT Transport</a>{' · '}
              <a href="https://www.accesscanberra.act.gov.au" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-ochre">Access Canberra</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TowingSpeedLimits
