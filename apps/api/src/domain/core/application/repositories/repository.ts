export abstract class Repository<T> {
  abstract create(entity: T): Promise<void>
  abstract findById(id: string): Promise<T | null>
}
