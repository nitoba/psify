import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

import * as schema from './schemas'
@Injectable()
export class DrizzleService {
  client: NodePgDatabase<typeof schema>

  constructor(@Inject('DB') drizzleDb: NodePgDatabase<typeof schema>) {
    this.client = drizzleDb
  }
}
