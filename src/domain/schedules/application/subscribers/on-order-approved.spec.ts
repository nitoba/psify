/* eslint-disable no-new */
import { makePatient } from '@/test/factories/patient/make-patient'
import { makePsychologist } from '@/test/factories/psychologist/make-psychologist'
import { makeAppointment } from '@/test/factories/schedules/make-appointment'
import { InMemoryAppointmentsRepository } from '@/test/repositories/schedules/in-memory-appointments-repository'
import { waitFor } from '@/test/utils/wait-for'

import { MarkAppointmentAsScheduledUseCase } from '../use-cases/mark-appointment-as-scheduled'
import { OnOrderApproved } from './on-order-approved'

let markAsScheduledUseCase: MarkAppointmentAsScheduledUseCase
let appointmentsRepository: InMemoryAppointmentsRepository
describe('On Order Approved', () => {
  beforeEach(() => {
    appointmentsRepository = new InMemoryAppointmentsRepository()
    markAsScheduledUseCase = new MarkAppointmentAsScheduledUseCase(
      appointmentsRepository,
    )
    new OnOrderApproved(markAsScheduledUseCase)
  })

  it.skip('should mark appointment as scheduled when order approved', async () => {
    const markAsScheduledUseCaseSpy = vi.spyOn(
      markAsScheduledUseCase,
      'execute',
    )
    const psychologist = makePsychologist()
    const patient = makePatient()
    const appointment = makeAppointment({
      patientId: patient.id,
      psychologistId: psychologist.id,
      status: 'pending',
    })

    appointmentsRepository.appointments.push(appointment)

    await waitFor(() => {
      expect(markAsScheduledUseCaseSpy).toHaveBeenCalled()
    })
  })
})
