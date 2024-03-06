import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  MONGODB_URL: z.string().url(),
  MONGODB_DATABASE_NAME: z.string(),
  MONGODB_NOTIFICATIONS_COLLECTION: z.string().default('notifications'),
  PORT: z.coerce.number().optional().default(3333),
  JTW_PUBLIC_KEY: z.string(),
  JTW_PRIVATE_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_ENDPOINT_SECRET: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_AUTH_USER: z.string(),
  SMTP_AUTH_PASS: z.string(),
})

export type Env = z.infer<typeof envSchema>
