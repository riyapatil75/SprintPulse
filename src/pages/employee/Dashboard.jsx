import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import useReports from '../../hooks/useReports.js'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import ErrorMessage from '../../components/ui/ErrorMessage.jsx'

const STAT_KEYS = [
  { key: 'DRAFT',        label: 'Draft'        },
  { key: 'SUBMITTED',    label: 'Submitted'     },
  { key: 'UNDER_REVIEW', label: 'Under Review'  },
  { key: 'APPROVED',     label: 'Approved'      },
  { key: 'REJECTED',     label: 'Rejected'      },
]

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function Dashboard() {
  const { user } = useAuth()
  const { reports, summary, loading, error, refresh } = useReports()

  const recent = reports.slice(0, 5)

  return (
    <div className="dash">
      {/* Header */}
      <div className="dash__header">
        <div>
          <h2 className="dash__title">Good to see you, {user?.name?.split(' ')[0]}.</h2>
          <p className="dash__sub">Here is where your sprint reports stand.</p>
        </div>
        <Link to="/reports/new" className="btn btn--primary">
          New report
        </Link>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="stat-card stat-card--skeleton" />
            ))
          : STAT_KEYS.map(({ key, label }) => (
              <div key={key} className="stat-card">
                <span className="stat-card__count">
                  {summary?.[key] ?? 0}
                </span>
                <span className="stat-card__label">{label}</span>
              </div>
            ))
        }
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} onRetry={refresh} />}

      {/* Recent reports */}
      {!loading && !error && (
        <div className="dash__section">
          <div className="dash__section-head">
            <h3>Recent reports</h3>
            <Link to="/reports" className="dash__see-all">
              See all
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__text">No reports yet.</p>
              <Link to="/reports/new" className="btn btn--primary">
                Create your first report
              </Link>
            </div>
          ) : (
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
                  {recent.map((r) => (
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
      )}

      {loading && (
        <div className="dash__spinner">
          <Spinner label="Loading your reports" />
        </div>
      )}
    </div>
  )
}