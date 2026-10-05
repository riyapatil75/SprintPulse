import { useCallback, useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { fetchReportById, updateReport } from '../../services/reportService.js'
import ReportForm from '../../components/report/ReportForm.jsx'
import ReportReadView from '../../components/report/ReportReadView.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import ErrorMessage from '../../components/ui/ErrorMessage.jsx'

export default function ReportDetail() {
  const { id } = useParams()
  const location = useLocation()

  const [report, setReport]           = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [notFound, setNotFound]       = useState(false)
  const [editing, setEditing]         = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [serverError, setServerError] = useState('')
  const [successMsg, setSuccessMsg]   = useState(location.state?.successMsg ?? '')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNotFound(false)
    try {
      setReport(await fetchReportById(id))
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true)
      else setError(err.response?.data?.message || 'Failed to load report.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const handleSend = async (action, data) => {
    setSubmitting(action)
    setServerError('')
    setSuccessMsg('')
    try {
      const updated = await updateReport(id, { ...data, action })
      setReport(updated)
      setEditing(false)
      setSuccessMsg(action === 'DRAFT' ? 'Draft saved.' : 'Report resubmitted for review.')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="dash__spinner"><Spinner label="Loading report" /></div>

  if (notFound) return (
    <div className="rdetail__notfound">
      <h2>Report not found</h2>
      <p>This report does not exist or you do not have access to it.</p>
      <Link to="/reports" className="btn btn--primary" style={{ marginTop: 16 }}>Back to reports</Link>
    </div>
  )

  if (error) return <ErrorMessage message={error} onRetry={load} />

  const { status } = report
  const canEdit = status === 'DRAFT' || status === 'REJECTED'

  const formDefaults = {
    sprintName: report.sprintName, projectName: report.projectName,
    committedPoints: report.committedPoints, completedPoints: report.completedPoints,
    spilloverPoints: report.spilloverPoints,
    stories: report.stories ?? [], blockers: report.blockers ?? [],
    wentWell: report.wentWell, couldImprove: report.couldImprove, learned: report.learned,
  }

  if (editing && canEdit) {
    return (
      <div className="rform-wrap">
        <div className="dash__header">
          <div>
            <h2 className="dash__title">Edit Report</h2>
            <p className="dash__sub">{report.sprintName} · {report.projectName}</p>
          </div>
          <button className="btn btn--ghost" onClick={() => setEditing(false)}>Cancel</button>
        </div>
        {serverError && <div className="auth__server-error" role="alert">{serverError}</div>}
        <ReportForm
          defaultValues={formDefaults}
          onSend={handleSend}
          submitting={submitting}
          submitLabel={status === 'REJECTED' ? 'Resubmit report' : 'Submit report'}
        />
      </div>
    )
  }

  return (
    <div className="rdetail-wrap">
      <div className="dash__header">
        <div>
          <div className="rdetail__breadcrumb">
            <Link to="/reports">My Reports</Link>
            <span>›</span>
            <span>{report.sprintName}</span>
          </div>
          <h2 className="dash__title">{report.sprintName}</h2>
          <p className="dash__sub">{report.projectName}</p>
        </div>
        {canEdit && (
          <button className="btn btn--primary" onClick={() => {
            setServerError('')
            setSuccessMsg('')
            setEditing(true)
          }}>
            {status === 'REJECTED' ? 'Edit & Resubmit' : 'Edit report'}
          </button>
        )}
      </div>

      {successMsg && <div className="rform__success" role="status">{successMsg}</div>}

      {status === 'REJECTED' && report.rejectionReason && (
        <div className="rdetail__rejection">
          <strong>Rejected by manager</strong>
          <p>{report.rejectionReason}</p>
        </div>
      )}

      <ReportReadView report={report} />
    </div>
  )
}