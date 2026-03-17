import { eq, sql } from 'drizzle-orm'
import { Candidate } from '@/domain/models/candidate'
import { CandidateStatus } from '@/domain/types/candidate'
import { CandidateRepository } from '@/domain/repositories'
import { getDb } from '@/infrastructure/db/connection'
import { candidates } from '@/infrastructure/db/schema'

export class NeonCandidateRepository implements CandidateRepository {
  async getAll(): Promise<Candidate[]> {
    const db = getDb()
    const rows = await db.select().from(candidates)
    return rows.map((row) =>
      Candidate.create(
        row.id,
        row.name,
        row.status as CandidateStatus,
        row.reason ?? null,
        row.decisionDate ?? null
      )
    )
  }

  async getById(id: string): Promise<Candidate | null> {
    const db = getDb()
    const rows = await db.select().from(candidates).where(eq(candidates.id, id))
    const row = rows[0]
    if (!row) return null
    return Candidate.create(
      row.id,
      row.name,
      row.status as CandidateStatus,
      row.reason ?? null,
      row.decisionDate ?? null
    )
  }

  async save(candidate: Candidate): Promise<void> {
    const db = getDb()
    await db
      .insert(candidates)
      .values({
        id: candidate.id,
        name: candidate.name,
        status: candidate.status,
        reason: candidate.reason,
        decisionDate: candidate.decisionDate,
      })
      .onConflictDoUpdate({
        target: candidates.id,
        set: {
          name: candidate.name,
          status: candidate.status,
          reason: candidate.reason,
          decisionDate: candidate.decisionDate,
        },
      })
  }

  async nextId(): Promise<string> {
    const db = getDb()
    const result = await db
      .select({
        maxNum: sql<number>`max(cast(split_part(id, '_', 2) as int))`,
      })
      .from(candidates)
    const maxNum = result[0]?.maxNum
    if (maxNum == null) return 'c_1'
    return `c_${maxNum + 1}`
  }

  async reset(): Promise<void> {
    const db = getDb()
    await db.delete(candidates)
    await db.insert(candidates).values([
      { id: 'c_1', name: 'Alice Johnson', status: 'NEW' },
      { id: 'c_2', name: 'Bob Williams', status: 'NEW' },
    ])
  }
}
