import { Body, Controller, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { z } from 'zod'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
})

type CreateBodySchema = z.infer<typeof schema>

@Controller()
export class AppController {
  constructor(private readonly jwt: JwtService) {}

  @Post()
  async hello(@Body(new ZodValidationPipe(schema)) body: CreateBodySchema) {
    const token = await this.jwt.signAsync(body)

    return {
      token,
    }
  }
}
