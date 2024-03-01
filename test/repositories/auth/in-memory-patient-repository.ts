import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { Patient } from '@/domain/auth/enterprise/entities/patient'

export class InMemoryAuthPatientRepository implements AuthPatientRepository {
  patients: Patient[] = []
  async findById(id: string): Promise<Patient | null> {
    const patient = this.patients.find((p) => p.id.toString() === id)
    return patient ?? null
  }

  async findByEmail(email: string): Promise<Patient | null> {
    const patient = this.patients.find((p) => p.email === email)
    return patient ?? null
  }

  async create(patient: Patient): Promise<void> {
    this.patients.push(patient)
  }
}
