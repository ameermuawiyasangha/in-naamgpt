import { useState, useEffect } from 'react'

const GOATCOUNTER_SITE = 'in-naamgpt'
const API_BASE = `https://${GOATCOUNTER_SITE}.goatcounter.com`

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

function getDateRange(period) {
  const now = new Date()
  const fmt = (d) => d.toISOString().split('T')[0]

  if (period === 'today') {
    return { start: fmt(now), end: fmt(now) }
  }
  if (period === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    return { start: fmt(start), end: fmt(now) }
  }
  return null
}

export default function VisitorStats() {
  const [stats, setStats] = useState({ today: null, month: null, total: null })
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchStats() {
      try {
        const todayRange = getDateRange('today')
        const monthRange = getDateRange('month')

        const [todayRes, monthRes, totalRes] = await Promise.all([
          fetch(`${API_BASE}/counter/${encodeURIComponent('/')}.json?start=${todayRange.start}&end=${todayRange.end}&no_events=true`),
          fetch(`${API_BASE}/counter/${encodeURIComponent('/')}.json?start=${monthRange.start}&end=${monthRange.end}&no_events=true`),
          fetch(`${API_BASE}/counter/${encodeURIComponent('/')}.json?no_events=true`),
        ])

        const [todayData, monthData, totalData] = await Promise.all([
          todayRes.ok ? todayRes.json() : null,
          monthRes.ok ? monthRes.json() : null,
          totalRes.ok ? totalRes.json() : null,
        ])

        setStats({
          today: todayData?.count ?? null,
          month: monthData?.count ?? null,
          total: totalData?.count ?? null,
        })
      } catch {
        setError(true)
      }
    }

    fetchStats()
  }, [])

  if (error || (stats.today === null && stats.month === null && stats.total === null)) {
    return null
  }

  const counters = [
    { label: 'Today', value: stats.today, color: '#D02020' },
    { label: 'This Month', value: stats.month, color: '#1040C0' },
    { label: 'All Time', value: stats.total, color: '#F0C020' },
  ]

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
        Visitors
      </span>
      {counters.map((c) => (
        <div key={c.label} className="flex items-center gap-2">
          <div
            className="w-2 h-2"
            style={{ backgroundColor: c.color }}
          />
          <span className="text-white/50 text-xs">
            {c.label}
          </span>
          <span
            className="text-xs font-bold"
            style={{ color: c.color }}
          >
            {c.value !== null ? formatNumber(c.value) : '—'}
          </span>
        </div>
      ))}
    </div>
  )
}
