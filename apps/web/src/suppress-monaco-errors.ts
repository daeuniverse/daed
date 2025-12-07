/**
 * Suppress Monaco's internal "Canceled" errors when editor is disposed.
 * This is a known Monaco behavior when the editor is destroyed while operations are pending.
 *
 * This file should be imported as early as possible in the application.
 */

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason

    // Check various ways the "Canceled" error might be represented
    if (
      reason?.name === 'Canceled' ||
      reason?.message === 'Canceled' ||
      String(reason) === 'Canceled' ||
      String(reason).includes('Canceled: Canceled')
    ) {
      event.preventDefault()
    }
  })
}
