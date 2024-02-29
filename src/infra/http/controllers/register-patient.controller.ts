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
import { RegisterPatientUseCase } from '@/domain/auth/application/use-cases/register-patient'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createPatientBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\(\d{2}\) 9\d{8}$/, { message: 'Invalid phone number format' }),
  password: z.string().min(6),
})

type CreatePatientBody = z.infer<typeof createPatientBodySchema>

@Controller('/auth/patients/register')
export class RegisterPatientController {
  constructor(
    private readonly registerPatientUseCase: RegisterPatientUseCase,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Body(new ZodValidationPipe(createPatientBodySchema))
    { email, name, phone, password }: CreatePatientBody,
  ) {
    const result = await this.registerPatientUseCase.execute({
      name,
      email,
      phone,
      password,
    })

    if (result.isLeft() && result.value instanceof ResourceNotFound) {
      return new ConflictException(result.value)
    }

    if (result.isLeft() && result.value instanceof InvalidResource) {
      return new BadRequestException(result.value)
    }
  }
}
