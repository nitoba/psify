import { AuthUserRepository } from '@/domain/auth/application/repositories/auth-user-repository'
import { Patient } from '@/domain/auth/enterprise/entities/patient'
import { Psychologist } from '@/domain/auth/enterprise/entities/psychologist'

export class InMemoryAuthUserRepository implements AuthUserRepository {
  users: (Patient | Psychologist)[] = []
  async findByEmail(email: string): Promise<Patient | Psychologist | null> {
    const user = this.users.find((user) => user.email === email)

    return user ?? null
  }

  async save(patientOrPsychologist: Patient | Psychologist): Promise<void> {
    const index = this.users.findIndex(
      (user) => user.id === patientOrPsychologist.id,
    )

    if (index >= 0) {
      this.users[index] = patientOrPsychologist
    }
  }

  async create(entity: Patient | Psychologist): Promise<void> {
    this.users.push(entity)
  }

  async findById(id: string): Promise<Patient | Psychologist | null> {
    const user = this.users.find((user) => user.id.toString() === id)

    return user ?? null
  }
}
