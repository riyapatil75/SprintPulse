import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

/**
 * Requires ADMIN role.
 * Unauthenticated → /login.
 * Wrong role → /unauthorized.
 */
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="auth-loading" aria-label="Loading" />

  if (!user) return <Navigate to="/login" replace />

  if (user.role !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}