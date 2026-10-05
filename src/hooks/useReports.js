import { useCallback, useEffect, useState } from 'react'
import { fetchMyReports, fetchMySummary } from '../services/reportService.js'

/**
 * Fetches the current employee's reports and status summary.
 * Returns { reports, summary, loading, error, refresh }.
 */
export default function useReports() {
  const [reports, setReports]   = useState([])
  const [summary, setSummary]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [reportData, summaryData] = await Promise.all([
        fetchMyReports(),
        fetchMySummary(),
      ])
      setReports(reportData)
      setSummary(summaryData)
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load reports. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { reports, summary, loading, error, refresh: load }
}