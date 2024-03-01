import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAuthPsychologist } from 'test/factories/auth/make-auth-psychologist'
import { InMemoryAuthPsychologistRepository } from 'test/repositories/auth/in-memory-psychologist-repository'

import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'

import { AuthenticatePsychologistUseCase } from './authenticate-psychologist'

describe('AuthenticatePsychologistUseCase', () => {
  let useCase: AuthenticatePsychologistUseCase
  let psychologistRepository: InMemoryAuthPsychologistRepository
  let encrypter: FakeEncrypter
  let hashComparer: FakeHasher

  beforeEach(() => {
    psychologistRepository = new InMemoryAuthPsychologistRepository()
    encrypter = new FakeEncrypter()
    hashComparer = new FakeHasher()
    useCase = new AuthenticatePsychologistUseCase(
      psychologistRepository,
      hashComparer,
      encrypter,
    )
  })

  it('should return invalid credentials error if psychologist not found', async () => {
    const result = await useCase.execute({
      email: 'invalid@email.com',
      password: 'any',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })

  it('should return invalid credentials error if password does not match', async () => {
    const psychologist = makeAuthPsychologist()
    psychologistRepository.create(psychologist)

    const result = await useCase.execute({
      email: psychologist.email,
      password: 'invalid',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })

  it('should return access token if credentials are valid', async () => {
    const hash = await hashComparer.hash('12345678')

    const psychologist = makeAuthPsychologist({
      password: hash,
    })
    psychologistRepository.create(psychologist)

    const result = await useCase.execute({
      email: psychologist.email,
      password: '12345678',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveProperty('accessToken')
  })
})
