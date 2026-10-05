import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import Logo from '../ui/Logo.jsx'

// Navigation items per role
const NAV = {
  EMPLOYEE: [
    { to: '/dashboard',    label: 'Dashboard' },
    { to: '/reports',      label: 'My Reports' },
    { to: '/reports/new',  label: 'New Report' },
    { to: '/profile',      label: 'Profile' },
  ],
  MANAGER: [
    { to: '/dashboard',           label: 'Dashboard' },
    { to: '/reports',             label: 'My Reports' },
    { to: '/reports/new',         label: 'New Report' },
    { to: '/manager/dashboard',   label: 'Team Overview' },
    { to: '/manager/reports',     label: 'Team Reports' },
    { to: '/profile',             label: 'Profile' },
  ],
  ADMIN: [
    { to: '/dashboard',       label: 'Dashboard' },
    { to: '/admin/dashboard', label: 'Admin Overview' },
    { to: '/admin/users',     label: 'Users' },
    { to: '/admin/reports',   label: 'All Reports' },
    { to: '/profile',         label: 'Profile' },
  ],
}

export default function AppShell({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = NAV[user?.role] ?? NAV.EMPLOYEE

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="shell">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="shell__overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`shell__sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="shell__logo">
          <Logo light />
        </div>

        <nav className="shell__nav" aria-label="Main navigation">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `shell__nav-link ${isActive ? 'is-active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="shell__user">
          <div className="shell__user-name">{user?.name}</div>
          <div className="shell__user-role">{user?.role}</div>
          <button className="shell__logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="shell__body">
        <header className="shell__topbar">
          <button
            className="shell__menu-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
          >
            <span /><span /><span />
          </button>
          <div className="shell__topbar-right">
            <span className="shell__topbar-name">{user?.name}</span>
          </div>
        </header>

        <main className="shell__main">{children}</main>
      </div>
    </div>
  )
}