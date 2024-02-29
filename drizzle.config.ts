import type { Config } from 'drizzle-kit'
export default {
  schema: './src/infra/database/drizzle/schemas/*',
  out: './src/infra/database/drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config
