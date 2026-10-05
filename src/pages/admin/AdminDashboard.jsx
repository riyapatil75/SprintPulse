import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { fetchAdminSummary } from '../../services/adminService.js'
import Spinner from '../../components/ui/Spinner.jsx'
import ErrorMessage from '../../components/ui/ErrorMessage.jsx'

const STATS = [
  { key: 'totalUsers',     label: 'Total Users'     },
  { key: 'totalReports',   label: 'Total Reports'   },
  { key: 'pendingReports', label: 'Pending Reports'  },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setSummary(await fetchAdminSummary())
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="dash">
      <div className="dash__header">
        <div>
          <h2 className="dash__title">Admin Overview</h2>
          <p className="dash__sub">Welcome, {user?.name?.split(' ')[0]}. System-level view.</p>
        </div>
      </div>

      {loading && <div className="dash__spinner"><Spinner label="Loading summary" /></div>}
      {error   && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && summary && (
        <div className="stat-grid stat-grid--3">
          {STATS.map(({ key, label }) => (
            <div key={key} className={`stat-card ${key === 'pendingReports' ? 'stat-card--accent' : ''}`}>
              <span className="stat-card__count">{summary[key] ?? 0}</span>
              <span className="stat-card__label">{label}</span>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="admin-quick-links">
          <Link to="/admin/users" className="admin-quick-card">
            <span className="admin-quick-card__title">Users</span>
            <span className="admin-quick-card__desc">View all registered users and their roles.</span>
            <span className="admin-quick-card__arrow">→</span>
          </Link>
          <Link to="/admin/reports" className="admin-quick-card">
            <span className="admin-quick-card__title">Reports</span>
            <span className="admin-quick-card__desc">Browse all sprint reports across every team.</span>
            <span className="admin-quick-card__arrow">→</span>
          </Link>
        </div>
      )}
    </div>
  )
}