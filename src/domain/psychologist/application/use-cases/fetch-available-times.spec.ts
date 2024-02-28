import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Time } from '@/domain/core/enterprise/value-objects/time'
import { Appointment } from '@/domain/schedules/enterprise/entities/appointment'
import { makePsychologist } from '@/test/factories/psychologist/make-psychologist'
import { InMemoryPsychologistRepository } from '@/test/repositories/psychologist/in-memory-psychologist-repository'

import { AvailableTime } from '../../enterprise/entities/available-time'
import { AvailableTimesList } from '../../enterprise/entities/available-times-list'
import { FetchAvailableTimesUseCase } from './fetch-available-times'

describe('FetchAvailableTimesUseCase', () => {
  let useCase: FetchAvailableTimesUseCase
  let repository: InMemoryPsychologistRepository

  beforeEach(() => {
    repository = new InMemoryPsychologistRepository()
    useCase = new FetchAvailableTimesUseCase(repository)
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should return available times for a psychologist', async () => {
    vi.useFakeTimers().setSystemTime(new Date(2024, 1, 25, 8))
    const psychologistId = new UniqueEntityID()
    const availableTimes = [
      AvailableTime.create({
        psychologistId,
        weekday: 0,
        time: Time.create('09:00').value as Time,
      }),
      AvailableTime.create({
        psychologistId,
        weekday: 1,
        time: Time.create('12:00').value as Time,
      }),
    ]
    const psychologist = makePsychologist(
      {
        availableTimes: new AvailableTimesList(availableTimes),
      },
      psychologistId,
    )

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.availableTimes).toEqual(availableTimes)
    }
  })

  it('should return only available times that not scheduled', async () => {
    vi.useFakeTimers().setSystemTime(new Date(2024, 1, 25, 8))
    const psychologistId = new UniqueEntityID()
    const availableTimes = [
      AvailableTime.create({
        psychologistId,
        weekday: 0,
        time: Time.create('09:00').value as Time,
      }),
      AvailableTime.create({
        psychologistId,
        weekday: 1,
        time: Time.create('12:00').value as Time,
      }),
    ]
    const psychologist = makePsychologist(
      {
        scheduledAppointments: [
          Appointment.create({
            patientId: new UniqueEntityID(),
            psychologistId,
            scheduledTo: new Date(2024, 1, 25, 9),
          }),
        ],
        availableTimes: new AvailableTimesList(availableTimes),
      },
      psychologistId,
    )

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.availableTimes).toEqual([availableTimes[1]])
    }
  })

  it('should filter available times in the past', async () => {
    vi.useFakeTimers().setSystemTime(new Date(2024, 1, 25, 10))
    const psychologistId = new UniqueEntityID()
    const availableTimes = [
      AvailableTime.create({
        psychologistId,
        weekday: 0,
        time: Time.create('12:00').value as Time,
      }),
      AvailableTime.create({
        psychologistId,
        weekday: 0,
        time: Time.create('09:00').value as Time,
      }),
    ]
    const psychologist = makePsychologist(
      {
        availableTimes: new AvailableTimesList(availableTimes),
      },
      psychologistId,
    )

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.availableTimes).toEqual([availableTimes[0]])
    }
  })

  it('should return left if psychologist not found', async () => {
    const result = await useCase.execute({
      psychologistId: '123',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
