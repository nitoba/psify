import postgres from 'postgres'

export default async function () {
  const connection = postgres('postgresql://docker:docker@localhost:5432/psyfi')
  await connection`DROP DATABASE IF EXISTS psyfi_test WITH (FORCE)`
  await connection`CREATE DATABASE psyfi_test`
  return async () => {
    await connection.end()
  }
}
