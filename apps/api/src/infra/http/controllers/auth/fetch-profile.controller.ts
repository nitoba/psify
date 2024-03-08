import { Controller, Get, HttpStatus, NotFoundException } from '@nestjs/common'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { FetchProfileUseCase as FetchProfileFromPatient } from '@/domain/patient/application/use-cases/fetch-profile'
import { FetchProfileUseCase as FetchProfileFromPsychologist } from '@/domain/psychologist/application/use-cases/fetch-profile'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import { Role } from '@/infra/auth/roles'
import { PayloadUser } from '@/infra/auth/strategies/jwt.strategy'

import { PatientPresenter } from '../../presenters/patient-presenter'
import { PsychologistPresenter } from '../../presenters/psychologists-presenter'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import { appRouter } from '@psyfi/api-contract'

@Controller('/me')
export class FetchProfileController {
  constructor(
    private readonly patientProfileUseCase: FetchProfileFromPatient,
    private readonly psychologistProfileUseCase: FetchProfileFromPsychologist,
  ) {}

  @Get()
  @TsRestHandler(appRouter.auth.profile)
  async handle(@CurrentUser() { sub: userId, role }: PayloadUser) {
    return tsRestHandler(appRouter.auth.profile, async () => {
      if (role === Role.Patient) {
        const result = await this.patientProfileUseCase.execute({
          patientId: userId,
        })

        if (result.isLeft() && result.value instanceof ResourceNotFound) {
          const error = new NotFoundException(result.value)

          return {
            status: HttpStatus.NOT_FOUND,
            body: {
              error: error.name,
              message: error.message,
              statusCode: error.getStatus(),
            },
          }
        }

        if (result.isRight()) {
          const patient = PatientPresenter.toHttp(result.value.profile)

          return {
            status: 200,
            body: patient,
          }
        }
      }

      if (role === Role.Psychologist) {
        const result = await this.psychologistProfileUseCase.execute({
          psychologistId: userId,
        })

        if (result.isLeft() && result.value instanceof ResourceNotFound) {
          const error = new NotFoundException(result.value)

          return {
            status: HttpStatus.NOT_FOUND,
            body: {
              error: error.name,
              message: error.message,
              statusCode: error.getStatus(),
            },
          }
        }

        if (result.isRight()) {
          const psychologist = PsychologistPresenter.toHttp(
            result.value.profile,
          )

          return {
            status: 200,
            body: psychologist,
          }
        }
      }

      return {
        status: 404,
        body: {
          error: 'not found',
          message: 'not found',
          statusCode: 404,
        },
      }
    })
  }
}
