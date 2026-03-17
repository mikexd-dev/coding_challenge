import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAllCandidates,
  getCandidateById,
  saveCandidate,
  generateNextId,
  resetStore,
} from '@/infrastructure/persistence/storage'
import { Candidate } from '@/domain/models/candidate'

describe('In-Memory Storage', () => {
  beforeEach(async () => {
    await resetStore()
  })

  describe('getAllCandidates', () => {
    it('returns seeded candidates', async () => {
      const candidates = await getAllCandidates()
      expect(candidates).toHaveLength(2)
      expect(candidates[0]?.name).toBe('Alice Johnson')
      expect(candidates[1]?.name).toBe('Bob Williams')
    })
  })

  describe('getCandidateById', () => {
    it('returns correct candidate by id', async () => {
      const candidate = await getCandidateById('c_1')
      expect(candidate).not.toBeNull()
      expect(candidate?.name).toBe('Alice Johnson')
      expect(candidate?.status).toBe('NEW')
    })

    it('returns null for missing id', async () => {
      const candidate = await getCandidateById('nonexistent')
      expect(candidate).toBeNull()
    })
  })

  describe('saveCandidate', () => {
    it('persists a new candidate', async () => {
      const candidate = Candidate.create('c_3', 'Charlie Brown')
      await saveCandidate(candidate)

      const retrieved = await getCandidateById('c_3')
      expect(retrieved).not.toBeNull()
      expect(retrieved?.name).toBe('Charlie Brown')
      expect(retrieved?.status).toBe('NEW')
    })
  })

  describe('generateNextId', () => {
    it('returns incrementing id', async () => {
      const id = await generateNextId()
      expect(id).toBe('c_3')
    })

    it('increments after adding a candidate', async () => {
      const candidate = Candidate.create('c_3', 'Charlie')
      await saveCandidate(candidate)

      const id = await generateNextId()
      expect(id).toBe('c_4')
    })
  })

  describe('resetStore', () => {
    it('resets to initial seeded state', async () => {
      await saveCandidate(Candidate.create('c_99', 'Extra'))
      expect(await getAllCandidates()).toHaveLength(3)

      await resetStore()

      const candidates = await getAllCandidates()
      expect(candidates).toHaveLength(2)
      expect(candidates[0]?.name).toBe('Alice Johnson')
      expect(candidates[1]?.name).toBe('Bob Williams')
    })
  })
})
