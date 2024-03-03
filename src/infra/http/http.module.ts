import { Module } from '@nestjs/common'

import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { AuthPsychologistRepository } from '@/domain/auth/application/repositories/auth-psychologist-repository'
import { AuthenticatePatientUseCase } from '@/domain/auth/application/use-cases/authenticate-patient'
import { AuthenticatePsychologistUseCase } from '@/domain/auth/application/use-cases/authenticate-psychologist'
import { RegisterPatientUseCase } from '@/domain/auth/application/use-cases/register-patient'
import { RegisterPsychologistUseCase } from '@/domain/auth/application/use-cases/register-psychologist'
import { PsychologistRepository } from '@/domain/psychologist/application/repositories/psychology-repository'
import { AddAvailableTimeUseCase } from '@/domain/psychologist/application/use-cases/add-available-time'
import { FetchAvailableTimesUseCase } from '@/domain/psychologist/application/use-cases/fetch-available-times'
import { FetchPsychologistsUseCase } from '@/domain/psychologist/application/use-cases/fetch-psychologists'
import { RemoveAvailableTimeUseCase } from '@/domain/psychologist/application/use-cases/remove-available-time'
import { UpdateAvailableTimesUseCase } from '@/domain/psychologist/application/use-cases/update-available-times'
import { UpdateSpecialtyUseCase } from '@/domain/psychologist/application/use-cases/update-specialties'

import { AuthModule } from '../auth/auth.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { DrizzleAuthPatientRepository } from '../database/drizzle/repositories/auth/drizzle-auth-patient-repository'
import { DrizzleAuthPsychologistRepository } from '../database/drizzle/repositories/auth/drizzle-auth-psychologist-repository'
import { DrizzlePsychologistRepository } from '../database/drizzle/repositories/psychologist-repository'
import { AuthenticatePatientController } from './controllers/auth/authenticate-patient.controller'
import { AuthenticatePsychologistController } from './controllers/auth/authenticate-psychologist.controller'
import { RegisterPatientController } from './controllers/auth/register-patient.controller'
import { RegisterPsychologistController } from './controllers/auth/register-psychologist.controller'
import { AddAvailableTimesController } from './controllers/psychologist/add-available-times.controller'
import { FetchAvailableTimesController } from './controllers/psychologist/fetch-available-times.controller'
import { FetchPsychologistsController } from './controllers/psychologist/fetch-psychologists.controller'
import { RemoveAvailableTimesController } from './controllers/psychologist/remove-available-times.controller'
import { UpdateAvailableTimesController } from './controllers/psychologist/update-available-times.controller'
import { UpdateSpecialtiesController } from './controllers/psychologist/update-specialties.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule],
  controllers: [
    // Auth Controllers
    RegisterPatientController,
    RegisterPsychologistController,
    AuthenticatePatientController,
    AuthenticatePsychologistController,
    // Psychologists Controllers
    UpdateSpecialtiesController,
    AddAvailableTimesController,
    RemoveAvailableTimesController,
    UpdateAvailableTimesController,
    FetchAvailableTimesController,
    FetchPsychologistsController,
  ],
  providers: [
    // Repositories
    {
      provide: AuthPatientRepository,
      useClass: DrizzleAuthPatientRepository,
    },
    {
      provide: AuthPsychologistRepository,
      useClass: DrizzleAuthPsychologistRepository,
    },
    {
      provide: PsychologistRepository,
      useClass: DrizzlePsychologistRepository,
    },
    // Auth UseCases
    RegisterPatientUseCase,
    RegisterPsychologistUseCase,
    AuthenticatePatientUseCase,
    AuthenticatePsychologistUseCase,
    // Psychologists UseCases
    UpdateSpecialtyUseCase,
    AddAvailableTimeUseCase,
    RemoveAvailableTimeUseCase,
    UpdateAvailableTimesUseCase,
    FetchAvailableTimesUseCase,
    FetchPsychologistsUseCase,
  ],
})
export class HttpModule {}
