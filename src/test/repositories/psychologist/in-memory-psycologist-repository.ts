import { PsychologistRepository } from '@/domain/psychologist/application/repositories/psychology-repository'
import { Psychologist } from '@/domain/psychologist/enterprise/entities/psychologist'
import { SpecialtyList } from '@/domain/psychologist/enterprise/entities/specialty-list'

export class InMemoryPsychologistRepository implements PsychologistRepository {
  psychologists: Psychologist[] = []
  async update(psychologist: Psychologist): Promise<void> {
    const psychologistIndex = this.psychologists.findIndex(
      (p) => p.id === psychologist.id,
    )

    if (psychologistIndex !== -1) {
      this.psychologists[psychologistIndex] = psychologist
    }
  }

  async updateSpecialties(
    specialties: SpecialtyList,
    id: string,
  ): Promise<void> {
    const psychologistIndex = this.psychologists.findIndex(
      (p) => p.id.toString() === id,
    )

    if (psychologistIndex !== -1) {
      this.psychologists[psychologistIndex].specialties.update(
        specialties.getItems(),
      )
    }
  }

  async create(entity: Psychologist): Promise<void> {
    this.psychologists.push(entity)
  }

  async findById(id: string): Promise<Psychologist | null> {
    const psychologist = this.psychologists.find((p) => p.id.toString() === id)
    return psychologist ?? null
  }
}
