import { makeAuthPatient } from 'test/factories/auth/make-auth-patient'
import { makeAppointment } from 'test/factories/schedules/make-appointment'
import { FakeMailPublisher } from 'test/notification-publisher/fake-mail'
import { InMemoryAuthPatientRepository } from 'test/repositories/auth/in-memory-patient-repository'
import { InMemoryNotificationRepository } from 'test/repositories/notification/in-memory-notification-repository'
import { InMemoryAppointmentsRepository } from 'test/repositories/schedules/in-memory-appointments-repository'
import { waitFor } from 'test/utils/wait-for'

import { SendNotificationUseCase } from '../use-cases/send-mail-notification'
import { OnAppointmentRejectedHandler } from './on-appointment-rejected'

describe('On Appointment Rejected Handler', () => {
  let useCase: SendNotificationUseCase
  let fakeMailPublisher: FakeMailPublisher
  let appointmentRepository: InMemoryAppointmentsRepository
  let notificationRepository: InMemoryNotificationRepository
  let patientRepository: InMemoryAuthPatientRepository

  beforeEach(() => {
    patientRepository = new InMemoryAuthPatientRepository()
    fakeMailPublisher = new FakeMailPublisher()
    notificationRepository = new InMemoryNotificationRepository()
    appointmentRepository = new InMemoryAppointmentsRepository()
    useCase = new SendNotificationUseCase(
      fakeMailPublisher,
      notificationRepository,
    )

    // eslint-disable-next-line no-new
    new OnAppointmentRejectedHandler(
      appointmentRepository,
      patientRepository,
      useCase,
    )
  })

  it('should send a notification about rejected appointment when appointment is rejected', async () => {
    const sendNotificationUseCaseSpy = vi.spyOn(useCase, 'execute')
    const fakeMailPublisherSpy = vi.spyOn(fakeMailPublisher, 'publish')
    const patient = makeAuthPatient()
    const appointment = makeAppointment({
      patientId: patient.id,
    })
    patientRepository.patients.push(patient)
    appointmentRepository.appointments.push(appointment)

    appointment.reject()

    appointmentRepository.save(appointment)

    expect(appointment.domainEvents).toHaveLength(0)

    await waitFor(() => {
      expect(sendNotificationUseCaseSpy).toHaveBeenCalled()
      expect(fakeMailPublisherSpy).toHaveBeenCalled()
    })
    expect(notificationRepository.notifications).toHaveLength(1)
  })
})
