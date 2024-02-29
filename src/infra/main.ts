import fastifyCookie from '@fastify/cookie'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { ZodFilter } from './http/filters/zod-error-filter'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )
  await app.register(fastifyCookie)

  app.useGlobalFilters(new ZodFilter())

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  await app.listen(port, '0.0.0.0')
}
bootstrap()
