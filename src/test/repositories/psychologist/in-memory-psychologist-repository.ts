import { PaginationParams } from '@/core/repositories/pagination-params'
import { PsychologistRepository } from '@/domain/psychologist/application/repositories/psychology-repository'
import { Psychologist } from '@/domain/psychologist/enterprise/entities/psychologist'
import { SpecialtyList } from '@/domain/psychologist/enterprise/entities/specialty-list'

export class InMemoryPsychologistRepository implements PsychologistRepository {
  psychologists: Psychologist[] = []
  async fetchAll(
    filter: { name?: string; specialties?: string[] },
    { page }: PaginationParams,
  ): Promise<Psychologist[]> {
    const offset = (page - 1) * 10

    const filteredPsychologists = this.psychologists.filter((p) => {
      if (!filter.name && !filter.specialties) return true

      if (!!filter.specialties && !filter.name) {
        return filter.specialties.every((s) =>
          p.specialties
            .getItems()
            .map((sp) => sp.value.toLowerCase())
            .includes(s.toLocaleLowerCase()),
        )
      }

      if (filter.name && !filter.specialties) {
        return p.name.getValue
          .toLocaleLowerCase()
          .includes(filter.name.toLocaleLowerCase())
      }

      if (filter.name && !!filter.specialties) {
        return (
          p.name.getValue
            .toLocaleLowerCase()
            .includes(filter.name.toLocaleLowerCase()) ||
          filter.specialties.every((s) =>
            p.specialties
              .getItems()
              .map((sp) => sp.value.toLowerCase())
              .includes(s.toLocaleLowerCase()),
          )
        )
      } else {
        return false
      }
    })

    return filteredPsychologists.slice(offset, offset + 10)
  }

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
