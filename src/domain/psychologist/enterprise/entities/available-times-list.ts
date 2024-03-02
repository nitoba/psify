import { differenceInMinutes } from 'date-fns'

import { WatchedList } from '@/core/entities/watched-list'

import { AvailableTime } from './available-time'

export class AvailableTimesList extends WatchedList<AvailableTime> {
  compareItems(a: AvailableTime, b: AvailableTime): boolean {
    return a.id.equals(b.id)
  }

  getUpdatedItems() {
    const updated = this.getItems()
      .filter((availableTime) =>
        this.getRemovedItems().some((a) => a.equals(availableTime)),
      )
      .concat(this.getNewItems())

    return updated
  }

  hasHalfHourDifference(weekday: number, time: string) {
    return this.getItems().every((at) => {
      if (at.weekday === weekday) {
        const [hourFromInput, minutesFromInput] = time.split(':').map(Number)
        const [hours, minutes] = at.time.getHoursAndMinutes()
        const dateToCompare = new Date().setHours(hours, minutes)
        const dateToFromInput = new Date().setHours(
          hourFromInput,
          minutesFromInput,
        )

        const diffInMinutes = differenceInMinutes(
          dateToFromInput,
          dateToCompare,
        )

        const has30MinutesOfDiff = diffInMinutes >= 30

        return has30MinutesOfDiff
      } else {
        return true
      }
    })
  }
}
