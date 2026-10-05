const CONFIG = {
  DRAFT:        { label: 'Draft',        mod: 'draft'    },
  SUBMITTED:    { label: 'Submitted',    mod: 'submitted' },
  UNDER_REVIEW: { label: 'Under Review', mod: 'review'   },
  APPROVED:     { label: 'Approved',     mod: 'approved' },
  REJECTED:     { label: 'Rejected',     mod: 'rejected' },
}

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] ?? { label: status, mod: 'draft' }
  return (
    <span className={`status-badge status-badge--${cfg.mod}`}>
      {cfg.label}
    </span>
  )
}