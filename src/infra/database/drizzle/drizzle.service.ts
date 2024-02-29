import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

@Injectable()
export class DrizzleService {
  client: NodePgDatabase

  constructor(@Inject('DB') drizzleDb: NodePgDatabase) {
    this.client = drizzleDb
  }
}
