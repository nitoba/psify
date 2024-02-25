import { AuthPsychologistRepository } from '@/domain/auth/application/repositories/auth-psychologist-repository'
import { Psychologist } from '@/domain/auth/enterprise/entities/psychologist'

export class InMemoryAuthPsychologistRepository
  implements AuthPsychologistRepository
{
  psychologists: Psychologist[] = []

  async findByEmail(email: string): Promise<Psychologist | null> {
    const psychologist = this.psychologists.find((p) => p.email === email)
    return psychologist ?? null
  }

  async create(psychologist: Psychologist): Promise<void> {
    this.psychologists.push(psychologist)
  }
}
