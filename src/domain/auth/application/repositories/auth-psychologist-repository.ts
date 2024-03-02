import { Repository } from '@/domain/core/application/repositories/repository'

import { Psychologist } from '../../enterprise/entities/psychologist'

export abstract class AuthPsychologistRepository extends Repository<Psychologist> {
  abstract findByEmail(email: string): Promise<Psychologist | null>
  abstract findByEmailOrCRP(
    email: string,
    crp: string,
  ): Promise<Psychologist | null>
}
