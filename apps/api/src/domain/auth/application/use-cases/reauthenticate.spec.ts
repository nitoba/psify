import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { ReauthenticateUseCase } from './reauthenticate'
import { left, right } from '@/core/either'
import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'

describe('ReauthenticateUseCase', () => {
  let useCase: ReauthenticateUseCase
  let fakeEncrypter: FakeEncrypter

  beforeEach(() => {
    fakeEncrypter = new FakeEncrypter()
    useCase = new ReauthenticateUseCase(fakeEncrypter)
  })

  describe('execute', () => {
    it('should return InvalidCredentials error if refresh token is invalid', async () => {
      const result = await useCase.execute({
        refreshToken: 'invalid_token',
      })

      expect(result).toEqual(left(new InvalidCredentials()))
    })

    it('should return new access and refresh tokens if refresh token is valid', async () => {
      vi.spyOn(fakeEncrypter, 'decrypt').mockResolvedValue({
        sub: '123',
        email: 'john@doe.com',
        role: 'psychologist',
      })
      const result = await useCase.execute({
        refreshToken: 'valid-token',
      })

      expect(result).toEqual(
        right({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      )
    })
  })
})
