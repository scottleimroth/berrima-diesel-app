import { useQuery } from '@tanstack/react-query'
import { Flame, AlertTriangle, ExternalLink, MapPin } from 'lucide-react'
import { fetchBushfireIncidents, getAlertStyle } from '../services/bushfireApi'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'

function Bushfires() {
  const { data: incidents, isLoading, error, refetch } = useQuery({
    queryKey: ['bushfire-incidents'],
    queryFn: fetchBushfireIncidents,
    staleTime: 5 * 60 * 1000, // 5 min
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 min
  })

  const emergencies = incidents?.filter((i) => i.alertLevel === 'emergency') || []
  const watchAndAct = incidents?.filter((i) => i.alertLevel === 'watch-and-act') || []
  const advice = incidents?.filter((i) => i.alertLevel === 'advice') || []
  const info = incidents?.filter((i) => i.alertLevel === 'info') || []

  const totalActive = incidents?.length || 0

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Page Header */}
      <div className="bg-white border-b border-brand-tan/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-headline text-3xl font-bold text-brand-brown mb-2">
            Bushfire & Emergency Information
          </h1>
          <p className="text-brand-gray">
            Live incident data from NSW Rural Fire Service. Check before you travel.
          </p>
        </div>
      </div>

      {/* Emergency Banner */}
      {emergencies.length > 0 && (
        <div className="bg-red-600 text-white">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <AlertTriangle size={24} className="flex-shrink-0 animate-pulse" />
            <p className="font-bold">
              {emergencies.length} EMERGENCY WARNING{emergencies.length > 1 ? 'S' : ''} ACTIVE
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {isLoading ? (
            <LoadingSpinner message="Fetching incident data..." />
          ) : error ? (
            <ErrorDisplay
              title="Unable to load incidents"
              message="Could not fetch emergency data. Check your connection."
              onRetry={refetch}
            />
          ) : (
            <>
              {/* Summary */}
              <div className="bg-white rounded-xl shadow-lg border border-brand-tan/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline text-xl font-bold text-brand-brown">Active Incidents</h2>
                  <Flame size={24} className={totalActive > 0 ? 'text-red-500' : 'text-brand-gray'} />
                </div>
                {totalActive === 0 ? (
                  <p className="text-brand-eucalyptus font-medium">No active major incidents reported.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="font-headline text-2xl font-bold text-red-600">{emergencies.length}</p>
                      <p className="text-xs text-red-600">Emergency</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="font-headline text-2xl font-bold text-orange-600">{watchAndAct.length}</p>
                      <p className="text-xs text-orange-600">Watch & Act</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="font-headline text-2xl font-bold text-yellow-600">{advice.length}</p>
                      <p className="text-xs text-yellow-600">Advice</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="font-headline text-2xl font-bold text-blue-600">{info.length}</p>
                      <p className="text-xs text-blue-600">Other</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Incident List */}
              {[...emergencies, ...watchAndAct, ...advice, ...info].map((incident) => {
                const style = getAlertStyle(incident.alertLevel)
                return (
                  <div
                    key={incident.id}
                    className={`rounded-xl shadow border-l-4 ${style.border} ${style.bg} p-5`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${style.badge} mb-2`}>
                          {style.label}
                        </span>
                        <h3 className={`font-headline text-lg font-bold ${style.text}`}>
                          {incident.title}
                        </h3>
                      </div>
                    </div>

                    {incident.location && (
                      <div className="flex items-center gap-1 text-sm text-brand-gray mb-2">
                        <MapPin size={14} />
                        <span>{incident.location}</span>
                        {incident.councilArea && <span className="text-brand-gray/60">({incident.councilArea})</span>}
                      </div>
                    )}

                    {incident.status && (
                      <p className="text-sm text-brand-gray mb-2">{incident.status}</p>
                    )}

                    {incident.size && (
                      <p className="text-xs text-brand-gray">Size: {incident.size}</p>
                    )}

                    {incident.updated && (
                      <p className="text-xs text-brand-gray/60 mt-2">
                        Updated: {new Date(incident.updated).toLocaleString('en-AU')}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-3 text-xs">
                      <span className="text-brand-gray">Source: {incident.source}</span>
                    </div>
                  </div>
                )
              })}

              {/* Links to State Fire Services */}
              <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6">
                <h3 className="font-headline text-lg font-bold text-brand-brown mb-4">State Fire Services</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { state: 'NSW', name: 'NSW RFS', url: 'https://www.rfs.nsw.gov.au/fire-information/fires-near-me' },
                    { state: 'VIC', name: 'CFA Victoria', url: 'https://www.emergency.vic.gov.au/respond/' },
                    { state: 'QLD', name: 'QFES', url: 'https://www.qfes.qld.gov.au/Current-Incidents' },
                    { state: 'WA', name: 'DFES WA', url: 'https://www.emergency.wa.gov.au/' },
                    { state: 'SA', name: 'CFS SA', url: 'https://www.cfs.sa.gov.au/warnings-and-incidents/' },
                    { state: 'TAS', name: 'TFS', url: 'https://www.fire.tas.gov.au/Show?pageId=colBushfireAlerts' },
                    { state: 'NT', name: 'NT PFES', url: 'https://www.pfes.nt.gov.au/fire-and-rescue' },
                    { state: 'ACT', name: 'ACT ESA', url: 'https://esa.act.gov.au/current-incidents' },
                  ].map((service) => (
                    <a
                      key={service.state}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 bg-brand-cream/50 rounded-lg border border-brand-tan/50 hover:border-brand-ochre hover:bg-brand-cream transition-colors"
                    >
                      <div>
                        <span className="text-xs text-brand-gray">{service.state}</span>
                        <p className="text-sm font-medium text-brand-brown">{service.name}</p>
                      </div>
                      <ExternalLink size={14} className="text-brand-gray" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-white rounded-xl shadow border border-brand-tan/50 p-6">
                <h3 className="font-headline text-lg font-bold text-brand-brown mb-3">Bushfire Safety for Tourers</h3>
                <ul className="space-y-2 text-sm text-brand-gray">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    Check fire danger ratings before travelling into bushland
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    Know two ways out of any campsite or area
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    Total Fire Ban days: no campfires, no solid fuel BBQs
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    Download the Fires Near Me app for your state
                  </li>
                </ul>
              </div>
            </>
          )}

          <p className="text-xs text-brand-gray/70 text-center">
            Live data from NSW Rural Fire Service. Always check official state fire services for your area.
            Auto-refreshes every 5 minutes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Bushfires
