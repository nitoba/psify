import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAuthPatient } from 'test/factories/auth/make-auth-patient'
import { InMemoryAuthPatientRepository } from 'test/repositories/auth/in-memory-patient-repository'

import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'

import { AuthenticatePatientUseCase } from './authenticate-patient'

describe('AuthenticatePatientUseCase', () => {
  let useCase: AuthenticatePatientUseCase
  let patientRepository: InMemoryAuthPatientRepository
  let encrypter: FakeEncrypter
  let hashComparer: FakeHasher

  beforeEach(() => {
    patientRepository = new InMemoryAuthPatientRepository()
    encrypter = new FakeEncrypter()
    hashComparer = new FakeHasher()
    useCase = new AuthenticatePatientUseCase(
      patientRepository,
      hashComparer,
      encrypter,
    )
  })

  it('should return invalid credentials error if patient not found', async () => {
    const result = await useCase.execute({
      email: 'invalid@email.com',
      password: 'any',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })

  it('should return invalid credentials error if password does not match', async () => {
    const patient = makeAuthPatient()
    patientRepository.create(patient)

    const result = await useCase.execute({
      email: patient.email,
      password: 'invalid',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })

  it('should return access token if credentials are valid', async () => {
    const hash = await hashComparer.hash('12345678')

    const patient = makeAuthPatient({
      password: hash,
    })
    patientRepository.create(patient)

    const result = await useCase.execute({
      email: patient.email,
      password: '12345678',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveProperty('accessToken')
  })
})
