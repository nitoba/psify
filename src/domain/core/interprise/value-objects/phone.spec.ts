import { InvalidResource } from '../errors/invalid-resource'
import { Phone } from './phone'

describe('Phone', () => {
  it('should not create a phone with invalid format', () => {
    const phone = Phone.create('123')
    expect(phone.isLeft()).toBeTruthy()
    expect(phone.value).toEqual(new InvalidResource('Invalid phone'))
  })

  it('should create a phone with 10 digits', () => {
    const phone = Phone.create('1234567890')
    expect(phone.isRight()).toBe(true)

    if (phone.isRight()) {
      expect(phone.value.value).toEqual('1234567890')
    }
  })

  it('should create a phone with 11 digits', () => {
    const phone = Phone.create('12345678901')
    expect(phone.isRight()).toBeTruthy()
    if (phone.isRight()) {
      expect(phone.value.value).toEqual('12345678901')
    }
  })

  it('should not create a phone with less than 10 digits', () => {
    const phone = Phone.create('123456789')
    expect(phone.isLeft()).toBeTruthy()
    if (phone.isLeft()) {
      expect(phone.value).toEqual(new InvalidResource('Invalid phone'))
    }
  })

  it('should not create a phone with more than 11 digits', () => {
    const phone = Phone.create('123456789012')
    expect(phone.isLeft()).toBeTruthy()
    if (phone.isLeft()) {
      expect(phone.value).toEqual(new InvalidResource('Invalid phone'))
    }
  })
})
