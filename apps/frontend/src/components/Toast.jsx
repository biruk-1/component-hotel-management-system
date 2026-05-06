function Toast({ message, variant = "info", onDismiss }) {
  if (!message) return null;

  return (
    <div className={`toast toast-${variant}`} role="alert">
      <span>{message}</span>
      {onDismiss ? (
        <button type="button" className="toast-dismiss" onClick={onDismiss} aria-label="Dismiss">
          ×
        </button>
      ) : null}
    </div>
  );
}

export default Toast;
