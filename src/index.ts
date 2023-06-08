import { getCookie } from '@ketch-com/ketch-cookie'
import { getLogger } from '@ketch-sdk/ketch-logging'

const log = getLogger('ketch-consent')

export type ConsentStatus = {
  [key: string]: boolean
}

/**
 * Get current consent state from _swb_ketch_ cookie.
 * @param w The window object
 */
export default function getConsent(w: Window): ConsentStatus | undefined {
  log.debug('getConsent called')
  const value = getCookie(w, '_swb_ketch_')
  if (!value) {
    log.debug('_swb_ketch_ cookie not found')
    return
  }
  log.debug('_swb_ketch_ cookie value :', value)
  let consentObj
  try {
    consentObj = JSON.parse(atob(value))
  } catch (e) {
    log.debug('failed to parse cookie consent', e)
    return
  }
  if (!consentObj || !consentObj.purposes) {
    log.debug('cookie consent not found')
    return
  }
  const consent: ConsentStatus = {}
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
  log.debug('found cookie consent :', consent)
  return consent
}
