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
  beforeEach(() => {
    resetStore()
  })

  describe('getAllCandidates', () => {
    it('returns seeded candidates', () => {
      const candidates = getAllCandidates()
      expect(candidates).toHaveLength(2)
      expect(candidates[0]?.name).toBe('Alice Johnson')
      expect(candidates[1]?.name).toBe('Bob Williams')
    })
  })

  describe('getCandidateById', () => {
    it('returns correct candidate by id', () => {
      const candidate = getCandidateById('c_1')
      expect(candidate).not.toBeNull()
      expect(candidate?.name).toBe('Alice Johnson')
      expect(candidate?.status).toBe('NEW')
    })

    it('returns null for missing id', () => {
      const candidate = getCandidateById('nonexistent')
      expect(candidate).toBeNull()
    })
  })

  describe('saveCandidate', () => {
    it('persists a new candidate', () => {
      const candidate = Candidate.create('c_3', 'Charlie Brown')
      saveCandidate(candidate)

      const retrieved = getCandidateById('c_3')
      expect(retrieved).not.toBeNull()
      expect(retrieved?.name).toBe('Charlie Brown')
      expect(retrieved?.status).toBe('NEW')
    })
  })

  describe('generateNextId', () => {
    it('returns incrementing id', () => {
      const id = generateNextId()
      expect(id).toBe('c_3')
    })

    it('increments after adding a candidate', () => {
      const candidate = Candidate.create('c_3', 'Charlie')
      saveCandidate(candidate)

      const id = generateNextId()
      expect(id).toBe('c_4')
    })
  })

  describe('resetStore', () => {
    it('resets to initial seeded state', () => {
      saveCandidate(Candidate.create('c_99', 'Extra'))
      expect(getAllCandidates()).toHaveLength(3)

      resetStore()

      const candidates = getAllCandidates()
      expect(candidates).toHaveLength(2)
      expect(candidates[0]?.name).toBe('Alice Johnson')
      expect(candidates[1]?.name).toBe('Bob Williams')
    })
  })
})
