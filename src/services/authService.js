import apiClient from './apiClient.js'

/**
 * POST /auth/login
 * Body: { email, password }
 * Returns: { token, user: { id, name, email, role, employeeId, jobRole, team } }
 */
export async function login(email, password) {
  const { data } = await apiClient.post('/auth/login', { email, password })
  return data
}

/**
 * POST /auth/register
 * Body: { name, email, password, employeeId, jobRole, team }
 * Role is always EMPLOYEE — never sent from the frontend.
 * Returns: { token, user: { id, name, email, role, employeeId, jobRole, team } }
 */
export async function register(payload) {
  const { data } = await apiClient.post('/auth/register', payload)
  return data
}

/**
 * GET /auth/me
 * Header: Authorization: Bearer <token>
 * Returns: { id, name, email, role, employeeId, jobRole, team }
 */
export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/auth/me')
  return data
}