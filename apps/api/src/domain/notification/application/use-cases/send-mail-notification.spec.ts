import { FakeMailPublisher } from 'test/notification-publisher/fake-mail'
import { InMemoryNotificationRepository } from 'test/repositories/notification/in-memory-notification-repository'

import { NotificationPublisher } from '../notification-publisher/publisher'
import { SendNotificationUseCase } from './send-mail-notification'

describe('SendNotificationUseCase', () => {
  let notificationPublisher: NotificationPublisher
  let notificationRepository: InMemoryNotificationRepository
  let useCase: SendNotificationUseCase

  beforeEach(() => {
    notificationPublisher = new FakeMailPublisher()
    notificationRepository = new InMemoryNotificationRepository()
    useCase = new SendNotificationUseCase(
      notificationPublisher,
      notificationRepository,
    )
  })

  it('should send notification with valid data', async () => {
    const sendSpy = vi.spyOn(notificationPublisher, 'publish')

    const request = {
      subject: 'Test Subject',
      content: 'Test Content',
      to: 'test@example.com',
    }

    await useCase.execute({
      ...request,
      subjectType: 'appointment_rejected'
    })

    expect(sendSpy).toHaveBeenCalled()
    expect(notificationRepository.notifications).toHaveLength(1)
  })
})
