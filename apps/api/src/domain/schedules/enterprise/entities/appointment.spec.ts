import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Appointment } from './appointment'

describe('Appointment', () => {
  let appointment: Appointment

  beforeEach(() => {
    appointment = Appointment.create({
      psychologistId: new UniqueEntityID(),
      patientId: new UniqueEntityID(),
      scheduledTo: new Date(),
      status: 'pending',
      costInCents: 10000,
      createdAt: new Date(),
    })
  })

  it('should create a pending appointment', () => {
    expect(appointment.status).toBe('pending')
  })

  it('should update appointment status', () => {
    appointment.updateStatus('canceled')
    expect(appointment.status).toBe('canceled')
  })

  it('should approve an appointment', () => {
    const result = appointment.approve()
    expect(result.isRight()).toBeTruthy()
    expect(appointment.status).toBe('approved')
  })

  it('should no be able approve an appointment', () => {
    appointment.updateStatus('canceled')
    let result = appointment.approve()
    expect(result.isLeft()).toBeTruthy()
    expect(appointment.status).toBe('canceled')

    appointment.updateStatus('finished')
    result = appointment.approve()
    expect(result.isLeft()).toBeTruthy()
    appointment.updateStatus('inactive')
    result = appointment.approve()
    expect(result.isLeft()).toBeTruthy()
    appointment.updateStatus('scheduled')
    result = appointment.approve()
    expect(result.isLeft()).toBeTruthy()
  })

  it('should cancel an appointment', () => {
    const result = appointment.cancel()
    expect(result.isRight()).toBeTruthy()
  })

  it('should not be able cancel an appointment', () => {
    appointment.cancel()
    let result = appointment.cancel()
    expect(result.isLeft()).toBeTruthy()

    appointment.updateStatus('finished')
    result = appointment.cancel()
    expect(result.isLeft()).toBeTruthy()
  })

  it('should schedule an appointment', () => {
    appointment.approve()
    const result = appointment.schedule()
    expect(result.isRight()).toBeTruthy()
  })

  it('should not be able schedule an appointment', () => {
    const result = appointment.schedule()
    expect(result.isLeft()).toBeTruthy()
  })

  it('should set createdAt date on creation', () => {
    expect(appointment.createdAt).toBeInstanceOf(Date)
  })
})
