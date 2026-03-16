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

    // GAP: No name validation exists in the domain model
    it.fails('rejects empty name', () => {
      expect(() => Candidate.create('c_1', '')).toThrow()
    })
  })

  describe('status transitions', () => {
    // GAP: Candidate has no shortlist() method — status is mutated directly
    it.fails('shortlists a NEW candidate via domain method', () => {
      const candidate = Candidate.create('c_1', 'Alice')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(candidate as any).shortlist('Great candidate for the engineering role')
      expect(candidate.status).toBe('SHORTLISTED')
    })

    // GAP: Candidate has no reject() method — status is mutated directly
    it.fails('rejects a NEW candidate via domain method', () => {
      const candidate = Candidate.create('c_1', 'Alice')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(candidate as any).reject('Not enough relevant experience')
      expect(candidate.status).toBe('REJECTED')
    })
  })

  describe('transition guards', () => {
    // GAP: No transition guard — REJECTED candidates can be shortlisted
    it.fails('cannot shortlist a REJECTED candidate', () => {
      const candidate = Candidate.create('c_1', 'Alice', 'REJECTED')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(candidate as any).shortlist('Great candidate for the engineering role')
    })

    // GAP: No transition guard — SHORTLISTED candidates can be rejected
    it.fails('cannot reject a SHORTLISTED candidate', () => {
      const candidate = Candidate.create('c_1', 'Alice', 'SHORTLISTED')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(candidate as any).reject('Not enough relevant experience')
    })
  })

  describe('reason validation', () => {
    // GAP: No reason validation — reason is ignored entirely
    it.fails('rejects reason shorter than 10 characters', () => {
      const candidate = Candidate.create('c_1', 'Alice')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(candidate as any).shortlist('short')
    })
  })
})
