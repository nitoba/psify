import { AvailableTime } from '@/domain/psychologist/enterprise/entities/available-time'

export class AvailableTimesPresenter {
  static toHttp(AvailableTimes: AvailableTime) {
    return {
      id: AvailableTimes.id.toString(),
      weekday: AvailableTimes.weekday,
      time: AvailableTimes.time.value,
    }
  }
}
