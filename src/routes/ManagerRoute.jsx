import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

const ALLOWED = ['MANAGER', 'ADMIN']

/**
 * Requires MANAGER or ADMIN role.
 * Unauthenticated → /login.
 * Wrong role → /unauthorized.
 */
export default function ManagerRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="auth-loading" aria-label="Loading" />

  if (!user) return <Navigate to="/login" replace />

  if (!ALLOWED.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}