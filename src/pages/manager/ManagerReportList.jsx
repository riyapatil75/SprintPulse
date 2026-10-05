import { useState } from 'react'
import { Link } from 'react-router-dom'
import useTeamReports from '../../hooks/useTeamReports.js'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import ErrorMessage from '../../components/ui/ErrorMessage.jsx'

const ALL_STATUSES = ['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']
const STATUS_LABELS = {
  ALL: 'All', SUBMITTED: 'Submitted', UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved', REJECTED: 'Rejected',
}

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function ManagerReportList() {
  const { reports, loading, error, refresh } = useTeamReports()
  const [filter, setFilter] = useState('ALL')

  const visible = filter === 'ALL'
    ? reports
    : reports.filter((r) => r.status === filter)

  return (
    <div className="page-section">
      <div className="dash__header">
        <div>
          <h2 className="dash__title">Team Reports</h2>
          <p className="dash__sub">All sprint reports from your team.</p>
        </div>
      </div>

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

      {loading && <div className="dash__spinner"><Spinner label="Loading team reports" /></div>}
      {error && <ErrorMessage message={error} onRetry={refresh} />}

      {!loading && !error && visible.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__text">
            {filter === 'ALL'
              ? 'Your team has not submitted any reports yet.'
              : `No reports with status "${STATUS_LABELS[filter]}".`}
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
                    <Link to={`/manager/reports/${r.id}`} className="report-table__action">
                      {r.status === 'UNDER_REVIEW' ? 'Review' : 'View'}
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