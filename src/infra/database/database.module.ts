import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg'
import { DrizzlePGConfig } from '@knaadh/nestjs-drizzle-pg/src/node-postgres.interface'
import { Module } from '@nestjs/common'

import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { AuthPsychologistRepository } from '@/domain/auth/application/repositories/auth-psychologist-repository'
import { PatientRepository } from '@/domain/patient/application/repositories/patient-repository'
import { OrderRepository } from '@/domain/payment/application/repositories/order-repository'
import { PsychologistRepository } from '@/domain/psychologist/application/repositories/psychology-repository'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'

import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { DrizzleService } from './drizzle/drizzle.service'
import { DrizzleAppointmentRepository } from './drizzle/repositories/appointment-repository'
import { DrizzleAuthPatientRepository } from './drizzle/repositories/auth/drizzle-auth-patient-repository'
import { DrizzleAuthPsychologistRepository } from './drizzle/repositories/auth/drizzle-auth-psychologist-repository'
import { DrizzleOrderRepository } from './drizzle/repositories/order-repository'
import { DrizzlePatientRepository } from './drizzle/repositories/patient-repository'
import { DrizzlePsychologistRepository } from './drizzle/repositories/psychologist-repository'
import * as schema from './drizzle/schemas'

@Module({
  imports: [
    DrizzlePGModule.registerAsync({
      tag: 'DB',
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (env: EnvService): Promise<DrizzlePGConfig> => {
        // process.env.DATABASE_URL = 'test'
        // console.log({ data: env.get('DATABASE_URL') })
        return {
          pg: {
            connection: 'client',
            config: {
              connectionString: env.get('DATABASE_URL'),
            },
          },
          config: {
            schema: { ...schema },
          },
        }
      },
    }),
  ],
  providers: [
    DrizzleService,
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
    {
      provide: PatientRepository,
      useClass: DrizzlePatientRepository,
    },
    {
      provide: AppointmentsRepository,
      useClass: DrizzleAppointmentRepository,
    },
    {
      provide: OrderRepository,
      useClass: DrizzleOrderRepository,
    },
  ],
  exports: [
    DrizzleService,
    AuthPatientRepository,
    AuthPsychologistRepository,
    PsychologistRepository,
    PatientRepository,
    AppointmentsRepository,
    OrderRepository,
  ],
})
export class DatabaseModule {}
