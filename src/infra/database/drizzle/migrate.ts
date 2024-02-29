import 'dotenv/config'

import path from 'node:path'

import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Client } from 'pg'

import { envSchema } from '@/infra/env/env'

import * as schema from './schemas'

async function runMigrations() {
  const env = envSchema.parse(process.env)

  const connection = new Client({
    connectionString: env.DATABASE_URL,
  })

  await connection.connect()

  const db = drizzle(connection, { schema, logger: true })

  const migrationsFolder = path.resolve(__dirname, 'migrations')

  await migrate(db, {
    migrationsFolder,
  })

  await connection.end()
}

runMigrations()
