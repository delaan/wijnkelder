import { useEffect, useRef } from 'react'

// Deelbare focus-trap voor modals/bottom sheets: zet focus bij openen op het
// eerste (of opgegeven) element, houdt Tab binnen de dialoog, sluit op
// Escape, en herstelt de focus naar het element van vóór het openen zodra de
// dialoog weer dicht gaat. Gebruik: const containerRef = useFocusTrap(onClose)
// en zet containerRef op de buitenste dialoog-container.
export function useFocusTrap(onClose, { initialFocusRef } = {}) {
  const containerRef = useRef(null)
  const previouslyFocused = useRef(null)

  useEffect(() => {
    previouslyFocused.current = document.activeElement
    const toFocus = initialFocusRef?.current || containerRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    toFocus?.focus?.()

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
        return
      }
      if (e.key === 'Tab' && containerRef.current) {
        const focusable = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      previouslyFocused.current?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose])

  return containerRef
}
