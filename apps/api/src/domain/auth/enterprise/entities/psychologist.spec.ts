import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CRP } from '@/domain/psychologist/enterprise/value-objects/crp'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'

import { Psychologist } from './psychologist'

describe('Psychologist', () => {
  it('should create a valid psychologist', () => {
    const name = Name.create('John Doe').value as Name
    const email = Email.create('john@doe.com').value as Email
    const phone = Phone.create('(11) 987654321').value as Phone
    const crp = CRP.create('1234567').value as CRP

    const psychologist = Psychologist.create({
      name,
      email,
      phone,
      crp,
      password: 'password123',
    })

    expect(psychologist.name).toEqual('John Doe')
    expect(psychologist.email).toEqual('john@doe.com')
    expect(psychologist.phone).toEqual('(11) 987654321')
    expect(psychologist.crp).toEqual(crp)
    expect(psychologist.password).toEqual('password123')
    expect(psychologist.id).toBeInstanceOf(UniqueEntityID)
  })

  it('should set createdAt to current date if not provided', () => {
    const name = Name.create('Jane Doe').value as Name
    const email = Email.create('jane@doe.com').value as Email
    const phone = Phone.create('(22) 976543210').value as Phone
    const crp = CRP.create('7654321').value as CRP

    const psychologist = Psychologist.create({
      name,
      email,
      phone,
      crp,
      password: 'password456',
    })

    expect(psychologist.createdAt).toBeInstanceOf(Date)
  })

  it('should use provided createdAt', () => {
    const createdAt = new Date(2020, 1, 1)
    const name = Name.create('Jim Doe').value as Name
    const email = Email.create('jim@doe.com').value as Email
    const phone = Phone.create('(33) 965432109').value as Phone
    const crp = CRP.create('9876543').value as CRP

    const psychologist = Psychologist.create({
      name,
      email,
      phone,
      crp,
      password: 'password789',
      createdAt,
    })

    expect(psychologist.createdAt).toEqual(createdAt)
  })

  it('should accept custom ID', () => {
    const id = new UniqueEntityID()
    const name = Name.create('Jill Doe').value as Name
    const email = Email.create('jill@doe.com').value as Email
    const phone = Phone.create('(44) 954321098').value as Phone
    const crp = CRP.create('8765432').value as CRP

    const psychologist = Psychologist.create(
      {
        name,
        email,
        phone,
        crp,
        password: 'password101112',
      },
      id,
    )

    expect(psychologist.id).toEqual(id)
  })
})
