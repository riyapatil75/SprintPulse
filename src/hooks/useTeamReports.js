import { useCallback, useEffect, useState } from 'react'
import { fetchTeamReports, fetchTeamSummary } from '../services/reportService.js'

export default function useTeamReports() {
  const [reports, setReports] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [reportData, summaryData] = await Promise.all([
        fetchTeamReports(),
        fetchTeamSummary(),
      ])
      setReports(reportData)
      setSummary(summaryData)
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load team reports. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { reports, summary, loading, error, refresh: load }
}