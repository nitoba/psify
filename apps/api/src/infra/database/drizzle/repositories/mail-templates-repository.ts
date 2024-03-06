import { Injectable } from '@nestjs/common'
import { DrizzleService } from '../drizzle.service'

@Injectable()
export class DrizzleMailTemplateRepository {
  constructor(private db: DrizzleService) {}
  async findByTitle(title: string) {
    const mailTemplate = await this.db.client.query.mailTemplates.findFirst({
      where: (template, { eq }) => eq(template.title, title),
    })

    return mailTemplate
  }
}
