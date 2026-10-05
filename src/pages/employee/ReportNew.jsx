import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReportForm from '../../components/report/ReportForm.jsx'
import { createReport } from '../../services/reportService.js'

export default function ReportNew() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSend = async (action, data) => {
    setSubmitting(action)
    setServerError('')
    setSuccessMsg('')
    try {
      const report = await createReport({ ...data, action })
      if (action === 'DRAFT') {
        setSuccessMsg('Draft saved.')
      } else {
        navigate(`/reports/${report.id}`, {
          state: { successMsg: 'Report submitted for review.' },
        })
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rform-wrap">
      <div className="dash__header">
        <div>
          <h2 className="dash__title">New Sprint Report</h2>
          <p className="dash__sub">Fill in the details for this sprint.</p>
        </div>
      </div>

      {serverError && (
        <div className="auth__server-error" role="alert">{serverError}</div>
      )}
      {successMsg && (
        <div className="rform__success" role="status">{successMsg}</div>
      )}

      <ReportForm onSend={handleSend} submitting={submitting} />
    </div>
  )
}