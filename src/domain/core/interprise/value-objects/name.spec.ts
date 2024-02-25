import { Name } from './name'

describe('Name', () => {
  it('should not create an invalid name', () => {
    const name = Name.create('')
    expect(name.isLeft()).toBeTruthy()
  })

  it('should not create a name that is too short', () => {
    const name = Name.create('ab')
    expect(name.isLeft()).toBeTruthy()
  })

  it('should not create a name that is too long', () => {
    const name = Name.create('a'.repeat(256))
    expect(name.isLeft()).toBeTruthy()
  })

  it('should create a valid name', () => {
    const name = Name.create('John Doe')
    expect(name.isRight()).toBeTruthy()
  })
})
