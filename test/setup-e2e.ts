import { randomUUID } from 'crypto'
import { config } from 'dotenv'
import { Client } from 'pg'
import { exec } from 'shelljs'

import { DomainEvents } from '@/core/events/domain-events'
import { envSchema } from '@/infra/env/env'
config({ path: '.env.test', override: true })
const env = envSchema.parse(process.env)
const connection = new Client({
  connectionString: env.DATABASE_URL,
})

const dbName = randomUUID()

beforeAll(async () => {
  DomainEvents.shouldRun = false
  await connection.connect()

  await connection.query(`CREATE DATABASE "${dbName}"`)

  process.env = {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL?.replace('psify_test', dbName),
  }

  exec('npm run migrate')

  await connection.query(
    `TRUNCATE TABLE psychologists, patients, accounts, users, appointments, available_times`,
  )
})
// beforeEach(async () => {
//   // await db.execute(sql.raw(`CREATE DATABASE `))
//   await db.execute(
//     sql.raw(
//       `TRUNCATE TABLE psychologists, patients, accounts, users, appointments, available_times`,
//     ),
//   )
//   exec('npm run migrate')
// })
// afterEach(async () => {
//   await db.execute(
//     sql.raw(
//       `TRUNCATE TABLE psychologists, patients, accounts, users, appointments, available_times`,
//     ),
//   )
//   exec('npm run migrate')
// })
afterAll(async () => {
  await connection.query(
    `TRUNCATE TABLE psychologists, patients, accounts, users, appointments, available_times`,
  )
  await connection.query(`DROP DATABASE IF EXISTS "${dbName} WITH (FORCE)"`)
  await connection.end()
  console.log('Running after all tests')
})
// import { sql } from 'drizzle-orm'
// import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
// import { Client } from 'pg'
// import { DomainEvents } from '@/core/events/domain-events'
// import { envSchema } from '@/infra/env/env'
// config({ path: '.env.test', override: true })
// // import * as schema from 'src/infra/database/drizzle/schemas'

// envSchema.parse(process.env)

// let container: StartedPostgreSqlContainer
// let connection: Client
// let db: NodePgDatabase<typeof schema>

// beforeAll(() => {
//   console.log('AAAAAAAANNNNNNNTES')
// })

// beforeAll(async () => {
//   console.log('Teste antes')
//   const dbName = randomUUID()
//   container = await new PostgreSqlContainer()
//     .withDatabase(dbName)
//     // .withEnvironment({ DEBUG: '' })
//     .start()

//   connection = new Client({
//     connectionString: container.getConnectionUri(),
//   })

//   // db = drizzle(connection, { schema })

//   await connection.connect()
//   process.env = {
//     ...process.env,
//     DATABASE_URL: container.getConnectionUri(),
//   }
//   exec('npm run migrate')
// })

// afterAll(async () => {
//   await connection.end()
//   await container.stop()
// })
