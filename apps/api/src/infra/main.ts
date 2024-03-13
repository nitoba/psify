import fastifyCookie from '@fastify/cookie'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { ZodFilter } from './http/filters/zod-error-filter'
import { runMigrations } from './database/drizzle/migrate'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { rawBody: true },
  )

  app.enableCors({
    credentials: true,
    exposedHeaders: ['set-cookie'],
    origin: ['http://localhost:3000', 'http://localhost:3001'],
  })

  await app.register(fastifyCookie as never)

  app.useGlobalFilters(new ZodFilter())


  await runMigrations()

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  await app.listen(port, '0.0.0.0')
}
bootstrap()
