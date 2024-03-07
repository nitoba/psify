import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { RegisterPatientUseCase } from '@/domain/auth/application/use-cases/register-patient'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { Public } from '@/infra/auth/decorators/public'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import { mainContract } from '@psyfi/api-contract'
@Controller('/auth/patients/register')
export class RegisterPatientController {
  constructor(
    private readonly registerPatientUseCase: RegisterPatientUseCase,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @TsRestHandler(mainContract.authContract.registerPatient)
  async handle() {
    return tsRestHandler(
      mainContract.authContract.registerPatient,
      async ({ body: { name, email, phone, password } }) => {
        const result = await this.registerPatientUseCase.execute({
          name,
          email,
          phone,
          password,
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
