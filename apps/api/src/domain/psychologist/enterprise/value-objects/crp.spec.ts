import { InvalidResource } from '../../../core/enterprise/errors/invalid-resource'
import { CRP } from './crp'

describe('CRP', () => {
  it('should not create CRP with invalid value', () => {
    const invalidCRP = 'a'.repeat(16)
    const result = CRP.create(invalidCRP)

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new InvalidResource('Invalid CRP'))
  })

  it('should create valid CRP', () => {
    const validCRP = '1122222'
    const result = CRP.create(validCRP)

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.value).toEqual(validCRP)
    }
  })
})
