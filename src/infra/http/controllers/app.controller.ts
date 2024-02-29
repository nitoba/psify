import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
})

type CreateBodySchema = z.infer<typeof schema>

@Controller()
export class AppController {
  constructor(private readonly drizzle: DrizzleService) {}

  @Post()
  async hello(@Body(new ZodValidationPipe(schema)) body: CreateBodySchema) {
    console.log(body)
  }
}
