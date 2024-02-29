import { Module } from '@nestjs/common'

import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { RegisterPatientUseCase } from '@/domain/auth/application/use-cases/register-patient'

import { AuthModule } from '../auth/auth.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { DrizzleAuthPatientRepository } from '../database/drizzle/repositories/drizzle-auth-patient-repository'
import { RegisterPatientController } from './controllers/register-patient.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule],
  controllers: [RegisterPatientController],
  providers: [
    {
      provide: AuthPatientRepository,
      useClass: DrizzleAuthPatientRepository,
    },
    RegisterPatientUseCase,
  ],
})
export class HttpModule {}
