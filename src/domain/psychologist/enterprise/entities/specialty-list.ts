import { WatchedList } from '@/core/entities/watched-list'
import { Specialty } from '@/domain/psychologist/enterprise/value-objects/specialty'

export class SpecialtyList extends WatchedList<Specialty> {
  compareItems(a: Specialty, b: Specialty): boolean {
    return a.value === b.value
  }

  getUpdatedItems() {
    return this.getItems()
      .filter((specialty) => !this.getRemovedItems().includes(specialty))
      .concat(this.getNewItems())
      .map((p) => p.value)
  }
}
