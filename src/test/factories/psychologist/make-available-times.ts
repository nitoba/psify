import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Time } from '@/domain/core/enterprise/value-objects/time'
import {
  AvailableTime,
  AvailableTimeProps,
} from '@/domain/psychologist/enterprise/entities/available-time'

export function makeAvailableTime(
  override: Partial<AvailableTimeProps> = {},
  id?: UniqueEntityID,
) {
  return AvailableTime.create(
    {
      psychologistId: new UniqueEntityID(),
      weekday: 1,
      time: Time.create('09:00').value as Time,
      ...override,
    },
    id,
  )
}
