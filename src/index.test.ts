import getConsent from './index'
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
      mockGetCookie.mockReturnValue(btoa('{"foo": "bar"}'))
      expect(getConsent(w)).toEqual({ foo: 'bar' })
      expect(mockGetCookie).toHaveBeenCalledWith(w, '_swb_ketch_')
    })
  })
})
