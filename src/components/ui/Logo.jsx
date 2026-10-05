import { Link } from 'react-router-dom'

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo--light' : ''}`}>
      <span className="logo__mark" aria-hidden="true">
        <span />
        <span />
      </span>
      SprintPulse
    </Link>
  )
}
