import { Repository } from '@/domain/core/application/repositories/repository'

import { Patient } from '../../enterprise/entities/patient'

export abstract class AuthPatientRepository extends Repository<Patient> {
  abstract findByEmail(email: string): Promise<Patient | null>
}
