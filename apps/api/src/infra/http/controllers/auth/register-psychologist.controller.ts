import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { RegisterPsychologistUseCase } from '@/domain/auth/application/use-cases/register-psychologist'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { Public } from '@/infra/auth/decorators/public'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import { mainContract } from '@psyfi/api-contract'

@Controller('/auth/psychologists/register')
export class RegisterPsychologistController {
  constructor(
    private readonly registerPsychologistUseCase: RegisterPsychologistUseCase,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @TsRestHandler(mainContract.authContract.registerPsychologist)
  async handle() {
    return tsRestHandler(
      mainContract.authContract.registerPsychologist,
      async ({ body: { name, email, phone, crp, password } }) => {
        const result = await this.registerPsychologistUseCase.execute({
          name,
          email,
          phone,
          password,
          crp,
        })

        if (result.isLeft() && result.value instanceof ResourceNotFound) {
          const error = new ConflictException(result.value)

          return {
            status: HttpStatus.CONFLICT,
            body: {
              statusCode: error.getStatus(),
              error: error.name,
              message: error.message,
            },
          }
        }

        if (result.isLeft() && result.value instanceof InvalidResource) {
          const error = new BadRequestException(result.value)
          return {
            status: HttpStatus.BAD_REQUEST,
            body: {
              statusCode: error.getStatus(),
              error: error.name,
              message: error.message,
            },
          }
        }

        return {
          status: 201,
          body: null,
        }
      },
    )
  }
}
