import { mainContract } from '@psyfi/api-contract'
import { initQueryClient } from '@ts-rest/react-query'

export const api = initQueryClient(mainContract, {
  baseUrl: 'http://localhost:3333',
  baseHeaders: {},
  credentials: 'include',
})
