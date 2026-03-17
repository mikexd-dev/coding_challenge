import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { candidates } from '../src/infrastructure/db/schema'

async function seed() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  const sql = neon(databaseUrl)
  const db = drizzle(sql)

  console.log('Seeding database...')

  await db.delete(candidates)
  await db.insert(candidates).values([
    { id: 'c_1', name: 'Alice Johnson', status: 'NEW' },
    { id: 'c_2', name: 'Bob Williams', status: 'NEW' },
  ])

  console.log('Seeded 2 candidates.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
