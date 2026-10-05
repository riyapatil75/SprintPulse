import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach the JWT on every request if one is stored.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sp_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401 / 403, clear stored credentials so the app returns to login.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear auth on 401 (token expired / invalid).
    // 403 means the token is valid but access is denied for this resource —
    // clearing auth here would incorrectly log out managers hitting a report
    // outside their team. The UI handles 403 per-page.
    if (error.response?.status === 401) {
      localStorage.removeItem('sp_token')
      localStorage.removeItem('sp_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient