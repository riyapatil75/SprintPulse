import { Link } from 'react-router-dom'
import Logo from '../ui/Logo.jsx'

export default function AuthLayout({ heading, blurb, children }) {
  return (
    <div className="auth">
      <aside className="auth__aside">
        <div className="auth__aside-body">
          <Logo light />
          <h2>{heading}</h2>
          <p>{blurb}</p>
        </div>
        <p className="auth__quote">
          Every report carries its own history — who wrote it, who reviewed it,
          and what changed before it was approved.
        </p>
      </aside>

      <div className="auth__main">
        <div className="auth__card">
          <Link to="/" className="auth__back">
            Back to home
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
