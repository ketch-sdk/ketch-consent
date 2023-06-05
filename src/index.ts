import { getCookie } from '@ketch-com/ketch-cookie'

/**
 * Get current consent state from _swb_ketch_ cookie.
 * @param w The window object
 */
export default function getConsent(w: Window): any {
  const value = getCookie(w, '_swb_ketch_')
  if (value) {
    try {
      return JSON.parse(atob(value))
    } catch (e) {
      return
    }
  }
  return
}
