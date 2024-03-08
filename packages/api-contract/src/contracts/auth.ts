import { initContract } from '@ts-rest/core'
import { z } from 'zod'

const c = initContract()

export const auth = c.router({
  registerPatient: {
    method: 'POST',
    path: '/auth/psychologist/register',
    responses: {
      201: null,
      400: z.object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
      }),
      409: z.object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
      }),
      500: z.object({
        message: z.string(),
      }),
    },
    body: z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string().regex(/^\(\d{2}\) 9\d{8}$/, {
        message: 'Invalid phone number format',
      }),
      password: z.string().min(6),
    }),
  },
  registerPsychologist: {
    method: 'POST',
    path: '/auth/psychologist/register',
    responses: {
      201: null,
      400: z.object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
      }),
      409: z.object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
      }),
      500: z.object({
        message: z.string(),
      }),
    },
    body: z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string().regex(/^\(\d{2}\) 9\d{8}$/, {
        message: 'Invalid phone number format',
      }),
      crp: z.string().length(7, { message: 'CRP must be valid' }),
      password: z.string().min(6),
    }),
  },
  authenticatePatient: {
    method: 'POST',
    path: '/auth/patients/authenticate',
    responses: {
      200: z.object({
        access_token: z.string(),
      }),
      400: z.object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
      }),
      500: z.object({
        message: z.string(),
      }),
    },
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
  },
  authenticatePsychologist: {
    method: 'POST',
    path: 'auth/psychologist/authenticate',
    responses: {
      200: z.object({
        access_token: z.string(),
      }),
      400: z.object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
      }),
      500: z.object({
        message: z.string(),
      }),
    },
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
  },
  changePassword: {
    method: 'POST',
    path: '/auth/change-password',
    responses: {
      200: z.object({
        message: z.string(),
      }),
      400: z.object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
      }),
      500: z.object({
        message: z.string(),
      }),
    },
    body: z.object({
      newPassword: z.string().min(6),
      oldPassword: z.string().min(6),
    }),
  },
  profile: {
    method: 'GET',
    path: '/me',
    responses: {
      404: z.object({
        statusCode: z.number(),
        error: z.string(),
        message: z.string(),
      }),
      200: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        specialties: z.string().array().optional(),
        consultationPriceInCents: z.number().optional(),
      }),
    },
  },
})
