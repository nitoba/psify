import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'

import { Patient } from './patient'

describe('Patient', () => {
  it('should create a valid patient', () => {
    const name = Name.create('John Doe').value as Name
    const email = Email.create('john@doe.com').value as Email
    const phone = Phone.create('(88) 912345678').value as Phone

    const patient = Patient.create({
      name,
      email,
      phone,
      password: 'password123',
    })

    expect(patient.name).toEqual('John Doe')
    expect(patient.email).toEqual('john@doe.com')
    expect(patient.phone).toEqual('(88) 912345678')
    expect(patient.password).toEqual('password123')
    expect(patient.id).toBeInstanceOf(UniqueEntityID)
  })

  it('should set createdAt to current date if not provided', () => {
    const name = Name.create('John Doe').value as Name
    const email = Email.create('john@doe.com').value as Email
    const phone = Phone.create('(88) 912345678').value as Phone

    const patient = Patient.create({
      name,
      email,
      phone,
      password: 'password456',
    })

    expect(patient.createdAt).toBeInstanceOf(Date)
  })

  it('should use provided createdAt', () => {
    const name = Name.create('John Doe').value as Name
    const email = Email.create('john@doe.com').value as Email
    const phone = Phone.create('(88) 912345678').value as Phone
    const createdAt = new Date(2020, 1, 1)

    const patient = Patient.create({
      name,
      email,
      phone,
      password: 'password789',
      createdAt,
    })

    expect(patient.createdAt).toEqual(createdAt)
  })

  it('should accept custom ID', () => {
    const id = new UniqueEntityID()

    const name = Name.create('John Doe').value as Name
    const email = Email.create('john@doe.com').value as Email
    const phone = Phone.create('(88) 912345678').value as Phone

    const patient = Patient.create(
      {
        name,
        email,
        phone,
        password: 'password101112',
      },
      id,
    )

    expect(patient.id).toEqual(id)
  })
})
