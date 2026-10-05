/**
 * variant: 'primary' | 'secondary' | 'ghost'
 * block:   full width
 */
export default function Button({
  variant = 'primary',
  block = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
