import { Injectable } from '@nestjs/common'

import { PatientRepository } from '@/domain/patient/application/repositories/patient-repository'
import { Patient } from '@/domain/patient/enterprise/entities/patient'

import { DrizzleService } from '../drizzle.service'
import { toDomain } from '../mappers/patient-mapper'

@Injectable()
export class DrizzlePatientRepository implements PatientRepository {
  constructor(private drizzle: DrizzleService) {}

  async create(entity: Patient): Promise<void> {
    console.log(entity)
  }

  async findById(id: string): Promise<Patient | null> {
    const patient = await this.drizzle.client.query.patient.findFirst({
      where: (p, { eq }) => eq(p.id, id),
      with: {
        scheduledAppointments: true,
      },
    })

    if (!patient) return null

    return toDomain(patient)
  }
}
