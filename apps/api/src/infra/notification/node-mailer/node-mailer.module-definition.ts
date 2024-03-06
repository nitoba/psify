import { ConfigurableModuleBuilder } from '@nestjs/common'

import { NodeMailerModuleOptions } from './node-mailer-options'

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<NodeMailerModuleOptions>()
    .setClassMethodName('forRoot')
    .build()
