import { left } from '@/core/either'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeAuthPatient } from '@/test/factories/auth/make-auth-patient'
import { InMemoryAuthPatientRepository } from '@/test/repositories/auth/in-memory-patient-repository'

import { HashGenerator } from '../cryptography/hash-generator'
import { RegisterPatientUseCase } from './register-patient'

let mockRepo: InMemoryAuthPatientRepository
let mockHasher: HashGenerator
let useCase: RegisterPatientUseCase

describe('RegisterPatientUseCase', () => {
  beforeEach(() => {
    mockRepo = new InMemoryAuthPatientRepository()
    mockHasher = new FakeHasher()
    useCase = new RegisterPatientUseCase(mockRepo, mockHasher)
  })

  const request = {
    name: 'John Doe',
    email: 'john@doe.com',
    phone: '(88) 987654321',
    password: 'password',
  }

  it('should return invalid resource error if email is invalid', async () => {
    const invalidEmailRequest = {
      ...request,
      email: 'invalid',
    }

    const result = await useCase.execute(invalidEmailRequest)
    expect(result).toEqual(left(expect.any(InvalidResource)))
  })

  it('should return invalid resource error if name is invalid', async () => {
    const invalidNameRequest = {
      ...request,
      name: '',
    }

    const result = await useCase.execute(invalidNameRequest)
    expect(result).toEqual(left(expect.any(InvalidResource)))
  })

  it('should return invalid resource error if phone is invalid', async () => {
    const invalidPhoneRequest = {
      ...request,
      phone: 'invalid',
    }

    const result = await useCase.execute(invalidPhoneRequest)

    expect(result).toEqual(left(expect.any(InvalidResource)))
  })

  it('should return resource not found error if patient already exists', async () => {
    const patient = makeAuthPatient({
      email: Email.create(request.email).value as Email,
    })

    mockRepo.patients.push(patient)

    const result = await useCase.execute(request)

    expect(result.isLeft()).toBeTruthy()
  })

  it('should create patient and return right', async () => {
    const hashedPassword = await mockHasher.hash(request.password)

    const result = await useCase.execute(request)

    expect(result.isRight()).toBeTruthy()
    expect(mockRepo.patients.length).toBe(1)
    expect(mockRepo.patients[0].password).toBe(hashedPassword)
  })
})
