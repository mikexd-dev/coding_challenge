import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryCandidateRepository } from '@/infrastructure/persistence/in-memory-repository'
import { Candidate } from '@/domain/models/candidate'

describe('InMemoryCandidateRepository', () => {
  let repo: InMemoryCandidateRepository

  beforeEach(() => {
    repo = new InMemoryCandidateRepository()
  })

  it('seeds two candidates on construction', async () => {
    const all = await repo.getAll()
    expect(all).toHaveLength(2)
    expect(all[0]?.name).toBe('Alice Johnson')
    expect(all[1]?.name).toBe('Bob Williams')
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

  it('generates incrementing ids', async () => {
    expect(await repo.nextId()).toBe('c_3')

    await repo.save(Candidate.create('c_3', 'Charlie'))
    expect(await repo.nextId()).toBe('c_4')
  })

  it('resets to initial state', async () => {
    await repo.save(Candidate.create('c_99', 'Extra'))
    expect(await repo.getAll()).toHaveLength(3)

    await repo.reset()
    const all = await repo.getAll()
    expect(all).toHaveLength(2)
    expect(all[0]?.name).toBe('Alice Johnson')
  })
})
