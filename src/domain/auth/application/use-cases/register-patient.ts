import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'

import { Patient } from '../../enterprise/entities/patient'
import { HashGenerator } from '../cryptography/hash-generator'
import { AuthPatientRepository } from '../repositories/auth-patient-repository'

type RegisterPatientUseCaseRequest = {
  name: string
  email: string
  phone: string
  password: string
}

type RegisterPatientUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  undefined
>

export class RegisterPatientUseCase {
  constructor(
    private readonly authPatientRepository: AuthPatientRepository,
    private readonly hasher: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    phone,
    password,
  }: RegisterPatientUseCaseRequest): Promise<RegisterPatientUseCaseResponse> {
    const patientExists = await this.authPatientRepository.findByEmail(email)

    if (patientExists) {
      return left(new ResourceNotFound('Patient already exists'))
    }

    const emailVo = Email.create(email)
    const nameVo = Name.create(name)
    const phoneVo = Phone.create(phone)

    if (emailVo.isLeft()) {
      return left(emailVo.value)
    }

    if (nameVo.isLeft()) {
      return left(nameVo.value)
    }

    if (phoneVo.isLeft()) {
      return left(phoneVo.value)
    }

    const hashedPassword = await this.hasher.hash(password)

    const patient = Patient.create({
      name: nameVo.value,
      email: emailVo.value,
      phone: phoneVo.value,
      password: hashedPassword,
    })

    await this.authPatientRepository.create(patient)

    return right(undefined)
  }
}
