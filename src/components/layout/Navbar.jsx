import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../ui/Logo.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Logo />

        <button
          className="navbar__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar__menu ${open ? 'is-open' : ''}`}>
          <nav className="navbar__links">
            <NavLink to="/" end className="navbar__link" onClick={close}>
              Product
            </NavLink>
            <a href="#workflow" className="navbar__link" onClick={close}>
              How it works
            </a>
            <a href="#roles" className="navbar__link" onClick={close}>
              Roles
            </a>
          </nav>

          <div className="navbar__actions">
            <Link to="/login" className="btn btn--ghost" onClick={close}>
              Sign in
            </Link>
            <Link to="/signup" className="btn btn--primary" onClick={close}>
              Create account
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
