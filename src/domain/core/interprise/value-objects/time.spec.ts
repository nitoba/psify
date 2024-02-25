import { InvalidResource } from '../errors/invalid-resource'
import { Time } from './time'

describe('Time', () => {
  it('should not create Time with invalid value', () => {
    const invalidTime = '25:61'
    const result = Time.create(invalidTime)

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new InvalidResource('Invalid time'))
  })

  it('should create valid Time', () => {
    const validTime = '23:45'
    const result = Time.create(validTime)

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.value).toEqual(validTime)
    }
  })
})
