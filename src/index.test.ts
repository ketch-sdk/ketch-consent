import getConsent, { ConsentStatus } from './index'
import { getCookie } from '@ketch-com/ketch-cookie'

jest.mock('@ketch-com/ketch-cookie')

describe('consent', () => {
  const w = {
    document: {
      cookie: '',
      location: {
        hostname: 'localhost.localdomain',
      },
    },
  } as Window
  const mockGetCookie = jest.mocked(getCookie)

  beforeEach(() => {
    mockGetCookie.mockReset()
  })

  describe('getConsent', () => {
    it('returns undefined if the cookie does not exist', async () => {
      mockGetCookie.mockReturnValue('')
      expect(getConsent(w)).toBeUndefined()
      expect(mockGetCookie).toHaveBeenCalledWith(w, '_swb_ketch_')
    })
    it('returns undefined if the cookie value is corrupt', async () => {
      mockGetCookie.mockReturnValue('invalid')
      expect(getConsent(w)).toBeUndefined()
      expect(mockGetCookie).toHaveBeenCalledWith(w, '_swb_ketch_')
    })
    it('returns the value if the cookie value is correct', async () => {
      mockGetCookie.mockReturnValue(
        btoa(
          // eslint-disable-next-line max-len
          '{"purposes":{"p1":{"allowed":"true","legalBasisCode":"consent_optout"},"p2":{"allowed":"false","legalBasisCode":"consent_optout"}}}',
        ),
      )
      const expectedConsent: ConsentStatus = {
        p1: true,
        p2: false,
      }
      expect(getConsent(w)).toEqual(expectedConsent)
      expect(mockGetCookie).toHaveBeenCalledWith(w, '_swb_ketch_')
    })
  })
})