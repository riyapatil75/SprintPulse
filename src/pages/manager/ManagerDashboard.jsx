import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import useTeamReports from '../../hooks/useTeamReports.js'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import ErrorMessage from '../../components/ui/ErrorMessage.jsx'

const STAT_KEYS = [
  { key: 'PENDING_REVIEW', label: 'Pending Review' },
  { key: 'SUBMITTED',      label: 'Submitted'      },
  { key: 'APPROVED',       label: 'Approved'       },
  { key: 'REJECTED',       label: 'Rejected'       },
]

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function ManagerDashboard() {
  const { user } = useAuth()
  const { reports, summary, loading, error, refresh } = useTeamReports()

  // Show the 5 most recent reports needing action first
  const recent = [...reports]
    .sort((a, b) => {
      const priority = ['UNDER_REVIEW', 'SUBMITTED', 'REJECTED', 'APPROVED', 'DRAFT']
      return priority.indexOf(a.status) - priority.indexOf(b.status)
    })
    .slice(0, 5)

  return (
    <div className="dash">
      <div className="dash__header">
        <div>
          <h2 className="dash__title">Team Overview</h2>
          <p className="dash__sub">Welcome back, {user?.name?.split(' ')[0]}. Here is your team's report status.</p>
        </div>
        <Link to="/manager/reports" className="btn btn--ghost">View all reports</Link>
      </div>

      {/* Stat cards */}
      <div className="stat-grid stat-grid--4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="stat-card stat-card--skeleton" />
            ))
          : STAT_KEYS.map(({ key, label }) => (
              <div key={key} className={`stat-card ${key === 'PENDING_REVIEW' ? 'stat-card--accent' : ''}`}>
                <span className="stat-card__count">{summary?.[key] ?? 0}</span>
                <span className="stat-card__label">{label}</span>
              </div>
            ))
        }
      </div>

      {error && <ErrorMessage message={error} onRetry={refresh} />}

      {!loading && !error && (
        <div className="dash__section">
          <div className="dash__section-head">
            <h3>Reports needing attention</h3>
            <Link to="/manager/reports" className="dash__see-all">See all</Link>
          </div>

          {recent.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__text">No team reports yet.</p>
            </div>
          ) : (
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
                  {recent.map((r) => (
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
      )}

      {loading && <div className="dash__spinner"><Spinner label="Loading team reports" /></div>}
    </div>
  )
}