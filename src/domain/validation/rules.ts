import { CandidateStatus } from '@/domain/types/candidate'

export const MIN_REASON_LENGTH = 10

export function isValidName(name: unknown): boolean {
  return typeof name === 'string' && name.trim().length > 0
}

export function isValidReason(reason: unknown): boolean {
  return typeof reason === 'string' && reason.trim().length >= MIN_REASON_LENGTH
}

export function canTransition(status: CandidateStatus): boolean {
  return status === 'NEW'
}
