import { initContract } from '@ts-rest/core'
import { z } from 'zod'

const c = initContract()

export const psychologists = c.router({
  fetchPsychologists: {
    method: 'GET',
    path: '/psychologists',
    query: z.object({
      page: z.number().optional().default(1),
      name: z.string().optional(),
      specialties: z.string().optional(),
    }),
    responses: {
      200: z.object({
        total: z.number(),
        psychologists: z.array(
          z.object({
            id: z.string().uuid(),
            name: z.string(),
            email: z.string().email(),
            phone: z.string(),
            avatarUrl: z.string().optional().nullable(),
            bio: z.string().optional().nullable(),
            specialties: z.string().array().optional(),
            consultationPriceInCents: z.number().optional(),
          }),
        ),
      }),
    },
  },
})
