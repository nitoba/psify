import { Email } from './email'

describe('Email', () => {
  it('should not create an invalid email', () => {
    const email = Email.create('invalid-email')
    expect(email.isLeft()).toBeTruthy()
  })

  it('should create a valid email', () => {
    const email = Email.create('bqY6T@example.com')
    expect(email.isRight()).toBeTruthy()
  })
})
