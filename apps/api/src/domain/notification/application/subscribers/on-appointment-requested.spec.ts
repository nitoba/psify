import { makeAuthPsychologist } from 'test/factories/auth/make-auth-psychologist'
import { makeAppointment } from 'test/factories/schedules/make-appointment'
import { FakeMailPublisher } from 'test/notification-publisher/fake-mail'
import { InMemoryAuthPsychologistRepository } from 'test/repositories/auth/in-memory-psychologist-repository'
import { InMemoryNotificationRepository } from 'test/repositories/notification/in-memory-notification-repository'
import { InMemoryAppointmentsRepository } from 'test/repositories/schedules/in-memory-appointments-repository'
import { waitFor } from 'test/utils/wait-for'

import { SendNotificationUseCase } from '../use-cases/send-mail-notification'
import { OnAppointmentRequestedHandler } from './on-appointment-requested'

describe('On Appointment Requested Handler', () => {
  let useCase: SendNotificationUseCase
  let fakeMailPublisher: FakeMailPublisher
  let appointmentRepository: InMemoryAppointmentsRepository
  let notificationRepository: InMemoryNotificationRepository
  let psychologistRepository: InMemoryAuthPsychologistRepository

  beforeEach(() => {
    psychologistRepository = new InMemoryAuthPsychologistRepository()
    fakeMailPublisher = new FakeMailPublisher()
    notificationRepository = new InMemoryNotificationRepository()
    appointmentRepository = new InMemoryAppointmentsRepository()
    useCase = new SendNotificationUseCase(
      fakeMailPublisher,
      notificationRepository,
    )

    // eslint-disable-next-line no-new
    new OnAppointmentRequestedHandler(
      appointmentRepository,
      psychologistRepository,
      useCase,
    )
  })

  it('should send a notification about requested appointment when appointment is requested', async () => {
    const sendNotificationUseCaseSpy = vi.spyOn(useCase, 'execute')
    const fakeMailPublisherSpy = vi.spyOn(fakeMailPublisher, 'send')
    const psychologist = makeAuthPsychologist()
    const appointment = makeAppointment({
      psychologistId: psychologist.id,
    })
    psychologistRepository.psychologists.push(psychologist)

    expect(appointment.domainEvents).toHaveLength(1)
    appointmentRepository.create(appointment)
    expect(appointment.domainEvents).toHaveLength(0)

    await waitFor(() => {
      expect(sendNotificationUseCaseSpy).toHaveBeenCalled()
      expect(fakeMailPublisherSpy).toHaveBeenCalled()
    })
    expect(notificationRepository.notifications).toHaveLength(1)
  })
})
