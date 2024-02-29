import { Module } from '@nestjs/common'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AppController } from './controllers/app.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AppController],
})
export class HttpModule {}
