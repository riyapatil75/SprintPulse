import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
/**
 * Wraps routes that require authentication.
 * Optionally restricts to specific roles: <ProtectedRoute roles={['MANAGER']} />
 *
 * Security note: this is UX-only gating.
 * The Spring Boot backend validates JWT and role on every request.
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    // Avoid a flash to /login while we are verifying the stored token.
    return <div className="auth-loading" aria-label="Loading" />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    // Authenticated but wrong role — send them to their own home.
    return <Navigate to="/dashboard" replace />
  }

  return children
}