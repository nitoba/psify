import { initContract } from '@ts-rest/core'
import { auth } from './contracts/auth'

const c = initContract()

export const appRouter = c.router(
  {
    auth,
  },
  {
    strictStatusCodes: true,
  },
)
