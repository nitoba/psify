import { Psychologist } from '@/domain/psychologist/enterprise/entities/psychologist'

export class PsychologistPresenter {
  static toHttp(psychologist: Psychologist) {
    return {
      id: psychologist.id.toString(),
      name: psychologist.name.getValue,
      email: psychologist.email.getValue,
      phone: psychologist.phone.getValue,
      specialties: psychologist.specialties
        .getItems()
        .map((item) => item.value),
      consultationPriceInCents: psychologist.consultationPriceInCents,
    }
  }
}
