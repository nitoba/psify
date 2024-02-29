import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AppController } from './controllers/app.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule],
  controllers: [AppController],
})
export class HttpModule {}
