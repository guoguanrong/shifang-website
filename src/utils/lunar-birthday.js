// Use the browser's Chinese calendar data for leap months and actual 29/30-day months.
// No birth date is sent to a server or persisted.
const cache = new Map()
export function getLunarMonths(year) {
  if (cache.has(year)) return cache.get(year)
  const formatter = new Intl.DateTimeFormat('en-u-ca-chinese', {
    year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC',
  })
  if (formatter.resolvedOptions().calendar !== 'chinese') return []
  const months = new Map()
  const end = Date.UTC(year + 1, 2, 1)
  for (let timestamp = Date.UTC(year, 0, 1); timestamp < end; timestamp += 86400000) {
    const parts = Object.fromEntries(formatter.formatToParts(timestamp).map(part => [part.type, part.value]))
    if (Number(parts.relatedYear) !== year) continue
    const key = parts.month
    const month = months.get(key) || { value: key, number: parseInt(key, 10), leap: key.includes('bis'), days: 0 }
    month.days = Math.max(month.days, Number(parts.day))
    months.set(key, month)
  }
  const result = [...months.values()]
  cache.set(year, result)
  return result
}
