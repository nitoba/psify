import { Patient } from '@/domain/patient/enterprise/entities/patient'

export class PatientPresenter {
  static toHttp(patient: Patient) {
    return {
      id: patient.id.toString(),
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
    }
  }
}
