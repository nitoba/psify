import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAuthPsychologist } from 'test/factories/auth/make-auth-psychologist'
import { InMemoryAuthPsychologistRepository } from 'test/repositories/auth/in-memory-psychologist-repository'

import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'

import { ChangePasswordFromPsychologistUseCase } from './change-psychologist-password'

describe('ChangePasswordFromPsychologistUseCase', () => {
  let useCase: ChangePasswordFromPsychologistUseCase
  let psychologistRepository: InMemoryAuthPsychologistRepository
  let fakeHasher: FakeHasher

  beforeEach(() => {
    psychologistRepository = new InMemoryAuthPsychologistRepository()
    fakeHasher = new FakeHasher()
    useCase = new ChangePasswordFromPsychologistUseCase(
      psychologistRepository,
      fakeHasher,
      fakeHasher,
    )
  })

  it('should return invalid credentials if psychologist not found', async () => {
    const result = await useCase.execute({
      psychologistId: '123',
      oldPassword: 'any',
      newPassword: 'new',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })

  it('should return invalid credentials if old password does not match', async () => {
    const psychologist = makeAuthPsychologist()

    psychologistRepository.psychologists.push(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      oldPassword: 'incorrect',
      newPassword: 'new',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidCredentials)
  })

  it('should update password if old password matches', async () => {
    const psychologist = makeAuthPsychologist({
      password: await fakeHasher.hash('1234'),
    })

    psychologistRepository.psychologists.push(psychologist)

    await useCase.execute({
      psychologistId: psychologist.id.toString(),
      oldPassword: '1234',
      newPassword: 'new',
    })

    expect(psychologistRepository.psychologists[0].password).toBe('new-hashed')
  })
})
