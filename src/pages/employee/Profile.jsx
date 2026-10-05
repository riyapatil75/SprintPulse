import { useAuth } from '../../hooks/useAuth.js'

function Field({ label, value }) {
  return (
    <div className="rdetail__field">
      <span className="rdetail__field-label">{label}</span>
      <span className="rdetail__field-value">{value ?? '—'}</span>
    </div>
  )
}

const ROLE_LABELS = { EMPLOYEE: 'Employee', MANAGER: 'Manager', ADMIN: 'Admin' }

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="rdetail-wrap">
      <div className="dash__header">
        <div>
          <h2 className="dash__title">Profile</h2>
          <p className="dash__sub">Your account details.</p>
        </div>
      </div>

      <div className="rdetail__section">
        <h3 className="rdetail__section-title">Account</h3>
        <div className="rdetail__field-row">
          <Field label="Name" value={user?.name} />
          <Field label="Email" value={user?.email} />
          <Field label="Role" value={ROLE_LABELS[user?.role] ?? user?.role} />
        </div>
        <div className="rdetail__field-row">
          <Field label="Employee ID" value={user?.employeeId} />
          <Field label="Job role" value={user?.jobRole} />
          <Field label="Team" value={user?.team} />
        </div>
      </div>
    </div>
  )
}
