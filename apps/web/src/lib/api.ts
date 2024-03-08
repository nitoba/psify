import { appRouter } from '@psyfi/api-contract'
import { tsRestFetchApi } from '@ts-rest/core'
import { initQueryClient } from '@ts-rest/react-query'
import { cookies } from 'next/dist/client/components/headers'

const authRoutes = [
  '/auth/authenticate',
  '/auth/psychologists/register',
  '/auth/patients/register',
]

export const api = initQueryClient(appRouter, {
  baseUrl: 'http://localhost:3333',
  baseHeaders: {},
  credentials: 'include',
  api: async (args) => {
    if (!authRoutes.some((path) => args.route.path.includes(path))) {
      const c = cookies()
      const token = c.get('psify@access_token')?.value
      args.headers.Authorization = `Bearer ${token}`
    }

    return tsRestFetchApi(args)
  },
})
