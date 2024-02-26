import { PaginationParams } from '@/core/repositories/pagination-params'
import { Repository } from '@/domain/core/application/repositories/repository'

import { Psychologist } from '../../enterprise/entities/psychologist'
import { SpecialtyList } from '../../enterprise/entities/specialty-list'

export abstract class PsychologistRepository extends Repository<Psychologist> {
  abstract update(psychologist: Psychologist): Promise<void>
  abstract updateSpecialties(
    specialties: SpecialtyList,
    id: string,
  ): Promise<void>

  abstract fetchAll(
    filter: {
      name?: string
      specialties?: string[]
    },
    params: PaginationParams,
  ): Promise<Psychologist[]>
}
