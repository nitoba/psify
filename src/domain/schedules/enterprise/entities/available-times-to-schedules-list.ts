import { differenceInMinutes } from 'date-fns'

import { WatchedList } from '@/core/entities/watched-list'

import { AvailableTimeToSchedule } from './available-time-to-schedules'

export class AvailableTimesToSchedulesList extends WatchedList<AvailableTimeToSchedule> {
  updatedItems: AvailableTimeToSchedule[] = []

  compareItems(
    a: AvailableTimeToSchedule,
    b: AvailableTimeToSchedule,
  ): boolean {
    return a.id.equals(b.id)
  }

  compareProps(
    a: AvailableTimeToSchedule,
    b: AvailableTimeToSchedule,
  ): boolean {
    return a.time === b.time && a.weekday === b.weekday
  }

  updateAvailableTimeToSchedule(item: AvailableTimeToSchedule) {
    const currentItems = this.getItems()
    const index = currentItems.findIndex((i) => i.id.equals(item.id))

    if (index !== -1) {
      this.currentItems[index] = item
      this.updatedItems.push(item)
    }
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
