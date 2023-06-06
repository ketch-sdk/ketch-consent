import { getCookie } from '@ketch-com/ketch-cookie'

export type ConsentStatus = {
  [key: string]: boolean
}

/**
 * Get current consent state from _swb_ketch_ cookie.
 * @param w The window object
 */
export default function getConsent(w: Window): ConsentStatus | undefined {
  const value = getCookie(w, '_swb_ketch_')
  if (!value) {
    return
  }
  try {
    const consentObj = JSON.parse(atob(value))
    if (consentObj && consentObj.purposes) {
      let consent: ConsentStatus = {}
      const p = consentObj.purposes
      for (const purposeCode in p) {
        if (p[purposeCode]) {
          const x = p[purposeCode]
          if (typeof x === 'string') {
            consent[purposeCode] = x === 'true'
          } else if (x.allowed) {
            consent[purposeCode] = x.allowed === 'true'
          }
        }
      }
      return consent
    }
  } catch (e) {
    return
  }
}
