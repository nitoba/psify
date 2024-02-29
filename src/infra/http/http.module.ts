import { Module } from '@nestjs/common'

import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { AuthenticatePatientUseCase } from '@/domain/auth/application/use-cases/authenticate-patient'
import { RegisterPatientUseCase } from '@/domain/auth/application/use-cases/register-patient'

import { AuthModule } from '../auth/auth.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { DrizzleAuthPatientRepository } from '../database/drizzle/repositories/drizzle-auth-patient-repository'
import { AuthenticatePatientController } from './controllers/authenticate-patient.controller'
import { RegisterPatientController } from './controllers/register-patient.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule],
  controllers: [RegisterPatientController, AuthenticatePatientController],
  providers: [
    {
      provide: AuthPatientRepository,
      useClass: DrizzleAuthPatientRepository,
    },
    RegisterPatientUseCase,
    AuthenticatePatientUseCase,
  ],
})
export class HttpModule {}
