import { Repository } from '@/domain/core/application/repositories/repository'

import { Patient } from '../../enterprise/entities/patient'
import { Psychologist } from '../../enterprise/entities/psychologist'

export abstract class AuthUserRepository extends Repository<
  Patient | Psychologist
> {
  abstract findByEmail(email: string): Promise<Patient | Psychologist | null>
  abstract save(patient: Patient | Psychologist): Promise<void>
}
