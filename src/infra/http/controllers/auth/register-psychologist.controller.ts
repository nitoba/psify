import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { RegisterPsychologistUseCase } from '@/domain/auth/application/use-cases/register-psychologist'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createPsychologistBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\(\d{2}\) 9\d{8}$/, { message: 'Invalid phone number format' }),
  crp: z.string().length(7, { message: 'CRP must be valid' }),
  password: z.string().min(6),
})

type CreatePsychologistBody = z.infer<typeof createPsychologistBodySchema>

const zodValidationPipe = new ZodValidationPipe(createPsychologistBodySchema)

@Controller('/auth/psychologists/register')
export class RegisterPsychologistController {
  constructor(
    private readonly registerPsychologistUseCase: RegisterPsychologistUseCase,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Body(zodValidationPipe)
    { email, name, phone, password, crp }: CreatePsychologistBody,
  ) {
    const result = await this.registerPsychologistUseCase.execute({
      name,
      email,
      phone,
      password,
      crp,
    })

    if (result.isLeft() && result.value instanceof ResourceNotFound) {
      return new ConflictException(result.value)
    }

    if (result.isLeft() && result.value instanceof InvalidResource) {
      return new BadRequestException(result.value)
    }
  }
}
