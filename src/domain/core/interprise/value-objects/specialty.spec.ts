import { InvalidResource } from '../errors/invalid-resource'
import { Specialty } from './specialty'

describe('Specialty', () => {
  it('should not create Specialty with invalid value', () => {
    const invalidSpecialty = ''.repeat(300)
    const result = Specialty.create(invalidSpecialty)

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new InvalidResource('Invalid specialty'))
  })

  it('should create valid Specialty', () => {
    const validSpecialty = 'Cardiology'
    const result = Specialty.create(validSpecialty)

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.value).toEqual(validSpecialty)
    }
  })
})
