import { CandidateStatus } from '@/domain/types/candidate'
import { ValidationError, InvalidTransitionError } from '@/domain/errors'
import { isValidName, isValidReason, canTransition } from '@/domain/validation'

export class Candidate {
  public readonly id: string
  public readonly name: string
  private _status: CandidateStatus

  private constructor(id: string, name: string, status: CandidateStatus) {
    this.id = id
    this.name = name
    this._status = status
  }

  get status(): CandidateStatus {
    return this._status
  }

  static create(id: string, name: string, status: CandidateStatus = 'NEW'): Candidate {
    if (!isValidName(name)) {
      throw new ValidationError('Name cannot be empty')
    }
    return new Candidate(id, name, status)
  }

  shortlist(reason: string): void {
    if (!isValidReason(reason)) {
      throw new ValidationError('Reason must be at least 10 characters')
    }
    if (!canTransition(this._status)) {
      throw new InvalidTransitionError(this._status, 'SHORTLISTED')
    }
    this._status = 'SHORTLISTED'
  }

  reject(reason: string): void {
    if (!isValidReason(reason)) {
      throw new ValidationError('Reason must be at least 10 characters')
    }
    if (!canTransition(this._status)) {
      throw new InvalidTransitionError(this._status, 'REJECTED')
    }
    this._status = 'REJECTED'
  }
}
