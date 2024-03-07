import { initContract } from '@ts-rest/core'
import { authContract } from './contracts/auth-contract'

const c = initContract()

export const mainContract = c.router(
  {
    authContract,
  },
  {
    strictStatusCodes: true,
  },
)
