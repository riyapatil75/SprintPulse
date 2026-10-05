export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-msg" role="alert">
      <p className="error-msg__text">{message}</p>
      {onRetry && (
        <button className="btn btn--ghost error-msg__retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}