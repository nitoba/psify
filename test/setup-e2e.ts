import { config } from 'dotenv'
import { sql } from 'drizzle-orm'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import { exec } from 'shelljs'
import * as schema from 'src/infra/database/drizzle/schemas'

import { DomainEvents } from '@/core/events/domain-events'
import { envSchema } from '@/infra/env/env'

config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

const connection = new Client({
  connectionString: env.DATABASE_URL,
})
let db: NodePgDatabase<typeof schema>

beforeAll(async () => {
  DomainEvents.shouldRun = false

  await connection.connect()

  db = drizzle(connection, { schema, logger: true })

  await db.execute(
    sql.raw(
      `DO $$ DECLARE
        r RECORD;
          BEGIN
            FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname =current_schema()) LOOP
              EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
            END LOOP;
        END $$;`,
    ),
  )

  exec('npm run migrate')
  console.log('Running before all tests')
})

afterAll(async () => {
  await db.execute(
    sql.raw(
      `DO $$ DECLARE
        r RECORD;
          BEGIN
            FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname =current_schema()) LOOP
              EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
            END LOOP;
        END $$;`,
    ),
  )
  await connection.end()
  console.log('Running after all tests')
  console.log('DATABASE_URL:', env.DATABASE_URL)
})
