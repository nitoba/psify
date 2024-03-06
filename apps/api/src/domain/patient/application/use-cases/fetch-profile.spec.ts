import { makePatient } from 'test/factories/patient/make-patient'
import { InMemoryPatientRepository } from 'test/repositories/patient/in-memory-patient-repository'

import { left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'

import { FetchProfileUseCase } from './fetch-profile'

describe('FetchProfileUseCase', () => {
  let fetchProfileUseCase: FetchProfileUseCase
  let patientRepository: InMemoryPatientRepository

  beforeEach(() => {
    patientRepository = new InMemoryPatientRepository()
    fetchProfileUseCase = new FetchProfileUseCase(patientRepository)
  })
  it('should return patient profile if patient is found', async () => {
    const patient = makePatient()

    patientRepository.patients.push(patient)

    const result = await fetchProfileUseCase.execute({
      patientId: patient.id.toString(),
    })

    expect(result).toEqual(right({ profile: patient }))
  })

  it('should return ResourceNotFound error if patient not found', async () => {
    const result = await fetchProfileUseCase.execute({
      patientId: new UniqueEntityID().toString(),
    })

    expect(result).toEqual(left(new ResourceNotFound('Patient not found')))
  })
})
