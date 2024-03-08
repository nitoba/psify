import { appRouter } from '@psyfi/api-contract'
import { initQueryClient } from '@ts-rest/react-query'

export const api = initQueryClient(appRouter, {
  baseUrl: 'http://localhost:3333',
  baseHeaders: {},
  credentials: 'include',
})
