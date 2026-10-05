import { useState } from 'react'
import { Link } from 'react-router-dom'
import useReports from '../../hooks/useReports.js'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import ErrorMessage from '../../components/ui/ErrorMessage.jsx'

const ALL_STATUSES = ['ALL', 'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']

const STATUS_LABELS = {
  ALL: 'All', DRAFT: 'Draft', SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review', APPROVED: 'Approved', REJECTED: 'Rejected',
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function ReportList() {
  const { reports, loading, error, refresh } = useReports()
  const [filter, setFilter] = useState('ALL')

  const visible = filter === 'ALL'
    ? reports
    : reports.filter((r) => r.status === filter)

  return (
    <div className="page-section">
      <div className="dash__header">
        <div>
          <h2 className="dash__title">My Reports</h2>
          <p className="dash__sub">All sprint reports you have created.</p>
        </div>
        <Link to="/reports/new" className="btn btn--primary">
          New report
        </Link>
      </div>

      {/* Status filter tabs */}
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

      {loading && (
        <div className="dash__spinner">
          <Spinner label="Loading reports" />
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={refresh} />}

      {!loading && !error && visible.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__text">
            {filter === 'ALL'
              ? 'You have not created any reports yet.'
              : `No reports with status "${STATUS_LABELS[filter]}".`}
          </p>
          {filter === 'ALL' && (
            <Link to="/reports/new" className="btn btn--primary">
              Create your first report
            </Link>
          )}
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
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
                  <td className="report-table__sprint">{r.sprintName}</td>
                  <td className="report-table__project">{r.projectName}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="report-table__date">{formatDate(r.updatedAt)}</td>
                  <td>
                    <Link
                      to={`/reports/${r.id}`}
                      className="report-table__action"
                    >
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