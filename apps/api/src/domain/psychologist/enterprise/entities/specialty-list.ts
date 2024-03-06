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
    return this.getItems().map((i) => i.value)
  }
}
