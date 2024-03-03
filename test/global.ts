import { Client } from 'pg'

export default async function () {
  const connection = new Client({
    connectionString:
      'postgresql://docker:docker@localhost:5432/psify?schema=public',
  })

  await connection.connect()
  await connection.query('DROP DATABASE IF EXISTS psify_test WITH (FORCE)')
  await connection.query('CREATE DATABASE psify_test')
  return async () => {
    await connection.end()
  }
}
