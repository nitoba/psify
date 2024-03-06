import { Controller, Get, NotFoundException, Query } from '@nestjs/common'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { FetchPsychologistsUseCase } from '@/domain/psychologist/application/use-cases/fetch-psychologists'

import { PsychologistPresenter } from '../../presenters/psychologists-presenter'

@Controller('/psychologists')
export class FetchPsychologistsController {
  constructor(private readonly useCase: FetchPsychologistsUseCase) {}

  @Get()
  async handle(
    @Query('page') page: number = 1,
    @Query('name') name?: string,
    @Query('specialties') specialties?: string,
  ) {
    const specialtiesArray = specialties ? specialties.split(',') : undefined

    const result = await this.useCase.execute({
      page,
      name,
      specialties: specialtiesArray,
    })

    if (result.isLeft() && result.value instanceof ResourceNotFound) {
      throw new NotFoundException(result.value)
    }

    if (result.isRight()) {
      return {
        psychologists: result.value.psychologists.map(
          PsychologistPresenter.toHttp,
        ),
      }
    }
  }
}
