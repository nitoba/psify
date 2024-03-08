import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAuthPatientOrPsychologist } from 'test/factories/auth/make-auth-user'
import { InMemoryAuthUserRepository } from 'test/repositories/auth/in-memory-user-repository'

import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'

import { AuthenticateUseCase } from './authenticate'
import { CRP } from '@/domain/psychologist/enterprise/value-objects/crp'

describe('AuthenticateUseCase', () => {
  let useCase: AuthenticateUseCase
  let repository: InMemoryAuthUserRepository
  let encrypter: FakeEncrypter
  let hashComparer: FakeHasher

  beforeEach(() => {
    repository = new InMemoryAuthUserRepository()
    encrypter = new FakeEncrypter()
    hashComparer = new FakeHasher()
    useCase = new AuthenticateUseCase(repository, hashComparer, encrypter)
  })

  it('should return invalid credentials error if  not found', async () => {
    const result = await useCase.execute({
      email: 'invalid@email.com',
      password: 'any',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })

  it('should return invalid credentials error if password does not match', async () => {
    const user = makeAuthPatientOrPsychologist()
    repository.create(user)

    const result = await useCase.execute({
      email: user.email,
      password: 'invalid',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })

  it('should return access token if credentials are valid for patient', async () => {
    const hash = await hashComparer.hash('12345678')

    const user = makeAuthPatientOrPsychologist({
      password: hash,
    })
    repository.create(user)

    const result = await useCase.execute({
      email: user.email,
      password: '12345678',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveProperty('accessToken')
  })

  it('should return access token if credentials are valid for psychologist', async () => {
    const hash = await hashComparer.hash('12345678')

    const user = makeAuthPatientOrPsychologist({
      crp: CRP.create('1234567').value as CRP,
      password: hash,
    })
    repository.create(user)

    const result = await useCase.execute({
      email: user.email,
      password: '12345678',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveProperty('accessToken')
    expect(result.value).toHaveProperty('refreshToken')
  })
})
