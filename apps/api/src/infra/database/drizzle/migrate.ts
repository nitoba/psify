import 'dotenv/config'

import path from 'node:path'

import chalk from 'chalk'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import * as schema from '@/infra/database/drizzle/schemas'
import { envSchema } from '@/infra/env/env'

export async function runMigrations() {
  const env = envSchema.parse(process.env)

  const connection = postgres(env.DATABASE_URL, { max: 1 })

  const db = drizzle(connection, { schema, logger: false })

  const migrationsFolder = path.resolve(__dirname, 'migrations')

  await migrate(db, {
    migrationsFolder,
  })

  await connection.end()
}

runMigrations().then(() =>
  console.log(chalk.greenBright('Migrations applied successfully!')),
)
