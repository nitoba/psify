import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'
import { randomUUID } from 'crypto'
import { config } from 'dotenv'
import { Client } from 'pg'
import { exec } from 'shelljs'

import { envSchema } from '@/infra/env/env'

config({ path: '.env.test', override: true })

envSchema.parse(process.env)

let container: StartedPostgreSqlContainer
let connection: Client
beforeAll(async () => {
  const dbName = randomUUID()
  container = await new PostgreSqlContainer().withDatabase(dbName).start()

  connection = new Client({
    connectionString: container.getConnectionUri(),
  })

  await connection.connect()
  process.env = {
    ...process.env,
    DATABASE_URL: container.getConnectionUri(),
  }
  exec('npm run migrate')
})

afterAll(async () => {
  await connection.end()
})
