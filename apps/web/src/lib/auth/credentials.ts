import { appRouter } from '@psyfi/api-contract'
import { ServerInferResponses } from '@ts-rest/core'
import Credentials from 'next-auth/providers/credentials'
import { api } from '../api'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

let response:
  | ServerInferResponses<typeof appRouter>['auth']['authenticatePatient']
  | ServerInferResponses<typeof appRouter>['auth']['authenticatePsychologist']

export const credentials = Credentials({
  type: 'credentials',
  authorize: async (credentials) => {
    if (!credentials.email || !credentials.password || !credentials.type) {
      return null
    }

    if (credentials.type === 'patient') {
      response = await api.auth.authenticatePatient.mutation({
        body: {
          email: credentials.email as string,
          password: credentials.password as string,
        },
      })
    }

    if (credentials.type === 'psychologist') {
      response = await api.auth.authenticatePsychologist.mutation({
        body: {
          email: credentials.email as string,
          password: credentials.password as string,
        },
      })
    }

    const { body, status } = response

    if (status !== 200) {
      return null
    }

    ;(['access_token', 'refresh_token'] as const).forEach((token) => {
      cookies().set(`psify@${token}`, body[token], {
        path: '/',
        httpOnly: true,
      })
    })

    const tokenPayload = jwtDecode<{
      sub: string
      email: string
      role: string
    }>(body.access_token)

    return {
      accessToken: body.access_token,
      email: tokenPayload.email,
      id: tokenPayload.sub,
      name: tokenPayload.email,
    }
  },
})
