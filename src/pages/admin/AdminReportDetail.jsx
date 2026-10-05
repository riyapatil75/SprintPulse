import { useCallback, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchAdminReportById } from '../../services/adminService.js'
import ReportReadView from '../../components/report/ReportReadView.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import ErrorMessage from '../../components/ui/ErrorMessage.jsx'

export default function AdminReportDetail() {
  const { id } = useParams()

  const [report,   setReport]   = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [notFound, setNotFound] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNotFound(false)
    try {
      setReport(await fetchAdminReportById(id))
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true)
      else setError(err.response?.data?.message || 'Failed to load report.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  if (loading) return <div className="dash__spinner"><Spinner label="Loading report" /></div>

  if (notFound) return (
    <div className="rdetail__notfound">
      <h2>Report not found</h2>
      <p>This report does not exist.</p>
      <Link to="/admin/reports" className="btn btn--primary" style={{ marginTop: 16 }}>
        Back to all reports
      </Link>
    </div>
  )

  if (error) return <ErrorMessage message={error} onRetry={load} />

  return (
    <div className="rdetail-wrap">
      <div className="dash__header">
        <div>
          <div className="rdetail__breadcrumb">
            <Link to="/admin/reports">All Reports</Link>
            <span>›</span>
            <span>{report.sprintName}</span>
          </div>
          <h2 className="dash__title">{report.sprintName}</h2>
          <p className="dash__sub">
            {report.projectName}
            {report.employeeName && <> · <strong>{report.employeeName}</strong></>}
          </p>
        </div>
        <span className="admin-readonly-tag">Read only</span>
      </div>

      {report.status === 'REJECTED' && report.rejectionReason && (
        <div className="rdetail__rejection">
          <strong>Rejection reason</strong>
          <p>{report.rejectionReason}</p>
        </div>
      )}

      <ReportReadView report={report} showEmployee />
    </div>
  )
}