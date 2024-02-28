import { PatientRepository } from '@/domain/patient/application/repositories/patient-repository'
import { Patient } from '@/domain/patient/enterprise/entities/patient'

export class InMemoryPatientRepository implements PatientRepository {
  patients: Patient[] = []

  async findById(id: string): Promise<Patient | null> {
    const patient = this.patients.find((p) => p.id.toString() === id)

    return patient ?? null
  }

  async create(entity: Patient): Promise<void> {
    this.patients.push(entity)
  }
}
