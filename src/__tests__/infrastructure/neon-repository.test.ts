import { describe, it, expect, beforeEach } from 'vitest'
import { Candidate } from '@/domain/models/candidate'

const hasDb = !!process.env.DATABASE_URL

describe.skipIf(!hasDb)('NeonCandidateRepository', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let repo: any

  beforeEach(async () => {
    const { NeonCandidateRepository } = await import(
      '@/infrastructure/persistence/neon-repository'
    )
    repo = new NeonCandidateRepository()
    await repo.reset()
  })

  it('seeds two candidates', async () => {
    const all = await repo.getAll()
    expect(all).toHaveLength(2)
    expect(all[0]?.name).toBe('Alice Johnson')
  })

  it('gets a candidate by id', async () => {
    const candidate = await repo.getById('c_1')
    expect(candidate).not.toBeNull()
    expect(candidate?.name).toBe('Alice Johnson')
  })

  it('returns null for unknown id', async () => {
    const candidate = await repo.getById('nonexistent')
    expect(candidate).toBeNull()
  })

  it('saves and retrieves a candidate', async () => {
    const candidate = Candidate.create('c_3', 'Charlie Brown')
    await repo.save(candidate)

    const retrieved = await repo.getById('c_3')
    expect(retrieved).not.toBeNull()
    expect(retrieved?.name).toBe('Charlie Brown')
  })

  it('upserts on save', async () => {
    const candidate = await repo.getById('c_1')
    candidate.shortlist('Excellent candidate for the role')
    await repo.save(candidate)

    const updated = await repo.getById('c_1')
    expect(updated?.status).toBe('SHORTLISTED')
    expect(updated?.reason).toBe('Excellent candidate for the role')
  })

  it('generates incrementing ids', async () => {
    expect(await repo.nextId()).toBe('c_3')
  })

  it('resets to initial state', async () => {
    await repo.save(Candidate.create('c_99', 'Extra'))
    await repo.reset()
    const all = await repo.getAll()
    expect(all).toHaveLength(2)
  })
})
