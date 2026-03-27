// Regional postcode ranges that get longer stale thresholds
// These are remote/rural areas where stations update less frequently
const REGIONAL_POSTCODE_PREFIXES = [
  '08', '09',       // NT
  '48', '49',       // WA remote
  '67', '68', '69', // WA regional
  '28', '29',       // NSW far west
  '47',             // QLD remote
  '78', '79',       // QLD far north
  '87', '88', '89', // SA remote
]

function isRegionalStation(station) {
  const postcode = station.postcode || station.address?.match(/\b(\d{4})\b/)?.[1]
  if (!postcode) return false
  const prefix = postcode.substring(0, 2)
  return REGIONAL_POSTCODE_PREFIXES.includes(prefix)
}

const HOURS = 3600000

/**
 * Check if a station's price data is stale
 * @param {Object} station - Station object with lastupdated field
 * @returns {{ status: 'fresh'|'warning'|'danger', message: string|null }}
 */
export function getStaleStatus(station) {
  if (!station.lastupdated) {
    return { status: 'fresh', message: null }
  }

  const lastUpdated = new Date(station.lastupdated)
  if (isNaN(lastUpdated.getTime())) {
    return { status: 'fresh', message: null }
  }

  const ageMs = Date.now() - lastUpdated.getTime()
  const ageHours = ageMs / HOURS
  const isRegional = isRegionalStation(station)

  const warningThreshold = isRegional ? 72 : 24
  const dangerThreshold = isRegional ? 96 : 48

  if (ageHours >= dangerThreshold) {
    return {
      status: 'danger',
      message: 'Possibly out of fuel — no recent price data',
    }
  }

  if (ageHours >= warningThreshold) {
    return {
      status: 'warning',
      message: 'Price data stale — station may have limited fuel',
    }
  }

  return { status: 'fresh', message: null }
}

/**
 * Sort comparator that pushes stale stations lower
 * Returns negative if a should come first, positive if b should come first
 */
export function staleComparator(a, b) {
  const priority = { fresh: 0, warning: 1, danger: 2 }
  const aStatus = getStaleStatus(a).status
  const bStatus = getStaleStatus(b).status
  return priority[aStatus] - priority[bStatus]
}
