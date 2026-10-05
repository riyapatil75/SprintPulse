import { forwardRef } from 'react'

/**
 * Label + input + error message.
 * Uses forwardRef so react-hook-form's register() can attach its ref.
 */
const Input = forwardRef(function Input(
  { id, label, error, type = 'text', ...rest },
  ref
) {
  return (
    <div className={`field ${error ? 'field--invalid' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        ref={ref}
        className="field__input"
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

export default Input