import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Appointment } from './appointment'

describe('Appointment', () => {
  let appointment: Appointment

  beforeEach(() => {
    appointment = Appointment.create({
      psychologistId: new UniqueEntityID(),
      patientId: new UniqueEntityID(),
      scheduledTo: new Date(),
      status: 'confirmed',
      createdAt: new Date(),
    })
  })

  test('should create a confirmed appointment', () => {
    expect(appointment.status).toBe('confirmed')
  })

  test('should update appointment status', () => {
    appointment.updateStatus('canceled')
    expect(appointment.status).toBe('canceled')
  })

  test('should set createdAt date on creation', () => {
    expect(appointment.createdAt).toBeInstanceOf(Date)
  })
})
