import { useEffect } from 'react'

export default function Toast({ message, onUndo, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 6000)
    return () => clearTimeout(t)
  }, [onDismiss, message])

  return (
    <div
      role="status"
      className="fixed left-1/2 -translate-x-1/2 bottom-20 md:bottom-6 z-toast bg-text-primary text-bg rounded-token-md shadow-token-lg px-4 py-3 flex items-center gap-4 max-w-[calc(100vw-2rem)]"
    >
      <span className="text-sm">{message}</span>
      {onUndo && (
        <button
          onClick={() => {
            onUndo()
            onDismiss()
          }}
          className="text-sm font-semibold underline underline-offset-2 shrink-0"
        >
          Ongedaan maken
        </button>
      )}
    </div>
  )
}
