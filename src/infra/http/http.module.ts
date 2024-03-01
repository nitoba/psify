import { Module } from '@nestjs/common'

import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { AuthPsychologistRepository } from '@/domain/auth/application/repositories/auth-psychologist-repository'
import { AuthenticatePatientUseCase } from '@/domain/auth/application/use-cases/authenticate-patient'
import { AuthenticatePsychologistUseCase } from '@/domain/auth/application/use-cases/authenticate-psychologist'
import { RegisterPatientUseCase } from '@/domain/auth/application/use-cases/register-patient'
import { RegisterPsychologistUseCase } from '@/domain/auth/application/use-cases/register-psychologist'

import { AuthModule } from '../auth/auth.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { DrizzleAuthPatientRepository } from '../database/drizzle/repositories/drizzle-auth-patient-repository'
import { DrizzleAuthPsychologistRepository } from '../database/drizzle/repositories/drizzle-auth-psychologist-repository'
import { AuthenticatePatientController } from './controllers/auth/authenticate-patient.controller'
import { AuthenticatePsychologistController } from './controllers/auth/authenticate-psychologist.controller'
import { RegisterPatientController } from './controllers/auth/register-patient.controller'
import { RegisterPsychologistController } from './controllers/auth/register-psychologist.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule],
  controllers: [
    RegisterPatientController,
    RegisterPsychologistController,
    AuthenticatePatientController,
    AuthenticatePsychologistController,
  ],
  providers: [
    {
      provide: AuthPatientRepository,
      useClass: DrizzleAuthPatientRepository,
    },
    {
      provide: AuthPsychologistRepository,
      useClass: DrizzleAuthPsychologistRepository,
    },
    RegisterPatientUseCase,
    RegisterPsychologistUseCase,
    AuthenticatePatientUseCase,
    AuthenticatePsychologistUseCase,
  ],
})
export class HttpModule {}
