import { forwardRef } from 'react'

const Checkbox = forwardRef(function Checkbox({ id, label, ...rest }, ref) {
  return (
    <label className="checkbox" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        ref={ref}
        className="checkbox__input"
        {...rest}
      />
      <span className="checkbox__label">{label}</span>
    </label>
  )
})

export default Checkbox