import { makeAvailableTime } from 'test/factories/psychologist/make-available-times'

import { AvailableTimesToSchedulesList } from './available-times-to-schedules-list'

describe('AvailableTimesToSchedulesList', () => {
  let availableTimesList: AvailableTimesToSchedulesList

  beforeEach(() => {
    availableTimesList = new AvailableTimesToSchedulesList()
  })

  test('should add new available times to schedules', () => {
    const time1 = makeAvailableTime()
    const time2 = makeAvailableTime()

    availableTimesList.add(time1)
    availableTimesList.add(time2)

    expect(availableTimesList.getNewItems()).toHaveLength(2)
    expect(availableTimesList.getNewItems()[0]).toBe(time1)
    expect(availableTimesList.getNewItems()[1]).toBe(time2)
  })

  test('should remove available times to schedules', () => {
    const time1 = makeAvailableTime()
    const time2 = makeAvailableTime()

    availableTimesList.add(time1)
    availableTimesList.add(time2)
    expect(availableTimesList.getNewItems()).toHaveLength(2)

    availableTimesList.remove(time1)

    expect(availableTimesList.getNewItems()).toHaveLength(1)
  })

  // test('should get updated items', () => {
  //   const time1 = makeAvailableTime()
  //   const time2 = makeAvailableTime()
  //   const time3 = makeAvailableTime()

  //   availableTimesList.update([time1, time2, time3])
  //   availableTimesList.remove(time2)
  //   const updated = availableTimesList.getUpdatedItems()

  //   expect(updated).toHaveLength(2)
  //   expect(updated).toEqual(expect.arrayContaining([time1, time3]))
  // })
})
