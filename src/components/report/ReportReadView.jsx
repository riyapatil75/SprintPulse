import StatusBadge from '../ui/StatusBadge.jsx'

function fmt(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function ViewSection({ title, children }) {
  return (
    <div className="rdetail__section">
      <h3 className="rdetail__section-title">{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div className="rdetail__field">
      <span className="rdetail__field-label">{label}</span>
      <span className="rdetail__field-value">{value ?? '—'}</span>
    </div>
  )
}

const STORY_STATUS_MAP = {
  TODO: 'To do', IN_PROGRESS: 'In progress',
  DONE: 'Done', CARRIED_OVER: 'Carried over',
}

/**
 * Renders the complete read-only body of a report.
 * Used by both employee ReportDetail and manager ManagerReportDetail.
 *
 * Props:
 *   report        – the full report object
 *   showEmployee  – show the employee name in the meta strip (default false)
 */
export default function ReportReadView({ report, showEmployee = false }) {
  return (
    <>
      {/* Meta strip */}
      <div className="rdetail__meta">
        <div className="rdetail__meta-item">
          <span className="rdetail__meta-label">Status</span>
          <StatusBadge status={report.status} />
        </div>
        {showEmployee && report.employeeName && (
          <div className="rdetail__meta-item">
            <span className="rdetail__meta-label">Employee</span>
            <span className="rdetail__meta-value">{report.employeeName}</span>
          </div>
        )}
        <div className="rdetail__meta-item">
          <span className="rdetail__meta-label">Created</span>
          <span className="rdetail__meta-value">{fmt(report.createdAt)}</span>
        </div>
        <div className="rdetail__meta-item">
          <span className="rdetail__meta-label">Updated</span>
          <span className="rdetail__meta-value">{fmt(report.updatedAt)}</span>
        </div>
      </div>

      {/* Delivery */}
      <ViewSection title="Delivery">
        <div className="rdetail__field-row">
          <Field label="Committed points" value={report.committedPoints} />
          <Field label="Completed points" value={report.completedPoints} />
          <Field label="Spillover points" value={report.spilloverPoints} />
        </div>
      </ViewSection>

      {/* Stories */}
      <ViewSection title="Stories">
        {(!report.stories || report.stories.length === 0) ? (
          <p className="rdetail__empty">No stories recorded.</p>
        ) : (
          <div className="rdetail__table-wrap">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Story ID</th>
                  <th>Title</th>
                  <th>Points</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {report.stories.map((s, i) => (
                  <tr key={i}>
                    <td className="report-table__sprint">{s.storyId}</td>
                    <td>{s.title}</td>
                    <td>{s.points}</td>
                    <td>{STORY_STATUS_MAP[s.status] ?? s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ViewSection>

      {/* Blockers */}
      <ViewSection title="Blockers">
        {(!report.blockers || report.blockers.length === 0) ? (
          <p className="rdetail__empty">No blockers recorded.</p>
        ) : (
          <div className="rdetail__blockers">
            {report.blockers.map((b, i) => (
              <div key={i} className="rdetail__blocker-card">
                <p className="rdetail__blocker-desc">{b.description}</p>
                <div className="rdetail__blocker-meta">
                  <span className="rdetail__chip">{b.type}</span>
                  <span className={`rdetail__chip rdetail__chip--impact-${b.impact.toLowerCase()}`}>
                    {b.impact} impact
                  </span>
                  {b.resolved && (
                    <span className="rdetail__chip rdetail__chip--resolved">Resolved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ViewSection>

      {/* Reflection */}
      <ViewSection title="Reflection">
        <Field label="What went well?"    value={report.wentWell} />
        <Field label="What could improve?" value={report.couldImprove} />
        <Field label="What did you learn?" value={report.learned} />
      </ViewSection>
    </>
  )
}