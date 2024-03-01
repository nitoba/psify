import { Module } from '@nestjs/common'

import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { AuthPsychologistRepository } from '@/domain/auth/application/repositories/auth-psychologist-repository'
import { AuthenticatePatientUseCase } from '@/domain/auth/application/use-cases/authenticate-patient'
import { RegisterPatientUseCase } from '@/domain/auth/application/use-cases/register-patient'
import { RegisterPsychologistUseCase } from '@/domain/auth/application/use-cases/register-psychologist'

import { AuthModule } from '../auth/auth.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { DrizzleAuthPatientRepository } from '../database/drizzle/repositories/drizzle-auth-patient-repository'
import { DrizzleAuthPsychologistRepository } from '../database/drizzle/repositories/drizzle-auth-psychologist-repository'
import { AuthenticatePatientController } from './controllers/authenticate-patient.controller'
import { RegisterPatientController } from './controllers/register-patient.controller'
import { RegisterPsychologistController } from './controllers/register-psychologist.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule],
  controllers: [
    RegisterPatientController,
    AuthenticatePatientController,
    RegisterPsychologistController,
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
  ],
})
export class HttpModule {}
