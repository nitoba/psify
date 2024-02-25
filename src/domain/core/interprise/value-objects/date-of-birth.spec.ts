import { InvalidResource } from '../errors/invalid-resource'
import { DateOfBirth } from './date-of-birth'

describe('DateOfBirth', () => {
  it('should not create an invalid date of birth', () => {
    const invalidDate = new Date('invalid')
    const result = DateOfBirth.create(invalidDate)

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new InvalidResource('Invalid date of birth'))
  })

  it('should create a valid date of birth', () => {
    const validDate = new Date('1980-12-25')
    const result = DateOfBirth.create(validDate)

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.value).toEqual(validDate)
    }
  })
})
