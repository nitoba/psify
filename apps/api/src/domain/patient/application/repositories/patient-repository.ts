import { Repository } from '@/domain/core/application/repositories/repository'

import { Patient } from '../../enterprise/entities/patient'

export abstract class PatientRepository extends Repository<Patient> {}
