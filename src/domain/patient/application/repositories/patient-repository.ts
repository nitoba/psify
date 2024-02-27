import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Patient } from '../../enterprise/entities/patient'

export abstract class PatientRepository {
  abstract findById(id: UniqueEntityID): Promise<Patient | null>
}
