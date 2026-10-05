import { useCallback, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  fetchTeamReportById,
  approveReport,
  rejectReport,
} from '../../services/reportService.js'
import ReportReadView from '../../components/report/ReportReadView.jsx'
import RejectModal from '../../components/ui/RejectModal.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import ErrorMessage from '../../components/ui/ErrorMessage.jsx'

export default function ManagerReportDetail() {
  const { id } = useParams()

  const [report, setReport]           = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [notFound, setNotFound]       = useState(false)
  const [actionError, setActionError] = useState('')
  const [successMsg, setSuccessMsg]   = useState('')
  const [approving, setApproving]     = useState(false)
  const [rejectOpen, setRejectOpen]   = useState(false)
  const [rejecting, setRejecting]     = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNotFound(false)
    try {
      setReport(await fetchTeamReportById(id))
    } catch (err) {
      if (err.response?.status === 404) setNotFound(true)
      else setError(err.response?.data?.message || 'Failed to load report.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const handleApprove = async () => {
    setApproving(true)
    setActionError('')
    setSuccessMsg('')
    try {
      const updated = await approveReport(id)
      setReport(updated)
      setSuccessMsg('Report approved.')
    } catch (err) {
      setActionError(err.response?.data?.message || 'Approval failed. Please try again.')
    } finally {
      setApproving(false)
    }
  }

  const handleReject = async (reason) => {
    setRejecting(true)
    setActionError('')
    setSuccessMsg('')
    try {
      const updated = await rejectReport(id, reason)
      setReport(updated)
      setRejectOpen(false)
      setSuccessMsg('Report rejected. The employee will be notified.')
    } catch (err) {
      setActionError(err.response?.data?.message || 'Rejection failed. Please try again.')
      setRejectOpen(false)
    } finally {
      setRejecting(false)
    }
  }

  if (loading) return <div className="dash__spinner"><Spinner label="Loading report" /></div>

  if (notFound) return (
    <div className="rdetail__notfound">
      <h2>Report not found</h2>
      <p>This report does not exist or is not in your team.</p>
      <Link to="/manager/reports" className="btn btn--primary" style={{ marginTop: 16 }}>
        Back to team reports
      </Link>
    </div>
  )

  if (error) return <ErrorMessage message={error} onRetry={load} />

  const canReview = report.status === 'UNDER_REVIEW'

  return (
    <>
      <div className="rdetail-wrap">
        <div className="dash__header">
          <div>
            <div className="rdetail__breadcrumb">
              <Link to="/manager/reports">Team Reports</Link>
              <span>›</span>
              <span>{report.sprintName}</span>
            </div>
            <h2 className="dash__title">{report.sprintName}</h2>
            <p className="dash__sub">
              {report.projectName}
              {report.employeeName && <> · <strong>{report.employeeName}</strong></>}
            </p>
          </div>

          {canReview && (
            <div className="review-actions">
              <button
                className="btn btn--ghost"
                onClick={() => { setActionError(''); setRejectOpen(true) }}
                disabled={approving}
              >
                Reject
              </button>
              <button
                className="btn btn--primary"
                onClick={handleApprove}
                disabled={approving || rejecting}
              >
                {approving ? 'Approving…' : 'Approve'}
              </button>
            </div>
          )}
        </div>

        {successMsg && <div className="rform__success" role="status">{successMsg}</div>}
        {actionError && <div className="auth__server-error" role="alert">{actionError}</div>}

        {report.status === 'REJECTED' && report.rejectionReason && (
          <div className="rdetail__rejection">
            <strong>Rejection reason you provided</strong>
            <p>{report.rejectionReason}</p>
          </div>
        )}

        <ReportReadView report={report} showEmployee />
      </div>

      <RejectModal
        open={rejectOpen}
        onConfirm={handleReject}
        onCancel={() => setRejectOpen(false)}
        submitting={rejecting}
      />
    </>
  )
}