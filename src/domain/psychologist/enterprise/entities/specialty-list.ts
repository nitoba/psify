import { WatchedList } from '@/core/entities/watched-list'
import { Specialty } from '@/domain/psychologist/enterprise/value-objects/specialty'

export class SpecialtyList extends WatchedList<Specialty> {
  private initialItems: Specialty[] = []

  constructor(initialItems?: Specialty[]) {
    super(initialItems)
    this.currentItems = initialItems ?? []
  }

  compareItems(a: Specialty, b: Specialty): boolean {
    return a.equals(b)
  }

  getUpdatedItems() {
    console.log({
      removed: this.getRemovedItems().map((i) => i.value),
      new: this.getNewItems().map((i) => i.value),
    })

    console.log({ items: this.currentItems.map((i) => i.value) })

    return this.getItems().map((i) => i.value)
  }
}
