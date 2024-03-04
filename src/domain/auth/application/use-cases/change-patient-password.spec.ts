import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAuthPatient } from 'test/factories/auth/make-auth-patient'
import { InMemoryAuthPatientRepository } from 'test/repositories/auth/in-memory-patient-repository'

import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'

import { ChangePasswordFromPatientUseCase } from './change-patient-password'

describe('ChangePasswordFromPatientUseCase', () => {
  let useCase: ChangePasswordFromPatientUseCase
  let patientRepository: InMemoryAuthPatientRepository
  let fakeHasher: FakeHasher

  beforeEach(() => {
    patientRepository = new InMemoryAuthPatientRepository()
    fakeHasher = new FakeHasher()
    useCase = new ChangePasswordFromPatientUseCase(
      patientRepository,
      fakeHasher,
      fakeHasher,
    )
  })

  it('should return invalid credentials if patient not found', async () => {
    const result = await useCase.execute({
      patientId: '123',
      oldPassword: 'any',
      newPassword: 'new',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })

  it('should return invalid credentials if old password does not match', async () => {
    const patient = makeAuthPatient()

    patientRepository.patients.push(patient)

    const result = await useCase.execute({
      patientId: patient.id.toString(),
      oldPassword: 'incorrect',
      newPassword: 'new',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })

  it('should update password if old password matches', async () => {
    const patient = makeAuthPatient({
      password: await fakeHasher.hash('1234'),
    })

    patientRepository.patients.push(patient)

    await useCase.execute({
      patientId: patient.id.toString(),
      oldPassword: '1234',
      newPassword: 'new',
    })

    expect(patientRepository.patients[0].password).toBe('new-hashed')
  })
})
