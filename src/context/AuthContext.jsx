import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { login as apiLogin, register as apiRegister, fetchCurrentUser } from '../services/authService.js'

const AuthContext = createContext(null)

const TOKEN_KEY = 'sp_token'
const USER_KEY  = 'sp_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Restore user from localStorage so the UI renders immediately on refresh.
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  // true while we are verifying a persisted token with the backend.
  const [loading, setLoading] = useState(!!localStorage.getItem(TOKEN_KEY))

  // On mount, if a token is stored, confirm it is still valid with the backend.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }

    fetchCurrentUser()
      .then((freshUser) => {
        setUser(freshUser)
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser))
      })
      .catch(() => {
        // Token is expired or invalid — clear everything.
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const persist = (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setUser(userData)
  }

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password)
    persist(data.token, data.user)
    return data.user
  }, [])

  // payload: { name, email, password, employeeId, jobRole, team }
  // role is never included — backend assigns EMPLOYEE.
  const signup = useCallback(async (payload) => {
    const data = await apiRegister(payload)
    persist(data.token, data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}