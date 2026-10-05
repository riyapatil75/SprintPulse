import { useState, useEffect } from 'react'
import Textarea from './Textarea.jsx'
import Button from './Button.jsx'

/**
 * Manager rejection dialog.
 * Props: open, onConfirm(reason), onCancel, submitting
 */
export default function RejectModal({ open, onConfirm, onCancel, submitting }) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setReason('')
      setError('')
    }
  }, [open])

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = reason.trim()
    if (!trimmed) {
      setError('A rejection reason is required.')
      return
    }
    onConfirm(trimmed)
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 id="reject-title" className="modal__title">Reject report</h2>
          <button
            type="button"
            className="modal__close"
            onClick={onCancel}
            aria-label="Close"
            disabled={submitting}
          >
            ×
          </button>
        </div>
        <p className="modal__desc">
          Tell the employee what needs to change so they can resubmit.
        </p>
        <form onSubmit={handleSubmit}>
          <Textarea
            id="rejectionReason"
            label="Reason"
            rows={4}
            placeholder="What is missing or incorrect?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={error}
            disabled={submitting}
          />
          <div className="modal__actions">
            <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Rejecting…' : 'Reject report'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
