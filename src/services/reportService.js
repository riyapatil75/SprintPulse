import apiClient from './apiClient.js'

/**
 * GET /reports
 * Returns the current employee's reports.
 */
export async function fetchMyReports() {
  const { data } = await apiClient.get('/reports')
  return data
}

/**
 * GET /reports/summary
 * Returns counts by status for the current employee.
 * Response: { DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED }
 */
export async function fetchMySummary() {
  const { data } = await apiClient.get('/reports/summary')
  return data
}

/**
 * GET /reports/:id
 */
export async function fetchReportById(id) {
  const { data } = await apiClient.get(`/reports/${id}`)
  return data
}

/**
 * POST /reports
 * Body: report fields + { action: 'DRAFT' | 'SUBMIT' }
 */
export async function createReport(payload) {
  const { data } = await apiClient.post('/reports', payload)
  return data
}

/**
 * PUT /reports/:id
 * Body: report fields + { action: 'DRAFT' | 'SUBMIT' }
 */
export async function updateReport(id, payload) {
  const { data } = await apiClient.put(`/reports/${id}`, payload)
  return data
}

/**
 * GET /manager/reports
 */
export async function fetchTeamReports() {
  const { data } = await apiClient.get('/manager/reports')
  return data
}

/**
 * GET /manager/dashboard
 * Response: { PENDING_REVIEW, SUBMITTED, APPROVED, REJECTED }
 */
export async function fetchTeamSummary() {
  const { data } = await apiClient.get('/manager/dashboard')
  return data
}

/**
 * GET /manager/reports/:id
 */
export async function fetchTeamReportById(id) {
  const { data } = await apiClient.get(`/manager/reports/${id}`)
  return data
}

/**
 * POST /manager/reports/:id/approve
 */
export async function approveReport(id) {
  const { data } = await apiClient.post(`/manager/reports/${id}/approve`)
  return data
}

/**
 * POST /manager/reports/:id/reject
 * Body: { reason }
 */
export async function rejectReport(id, reason) {
  const { data } = await apiClient.post(`/manager/reports/${id}/reject`, { reason })
  return data
}
