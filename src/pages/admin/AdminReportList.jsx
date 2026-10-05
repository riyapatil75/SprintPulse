import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllReports } from '../../services/adminService.js'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import ErrorMessage from '../../components/ui/ErrorMessage.jsx'

const ALL_STATUSES = ['ALL', 'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']
const STATUS_LABELS = {
  ALL: 'All', DRAFT: 'Draft', SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review', APPROVED: 'Approved', REJECTED: 'Rejected',
}

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function AdminReportList() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [filter,  setFilter]  = useState('ALL')
  const [search,  setSearch]  = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setReports(await fetchAllReports())
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const visible = reports
    .filter((r) => filter === 'ALL' || r.status === filter)
    .filter((r) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        r.employeeName?.toLowerCase().includes(q) ||
        r.sprintName?.toLowerCase().includes(q) ||
        r.projectName?.toLowerCase().includes(q)
      )
    })

  return (
    <div className="page-section">
      <div className="dash__header">
        <div>
          <h2 className="dash__title">All Reports</h2>
          <p className="dash__sub">Every sprint report across all teams. Read-only.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="admin-controls">
        <input
          className="admin-search field__input"
          type="search"
          placeholder="Search by employee, sprint or project…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search reports"
        />
        <div className="filter-tabs" role="tablist" aria-label="Filter by status">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={filter === s}
              className={`filter-tab ${filter === s ? 'is-active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="dash__spinner"><Spinner label="Loading reports" /></div>}
      {error   && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && visible.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__text">
            {search || filter !== 'ALL' ? 'No reports match your filter.' : 'No reports in the system yet.'}
          </p>
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Sprint</th>
                <th>Project</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id}>
                  <td className="report-table__sprint">{r.employeeName}</td>
                  <td>{r.sprintName}</td>
                  <td className="report-table__project">{r.projectName}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="report-table__date">{fmt(r.updatedAt)}</td>
                  <td>
                    <Link to={`/admin/reports/${r.id}`} className="report-table__action">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}