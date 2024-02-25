import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { CRP } from '@/domain/core/enterprise/value-objects/crp'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'

import { Psychologist } from '../../enterprise/entities/psychologist'
import { HashGenerator } from '../cryptography/hash-generator'
import { AuthPsychologistRepository } from '../repositories/auth-psychologist-repository'

type RegisterPsychologistUseCaseRequest = {
  name: string
  email: string
  phone: string
  password: string
  crp: string
}

type RegisterPsychologistUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  undefined
>

export class RegisterPsychologistUseCase {
  constructor(
    private readonly authPsychologistRepository: AuthPsychologistRepository,
    private readonly hasher: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    phone,
    crp,
    password,
  }: RegisterPsychologistUseCaseRequest): Promise<RegisterPsychologistUseCaseResponse> {
    const psychologistExists =
      await this.authPsychologistRepository.findByEmail(email)

    if (psychologistExists) {
      return left(new ResourceNotFound('Psychologist already exists'))
    }

    const emailVo = Email.create(email)
    const nameVo = Name.create(name)
    const phoneVo = Phone.create(phone)
    const crpVo = CRP.create(crp)

    if (emailVo.isLeft()) {
      return left(emailVo.value)
    }

    if (nameVo.isLeft()) {
      return left(nameVo.value)
    }

    if (phoneVo.isLeft()) {
      return left(phoneVo.value)
    }

    if (crpVo.isLeft()) {
      return left(crpVo.value)
    }

    const hashedPassword = await this.hasher.hash(password)

    const psychologist = Psychologist.create({
      name: nameVo.value,
      email: emailVo.value,
      phone: phoneVo.value,
      crp: crpVo.value,
      password: hashedPassword,
    })

    await this.authPsychologistRepository.create(psychologist)

    return right(undefined)
  }
}
