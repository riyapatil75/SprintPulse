import { forwardRef } from 'react'

const Select = forwardRef(function Select(
  { id, label, error, children, ...rest },
  ref
) {
  return (
    <div className={`field ${error ? 'field--invalid' : ''}`}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        id={id}
        name={id}
        ref={ref}
        className="field__input field__select"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      >
        {children}
      </select>
      {error && (
        <span id={`${id}-error`} className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
})

export default Select