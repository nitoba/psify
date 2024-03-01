import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAuthPsychologist } from 'test/factories/auth/make-auth-psychologist'
import { InMemoryAuthPsychologistRepository } from 'test/repositories/auth/in-memory-psychologist-repository'

import { left } from '@/core/either'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { Email } from '@/domain/core/enterprise/value-objects/email'

import { HashGenerator } from '../cryptography/hash-generator'
import { RegisterPsychologistUseCase } from './register-psychologist'

let mockRepo: InMemoryAuthPsychologistRepository
let mockHasher: HashGenerator
let useCase: RegisterPsychologistUseCase

describe('RegisterPsychologistUseCase', () => {
  beforeEach(() => {
    mockRepo = new InMemoryAuthPsychologistRepository()
    mockHasher = new FakeHasher()
    useCase = new RegisterPsychologistUseCase(mockRepo, mockHasher)
  })

  const request = {
    name: 'John Doe',
    email: 'john@doe.com',
    phone: '(88) 987654321',
    crp: '1234567',
    password: 'password',
    specialty: 'Cardiology',
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

  it('should return invalid resource error if crp is invalid', async () => {
    const invalidCRPRequest = {
      ...request,
      crp: 'a'.repeat(16),
    }

    const result = await useCase.execute(invalidCRPRequest)

    expect(result).toEqual(left(expect.any(InvalidResource)))
  })

  it('should return resource not found error if psychologist already exists', async () => {
    const psychologist = makeAuthPsychologist({
      email: Email.create(request.email).value as Email,
    })

    mockRepo.psychologists.push(psychologist)

    const result = await useCase.execute(request)

    expect(result.isLeft()).toBeTruthy()
  })

  it('should create psychologist and return right', async () => {
    const hashedPassword = await mockHasher.hash(request.password)

    const result = await useCase.execute(request)

    expect(result.isRight()).toBeTruthy()
    expect(mockRepo.psychologists.length).toBe(1)
    expect(mockRepo.psychologists[0].password).toBe(hashedPassword)
  })
})
