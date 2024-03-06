import { Controller, Get, NotFoundException } from '@nestjs/common'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { FetchProfileUseCase as FetchProfileFromPatient } from '@/domain/patient/application/use-cases/fetch-profile'
import { FetchProfileUseCase as FetchProfileFromPsychologist } from '@/domain/psychologist/application/use-cases/fetch-profile'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import { Role } from '@/infra/auth/roles'
import { PayloadUser } from '@/infra/auth/strategies/jwt.strategy'

import { PatientPresenter } from '../../presenters/patient-presenter'
import { PsychologistPresenter } from '../../presenters/psychologists-presenter'

@Controller('/me')
export class FetchProfileController {
  constructor(
    private readonly patientProfileUseCase: FetchProfileFromPatient,
    private readonly psychologistProfileUseCase: FetchProfileFromPsychologist,
  ) {}

  @Get()
  async handle(@CurrentUser() { sub: userId, role }: PayloadUser) {
    if (role === Role.Patient) {
      const result = await this.patientProfileUseCase.execute({
        patientId: userId,
      })

      if (result.isLeft() && result.value instanceof ResourceNotFound) {
        throw new NotFoundException(result.value)
      }

      if (result.isRight()) {
        return PatientPresenter.toHttp(result.value.profile)
      }
    }

    if (role === Role.Psychologist) {
      const result = await this.psychologistProfileUseCase.execute({
        psychologistId: userId,
      })

      if (result.isLeft() && result.value instanceof ResourceNotFound) {
        throw new NotFoundException(result.value)
      }

      if (result.isRight()) {
        return PsychologistPresenter.toHttp(result.value.profile)
      }
    }
  }
}
