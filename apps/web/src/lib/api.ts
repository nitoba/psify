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

    const res = await tsRestFetchApi(args)

    if (res.status === 401) {
      const c = cookies()

      const refreshToken = c.get('psify@refresh_token')?.value ?? ``

      const res = await api.auth.refreshToken.mutation({
        body: { refresh_token: refreshToken },
      })

      if (res.status === 200) {
        args.headers.Authorization = `Bearer ${res.body.access_token}`
        return tsRestFetchApi(args)
      }
    }

    return res
  },
})
