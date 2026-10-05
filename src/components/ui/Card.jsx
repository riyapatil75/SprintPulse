/**
 * variant: 'default' | 'flat' | 'ink'
 */
export default function Card({
  variant = 'default',
  title,
  children,
  className = '',
}) {
  const classes = [
    'card',
    variant !== 'default' ? `card--${variant}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {title && <h3 className="card__title">{title}</h3>}
      <div className="card__text">{children}</div>
    </div>
  )
}
