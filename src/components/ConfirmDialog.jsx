export default function ConfirmDialog({ title, message, onConfirm, onCancel, busy }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
        <h2 className="font-serif text-lg font-semibold text-stone-900 mb-1">{title}</h2>
        <p className="text-stone-600 text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-2"
          >
            Annuleren
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 px-4 py-2 rounded-lg"
          >
            {busy ? 'Bezig…' : 'Verwijderen'}
          </button>
        </div>
      </div>
    </div>
  )
}
