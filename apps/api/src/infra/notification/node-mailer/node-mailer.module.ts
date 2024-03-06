import { Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './node-mailer.module-definition'
import { NotificationPublisher } from '@/domain/notification/application/notification-publisher/publisher'
import { NodeMailerNotificationPublisher } from '../node-mailer-notification-publisher'
import { DatabaseModule } from '@/infra/database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: NotificationPublisher,
      useClass: NodeMailerNotificationPublisher,
    },
  ],
  exports: [NotificationPublisher],
})
export class NodeMailerModule extends ConfigurableModuleClass {}
