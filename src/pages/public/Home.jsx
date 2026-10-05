import { Link } from 'react-router-dom'
import PublicLayout from '../../components/layout/PublicLayout.jsx'
import Card from '../../components/ui/Card.jsx'

const lifecycle = [
  {
    name: 'Draft',
    text: 'An employee writes up the sprint while the work is still fresh.',
  },
  {
    name: 'Submitted',
    text: 'The report leaves the employee and lands in the manager queue.',
  },
  {
    name: 'Under review',
    text: 'A manager reads it and decides. Rejections carry a written reason.',
  },
  {
    name: 'Approved',
    text: 'The report locks. Rejected work goes back for edits and resubmission.',
  },
]

const roles = [
  {
    title: 'Employee',
    text: 'Write sprint reports, save drafts, submit for review, and fix anything that comes back rejected.',
  },
  {
    title: 'Manager',
    text: 'See the reports from your own team, approve what is ready, and explain what is not.',
  },
  {
    title: 'Admin',
    text: 'View users, teams, and report activity across the system.',
  },
]

export default function Home() {
  return (
    <PublicLayout>
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <h1 className="hero__title">
              Sprint reports that actually get reviewed.
            </h1>
            <p className="lede">
              SprintPulse gives every sprint report one clear path: written by
              the person who did the work, reviewed by the manager who owns the
              team, and closed with a decision anyone can trace.
            </p>
            <div className="hero__actions">
              <Link to="/signup" className="btn btn--primary">
                Create account
              </Link>
              <Link to="/login" className="btn btn--ghost">
                Sign in
              </Link>
            </div>
          </div>

          <div className="hero__panel">
            <div className="hero__panel-head">
              <span>Sprint 24 — Payments squad</span>
              <span>4 reports</span>
            </div>

            <div className="hero__row">
              <div>
                <div className="hero__row-name">Checkout retry logic</div>
                <div className="hero__row-meta">Aditi R. · submitted Mon</div>
              </div>
              <span className="status status--approved">Approved</span>
            </div>

            <div className="hero__row">
              <div>
                <div className="hero__row-name">Refund webhook cleanup</div>
                <div className="hero__row-meta">Karan M. · submitted Tue</div>
              </div>
              <span className="status status--review">Under review</span>
            </div>

            <div className="hero__row">
              <div>
                <div className="hero__row-name">Settlement report export</div>
                <div className="hero__row-meta">Neha S. · needs edits</div>
              </div>
              <span className="status status--rejected">Rejected</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ink" id="workflow">
        <div className="container">
          <div className="section__head">
            <h2>One lifecycle, start to finish</h2>
            <p className="lede">
              A report moves in a single direction until someone decides
              otherwise. Nothing sits in an unclear state.
            </p>
          </div>

          <div className="flow">
            {lifecycle.map((step) => (
              <div className="flow__step" key={step.name}>
                <div className="flow__step-name">{step.name}</div>
                <p className="flow__step-text">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--mist" id="roles">
        <div className="container">
          <div className="section__head">
            <h2>Three roles, no overlap</h2>
            <p className="lede">
              What you can see and do depends on who you are and which team you
              belong to.
            </p>
          </div>

          <div className="grid-3">
            {roles.map((role) => (
              <Card key={role.title} title={role.title}>
                {role.text}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>Start reporting on your next sprint</h2>
            <Link to="/signup" className="btn btn--ghost">
              Create account
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
