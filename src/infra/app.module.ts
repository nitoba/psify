import { Module } from '@nestjs/common'

import { AppController } from './http/app.controller'
import { AppService } from './http/app.service'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
