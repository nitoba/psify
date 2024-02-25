import { Patient } from '../../enterprise/entities/patient'

export abstract class AuthPatientRepository {
  abstract findByEmail(email: string): Promise<Patient | null>
  abstract create(patient: Patient): Promise<void>
}
