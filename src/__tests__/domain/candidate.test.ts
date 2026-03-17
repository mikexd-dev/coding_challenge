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

    it('has null reason and decisionDate for NEW candidate', () => {
      const candidate = Candidate.create('c_1', 'Alice Johnson')
      expect(candidate.reason).toBeNull()
      expect(candidate.decisionDate).toBeNull()
    })

    it('rejects empty name', () => {
      expect(() => Candidate.create('c_1', '')).toThrow()
    })

    it('rehydrates with reason and decisionDate', () => {
      const date = new Date('2025-01-15T10:00:00Z')
      const candidate = Candidate.create('c_1', 'Alice', 'SHORTLISTED', 'Great fit for the role', date)
      expect(candidate.status).toBe('SHORTLISTED')
      expect(candidate.reason).toBe('Great fit for the role')
      expect(candidate.decisionDate).toEqual(date)
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

    it('stores reason and decisionDate after shortlist', () => {
      const candidate = Candidate.create('c_1', 'Alice')
      const before = new Date()
      candidate.shortlist('Great candidate for the engineering role')
      const after = new Date()

      expect(candidate.reason).toBe('Great candidate for the engineering role')
      expect(candidate.decisionDate).not.toBeNull()
      expect(candidate.decisionDate?.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(candidate.decisionDate?.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('stores reason and decisionDate after reject', () => {
      const candidate = Candidate.create('c_1', 'Alice')
      candidate.reject('Not enough relevant experience')

      expect(candidate.reason).toBe('Not enough relevant experience')
      expect(candidate.decisionDate).not.toBeNull()
    })
  })

  describe('canTransitionTo', () => {
    it('NEW candidate can transition to SHORTLISTED', () => {
      const candidate = Candidate.create('c_1', 'Alice')
      expect(candidate.canTransitionTo('SHORTLISTED')).toBe(true)
    })

    it('NEW candidate can transition to REJECTED', () => {
      const candidate = Candidate.create('c_1', 'Alice')
      expect(candidate.canTransitionTo('REJECTED')).toBe(true)
    })

    it('NEW candidate cannot transition to NEW', () => {
      const candidate = Candidate.create('c_1', 'Alice')
      expect(candidate.canTransitionTo('NEW')).toBe(false)
    })

    it('SHORTLISTED candidate cannot transition', () => {
      const candidate = Candidate.create('c_1', 'Alice', 'SHORTLISTED')
      expect(candidate.canTransitionTo('REJECTED')).toBe(false)
      expect(candidate.canTransitionTo('NEW')).toBe(false)
    })

    it('REJECTED candidate cannot transition', () => {
      const candidate = Candidate.create('c_1', 'Alice', 'REJECTED')
      expect(candidate.canTransitionTo('SHORTLISTED')).toBe(false)
      expect(candidate.canTransitionTo('NEW')).toBe(false)
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
