import { describe, it, expect } from 'vitest'
import { MIN_REASON_LENGTH, isValidName, isValidReason, canTransition } from '@/domain/validation'

describe('Shared Validation Rules', () => {
  describe('MIN_REASON_LENGTH', () => {
    it('is 10', () => {
      expect(MIN_REASON_LENGTH).toBe(10)
    })
  })

  describe('isValidName', () => {
    it('rejects empty string', () => {
      expect(isValidName('')).toBe(false)
    })

    it('rejects whitespace-only string', () => {
      expect(isValidName('   ')).toBe(false)
    })

    it('accepts valid name', () => {
      expect(isValidName('Alice')).toBe(true)
    })

    it('rejects non-string values', () => {
      expect(isValidName(null)).toBe(false)
      expect(isValidName(undefined)).toBe(false)
      expect(isValidName(123)).toBe(false)
    })
  })

  describe('isValidReason', () => {
    it('rejects short reason', () => {
      expect(isValidReason('short')).toBe(false)
    })

    it('accepts reason of exactly 10 characters', () => {
      expect(isValidReason('1234567890')).toBe(true)
    })

    it('rejects non-string values', () => {
      expect(isValidReason(null)).toBe(false)
      expect(isValidReason(undefined)).toBe(false)
      expect(isValidReason(123)).toBe(false)
    })
  })

  describe('canTransition', () => {
    it('allows NEW status', () => {
      expect(canTransition('NEW')).toBe(true)
    })

    it('blocks SHORTLISTED status', () => {
      expect(canTransition('SHORTLISTED')).toBe(false)
    })

    it('blocks REJECTED status', () => {
      expect(canTransition('REJECTED')).toBe(false)
    })
  })
})
