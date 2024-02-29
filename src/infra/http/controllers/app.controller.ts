import { Controller, Get } from '@nestjs/common'

import { DrizzleService } from '@/infra/database/drizzle/drizzle.service'

@Controller()
export class AppController {
  constructor(private readonly drizzle: DrizzleService) {}

  @Get()
  async hello() {
    return await this.drizzle.client.query.psychologist.findMany({
      columns: {
        id: true,
        name: true,
      },
    })
  }
}
