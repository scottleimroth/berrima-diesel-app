import { useQuery } from '@tanstack/react-query'

async function fetchOutageData() {
  // Cache-bust every 5 minutes
  const cacheBuster = Math.floor(Date.now() / 300000)
  const response = await fetch(`/data/outages.json?v=2&t=${cacheBuster}`, {
    cache: 'no-cache',
  })
  if (!response.ok) {
    console.error(`[Outages] Fetch failed: ${response.status} ${response.statusText}`)
    throw new Error('Failed to fetch outage data')
  }
  const data = await response.json()
  const matched = Object.keys(data?.stationOutages || {}).length
  const unmatched = (data?.unmatchedOutages || []).length
  console.log(`[Outages] Loaded: ${matched} matched, ${unmatched} unmatched, total=${data?.summary?.totalOutages}`)
  return data
}

/**
 * Hook to fetch fuel outage data from the scraped JSON file
 * Returns outage data with station lookups and freshness info
 */
export function useOutageData() {
  const query = useQuery({
    queryKey: ['outageData'],
    queryFn: fetchOutageData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    onError: (err) => console.error('[Outages] Query error:', err.message),
  })

  const data = query.data

  // Check if outage data is stale (more than 2 hours old)
  const lastScraped = data?.lastScraped ? new Date(data.lastScraped) : null
  const isStale = lastScraped
    ? Date.now() - lastScraped.getTime() > 2 * 60 * 60 * 1000
    : false

  // Minutes since last scrape
  const minutesAgo = lastScraped
    ? Math.floor((Date.now() - lastScraped.getTime()) / 60000)
    : null

  return {
    outages: data?.stationOutages || {},
    unmatchedOutages: data?.unmatchedOutages || [],
    summary: data?.summary || null,
    lastScraped,
    isStale,
    minutesAgo,
    isLoading: query.isLoading,
    hasData: !!data?.lastScraped,
    getStationOutage: (stationCode) => data?.stationOutages?.[stationCode] || null,
  }
}

export default useOutageData
