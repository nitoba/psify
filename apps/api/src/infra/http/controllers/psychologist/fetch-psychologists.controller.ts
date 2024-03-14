import { Controller, Get, UseGuards } from '@nestjs/common'
import { FetchPsychologistsUseCase } from '@/domain/psychologist/application/use-cases/fetch-psychologists'
import { PsychologistPresenter } from '../../presenters/psychologists-presenter'
import { RolesGuard } from '@/infra/auth/guards/roles-guard'
import { Role } from '@/infra/auth/roles'
import { Roles } from '@/infra/auth/decorators/roles-decorator'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import { appRouter } from '@psyfi/api-contract'

@Controller('/psychologists')
export class FetchPsychologistsController {
  constructor(private readonly useCase: FetchPsychologistsUseCase) {}

  @Get()
  @Roles(Role.Psychologist, Role.Patient)
  @UseGuards(RolesGuard)
  @TsRestHandler(appRouter.psychologists.fetchPsychologists)
  handle() {
    return tsRestHandler(
      appRouter.psychologists.fetchPsychologists,
      async ({ query: { page, name, specialties } }) => {
        const specialtiesArray = specialties
          ? specialties.split(',')
          : undefined

        console.log(page, name, specialtiesArray)

        const result = await this.useCase.execute({
          page,
          name,
          specialties: specialtiesArray,
        })

        if (result.isLeft()) {
          return {
            status: 200,
            body: {
              psychologists: [],
              total: 0,
            },
          }
        }

        if (result.isRight()) {
          return {
            status: 200,
            body: {
              total: result.value.total,
              psychologists: result.value.psychologists.map(
                PsychologistPresenter.toHttp,
              ),
            },
          }
        }

        return {
          status: 200,
          body: {
            psychologists: [],
            total: 0,
          },
        }
      },
    )
  }
}
