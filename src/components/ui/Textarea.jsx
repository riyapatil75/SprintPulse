import { forwardRef } from 'react'

const Textarea = forwardRef(function Textarea(
  { id, label, error, rows = 4, ...rest },
  ref
) {
  return (
    <div className={`field ${error ? 'field--invalid' : ''}`}>
      {label && (
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        name={id}
        ref={ref}
        rows={rows}
        className="field__input field__textarea"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${id}-error`} className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
})

export default Textarea