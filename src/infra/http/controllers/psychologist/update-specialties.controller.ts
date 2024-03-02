import { Controller, Put } from '@nestjs/common'

import { UpdateSpecialtyUseCase } from '@/domain/psychologist/application/use-cases/update-specialties'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import { PayloadUser } from '@/infra/auth/strategies/jwt.strategy'

@Controller('/psychologists/specialties')
export class UpdateSpecialtiesController {
  constructor(private readonly useCase: UpdateSpecialtyUseCase) {}

  @Put()
  async handle(@CurrentUser() user: PayloadUser) {
    console.log(user.sub)
  }
}
