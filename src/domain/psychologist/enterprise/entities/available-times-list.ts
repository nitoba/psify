import { WatchedList } from '@/core/entities/watched-list'

import { AvailableTime } from './available-time'

export class AvailableTimesList extends WatchedList<AvailableTime> {
  compareItems(a: AvailableTime, b: AvailableTime): boolean {
    return a.id.equals(b.id)
  }
}
