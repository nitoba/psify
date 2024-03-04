import { randomUUID } from 'crypto'
import { config } from 'dotenv'
import postgres from 'postgres'
import { exec } from 'shelljs'

import { DomainEvents } from '@/core/events/domain-events'
import { envSchema } from '@/infra/env/env'
config({ path: '.env.test', override: true })
const env = envSchema.parse(process.env)
const connections: postgres.Sql[] = []

const dbName = randomUUID()

beforeAll(async () => {
  const connection = postgres(env.DATABASE_URL)

  connections.push(connection)

  DomainEvents.shouldRun = false

  await connection`CREATE DATABASE ${connection(dbName)}`

  process.env = {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL?.replace('psify_test', dbName),
  }

  exec('npm run migrate')
})

afterAll(async () => {
  for (const connection of connections) {
    await connection`DROP DATABASE IF EXISTS ${connection(dbName)} WITH (FORCE)`
    await connection.end()
  }
})
