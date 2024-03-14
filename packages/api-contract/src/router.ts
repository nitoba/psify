import { initContract } from '@ts-rest/core'
import { auth } from './contracts/auth'
import { psychologists } from './contracts/psychologists'

const c = initContract()

export const appRouter = c.router(
  {
    auth,
    psychologists,
  },
  {
    strictStatusCodes: true,
  },
)
