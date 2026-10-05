import apiClient from './apiClient.js'

/**
 * GET /admin/dashboard
 * Returns system-level counts.
 * Response: { totalUsers, totalReports, pendingReports }
 */
export async function fetchAdminSummary() {
  const { data } = await apiClient.get('/admin/dashboard')
  return data
}

/**
 * GET /admin/users
 * Returns all users in the system.
 * Response: User[] — { id, name, email, role, employeeId, jobRole, team, createdAt }
 */
export async function fetchAllUsers() {
  const { data } = await apiClient.get('/admin/users')
  return data
}

/**
 * GET /admin/reports
 * Returns all reports across all teams.
 * Response: Report[] — { id, employeeName, sprintName, projectName, status, updatedAt }
 */
export async function fetchAllReports() {
  const { data } = await apiClient.get('/admin/reports')
  return data
}

/**
 * GET /admin/reports/:id
 * Returns a single report (admin read-only view).
 * Response: full Report object
 */
export async function fetchAdminReportById(id) {
  const { data } = await apiClient.get(`/admin/reports/${id}`)
  return data
}