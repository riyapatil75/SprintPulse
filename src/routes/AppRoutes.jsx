import { Routes, Route } from 'react-router-dom'

// Guards
import ProtectedRoute from './ProtectedRoute.jsx'
import ManagerRoute from './ManagerRoute.jsx'
import AdminRoute from './AdminRoute.jsx'

// Layouts
import AppShell from '../components/layout/AppShell.jsx'

// Public pages
import Home from '../pages/public/Home.jsx'
import Login from '../pages/auth/Login.jsx'
import Signup from '../pages/auth/Signup.jsx'
import NotFound from '../pages/public/NotFound.jsx'
import Unauthorized from '../pages/public/Unauthorized.jsx'

// Employee pages
import Dashboard from '../pages/employee/Dashboard.jsx'
import ReportList from '../pages/employee/ReportList.jsx'
import ReportNew from '../pages/employee/ReportNew.jsx'
import ReportDetail from '../pages/employee/ReportDetail.jsx'
import Profile from '../pages/employee/Profile.jsx'

// Manager pages
import ManagerDashboard from '../pages/manager/ManagerDashboard.jsx'
import ManagerReportList from '../pages/manager/ManagerReportList.jsx'
import ManagerReportDetail from '../pages/manager/ManagerReportDetail.jsx'

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import AdminUserList from '../pages/admin/AdminUserList.jsx'
import AdminReportList from '../pages/admin/AdminReportList.jsx'
import AdminReportDetail from '../pages/admin/AdminReportDetail.jsx'

function Shell({ children }) {
  return <AppShell>{children}</AppShell>
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public ─────────────────────────────────────────────── */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ── Common (any authenticated role) ────────────────────── */}
      <Route path="/dashboard" element={<ProtectedRoute><Shell><Dashboard /></Shell></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Shell><ReportList /></Shell></ProtectedRoute>} />
      <Route path="/reports/new" element={<ProtectedRoute><Shell><ReportNew /></Shell></ProtectedRoute>} />
      <Route path="/reports/:id" element={<ProtectedRoute><Shell><ReportDetail /></Shell></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Shell><Profile /></Shell></ProtectedRoute>} />

      {/* ── Manager (MANAGER + ADMIN) ───────────────────────────── */}
      <Route path="/manager/dashboard" element={<ManagerRoute><Shell><ManagerDashboard /></Shell></ManagerRoute>} />
      <Route path="/manager/reports" element={<ManagerRoute><Shell><ManagerReportList /></Shell></ManagerRoute>} />
      <Route path="/manager/reports/:id" element={<ManagerRoute><Shell><ManagerReportDetail /></Shell></ManagerRoute>} />

      {/* ── Admin (ADMIN only) ──────────────────────────────────── */}
      <Route path="/admin/dashboard" element={<AdminRoute><Shell><AdminDashboard /></Shell></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><Shell><AdminUserList /></Shell></AdminRoute>} />
      <Route path="/admin/reports" element={<AdminRoute><Shell><AdminReportList /></Shell></AdminRoute>} />
      <Route path="/admin/reports/:id" element={<AdminRoute><Shell><AdminReportDetail /></Shell></AdminRoute>} />

      {/* ── Fallback ────────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}