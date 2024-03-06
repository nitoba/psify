import postgres from 'postgres'

export default async function () {
  const connection = postgres('postgresql://docker:docker@localhost:5432/psify')
  await connection`DROP DATABASE IF EXISTS psify_test WITH (FORCE)`
  await connection`CREATE DATABASE psify_test`
  return async () => {
    await connection.end()
  }
}
