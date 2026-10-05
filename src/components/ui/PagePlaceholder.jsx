/**
 * Temporary stand-in rendered for routes not yet implemented.
 * Replaced page-by-page in later phases.
 */
export default function PagePlaceholder({ title }) {
  return (
    <div className="placeholder-page">
      <span className="placeholder-page__label">{title}</span>
      <p className="placeholder-page__note">Implemented in a future phase.</p>
    </div>
  )
}