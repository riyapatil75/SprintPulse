import { Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout.jsx'

export default function Unauthorized() {
  return (
    <PublicLayout>
      <div className="container notfound">
        <div className="notfound__code">403</div>
        <h2>Access denied</h2>
        <p className="lede">
          You do not have permission to view this page.
          Contact your administrator if you think this is a mistake.
        </p>
        <Link to="/dashboard" className="btn btn--primary">
          Go to dashboard
        </Link>
      </div>
    </PublicLayout>
  )
}