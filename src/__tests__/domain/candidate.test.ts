import { describe, it, expect } from 'vitest'
import { Candidate } from '@/domain/models/candidate'

describe('Candidate Domain Model', () => {
  describe('creation', () => {
    it('creates a candidate with NEW status', () => {
      const candidate = Candidate.create('c_1', 'Alice Johnson')
      expect(candidate.id).toBe('c_1')
      expect(candidate.name).toBe('Alice Johnson')
      expect(candidate.status).toBe('NEW')
    })

    it('rejects empty name', () => {
      expect(() => Candidate.create('c_1', '')).toThrow()
    })
  })

  describe('status transitions', () => {
    it('shortlists a NEW candidate via domain method', () => {
      const candidate = Candidate.create('c_1', 'Alice')
      candidate.shortlist('Great candidate for the engineering role')
      expect(candidate.status).toBe('SHORTLISTED')
    })

    it('rejects a NEW candidate via domain method', () => {
      const candidate = Candidate.create('c_1', 'Alice')
      candidate.reject('Not enough relevant experience')
      expect(candidate.status).toBe('REJECTED')
    })
  })

  describe('transition guards', () => {
    it('cannot shortlist a REJECTED candidate', () => {
      const candidate = Candidate.create('c_1', 'Alice', 'REJECTED')
      expect(() => candidate.shortlist('Great candidate for the engineering role')).toThrow()
    })

    it('cannot reject a SHORTLISTED candidate', () => {
      const candidate = Candidate.create('c_1', 'Alice', 'SHORTLISTED')
      expect(() => candidate.reject('Not enough relevant experience')).toThrow()
    })
  })

  describe('reason validation', () => {
    it('rejects reason shorter than 10 characters', () => {
      const candidate = Candidate.create('c_1', 'Alice')
      expect(() => candidate.shortlist('short')).toThrow()
    })
  })
})
