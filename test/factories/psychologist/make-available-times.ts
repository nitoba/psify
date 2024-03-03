import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AvailableTime,
  AvailableTimeProps,
} from '@/domain/psychologist/enterprise/entities/available-time'
import { Time } from '@/domain/psychologist/enterprise/value-objects/time'
import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'
import { availableTimes } from '@/infra/database/drizzle/schemas'

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

@Injectable()
export class AvailableTimesFactory {
  constructor(private drizzle: DrizzleService) {}

  async makeDbAvailableTime(
    override: Partial<AvailableTimeProps> = {},
    psychologistId: string,
  ) {
    const p = makeAvailableTime(override)

    const [availableTimeDB] = await this.drizzle.client
      .insert(availableTimes)
      .values({
        id: p.id.toString(),
        psychologistId,
        time: p.time.value,
        weekday: p.weekday,
      })
      .returning()

    return availableTimeDB
  }
}
