import { InvalidResource } from '../errors/invalid-resource'
import { Duration } from './duration'

describe('Duration', () => {
  it('should create a valid Duration', () => {
    const duration = Duration.create(10)

    expect(duration.isRight()).toBeTruthy()

    if (duration.isRight()) {
      expect(duration.value.value).toEqual(10)
    }
  })

  it('should not create Duration with invalid value', () => {
    const duration = Duration.create(10.5)

    expect(duration.isLeft()).toBeTruthy()
    expect(duration.value).toEqual(new InvalidResource('Invalid duration'))
  })
})
