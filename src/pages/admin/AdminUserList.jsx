import { useCallback, useEffect, useState } from 'react'
import { fetchAllUsers } from '../../services/adminService.js'
import Spinner from '../../components/ui/Spinner.jsx'
import ErrorMessage from '../../components/ui/ErrorMessage.jsx'

const ROLE_LABELS = { EMPLOYEE: 'Employee', MANAGER: 'Manager', ADMIN: 'Admin' }

const ROLE_BADGE = {
  EMPLOYEE: 'role-badge--employee',
  MANAGER:  'role-badge--manager',
  ADMIN:    'role-badge--admin',
}

function RoleBadge({ role }) {
  return (
    <span className={`role-badge ${ROLE_BADGE[role] ?? ''}`}>
      {ROLE_LABELS[role] ?? role}
    </span>
  )
}

const ALL_ROLES = ['ALL', 'EMPLOYEE', 'MANAGER', 'ADMIN']

export default function AdminUserList() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [filter,  setFilter]  = useState('ALL')
  const [search,  setSearch]  = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setUsers(await fetchAllUsers())
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const visible = users
    .filter((u) => filter === 'ALL' || u.role === filter)
    .filter((u) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.team?.toLowerCase().includes(q) ?? false)
      )
    })

  return (
    <div className="page-section">
      <div className="dash__header">
        <div>
          <h2 className="dash__title">Users</h2>
          <p className="dash__sub">All registered users. Read-only.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="admin-controls">
        <input
          className="admin-search field__input"
          type="search"
          placeholder="Search by name, email or team…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search users"
        />
        <div className="filter-tabs" role="tablist" aria-label="Filter by role">
          {ALL_ROLES.map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={filter === r}
              className={`filter-tab ${filter === r ? 'is-active' : ''}`}
              onClick={() => setFilter(r)}
            >
              {r === 'ALL' ? 'All' : ROLE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="dash__spinner"><Spinner label="Loading users" /></div>}
      {error   && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && visible.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__text">
            {search || filter !== 'ALL' ? 'No users match your filter.' : 'No users found.'}
          </p>
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Employee ID</th>
                <th>Team</th>
                <th>Job Role</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => (
                <tr key={u.id}>
                  <td className="report-table__sprint">{u.name}</td>
                  <td className="report-table__project">{u.email}</td>
                  <td><RoleBadge role={u.role} /></td>
                  <td className="report-table__date">{u.employeeId ?? '—'}</td>
                  <td>{u.team ?? '—'}</td>
                  <td className="report-table__project">{u.jobRole ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}