import { useFocusTrap } from '../hooks/useFocusTrap'

export default function ConfirmDialog({ title, message, onConfirm, onCancel, busy }) {
  const dialogRef = useFocusTrap(busy ? null : onCancel)
  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center px-4"
      style={{ background: 'var(--overlay)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      ref={dialogRef}
    >
      <div className="bg-surface rounded-token-lg shadow-token-lg max-w-sm w-full p-6">
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-text-primary mb-1">{title}</h2>
        <p className="text-text-secondary text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="text-sm font-medium text-text-secondary hover:text-text-primary px-3 h-10">
            Annuleren
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="text-sm font-medium text-white bg-danger hover:bg-danger-hover disabled:opacity-60 px-4 h-10 rounded-token-md"
          >
            {busy ? 'Bezig…' : 'Verwijderen'}
          </button>
        </div>
      </div>
    </div>
  )
}
