import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PatientRepository } from '@/domain/patient/application/repositories/patient-repository'
import { Patient } from '@/domain/patient/enterprise/entities/patient'

export class InMemoryPatientRepository implements PatientRepository {
  patients: Patient[] = []

  async findById(id: UniqueEntityID): Promise<Patient | null> {
    const patient = this.patients.find((p) => p.id.equals(id))

    return patient ?? null
  }
}
