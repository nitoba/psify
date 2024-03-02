import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common'
import { z } from 'zod'

import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { UpdateSpecialtyUseCase } from '@/domain/psychologist/application/use-cases/update-specialties'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import { PayloadUser } from '@/infra/auth/strategies/jwt.strategy'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const updateSpecialtiesBodySchema = z
  .object({
    adds: z.array(z.string()).optional(),
    removes: z.array(z.string()).optional(),
  })
  .superRefine(({ adds, removes }, ctx) => {
    if (adds?.some((add) => removes?.includes(add))) {
      ctx.addIssue({
        path: ['adds', 'removes'],
        message:
          'the item to add not to be the same item to remove or the other way',
        code: 'custom',
      })
    }
  })

const zodValidationPipe = new ZodValidationPipe(updateSpecialtiesBodySchema)

type UpdateSpecialtyBody = z.infer<typeof updateSpecialtiesBodySchema>

@Controller('/psychologists/specialties')
export class UpdateSpecialtiesController {
  constructor(private readonly useCase: UpdateSpecialtyUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @CurrentUser() user: PayloadUser,
    @Body(zodValidationPipe) { adds, removes }: UpdateSpecialtyBody,
  ) {
    const result = await this.useCase.execute({
      adds,
      removes,
      psychologistId: user.sub,
    })

    if (result.isLeft() && result.value instanceof InvalidResource) {
      throw new BadRequestException(result.value)
    }
  }
}
