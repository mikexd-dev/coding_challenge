import { CandidateStatus } from '@/domain/types/candidate'
import { ValidationError, InvalidTransitionError } from '@/domain/errors'
import { isValidName, isValidReason, canTransition } from '@/domain/validation'

export class Candidate {
  public readonly id: string
  public readonly name: string
  private _status: CandidateStatus
  private _reason: string | null
  private _decisionDate: Date | null

  private constructor(
    id: string,
    name: string,
    status: CandidateStatus,
    reason: string | null,
    decisionDate: Date | null
  ) {
    this.id = id
    this.name = name
    this._status = status
    this._reason = reason
    this._decisionDate = decisionDate
  }

  get status(): CandidateStatus {
    return this._status
  }

  get reason(): string | null {
    return this._reason
  }

  get decisionDate(): Date | null {
    return this._decisionDate
  }

  static create(
    id: string,
    name: string,
    status: CandidateStatus = 'NEW',
    reason: string | null = null,
    decisionDate: Date | null = null
  ): Candidate {
    if (!isValidName(name)) {
      throw new ValidationError('Name cannot be empty')
    }
    return new Candidate(id, name, status, reason, decisionDate)
  }

  canTransitionTo(target: CandidateStatus): boolean {
    if (target === this._status) return false
    return canTransition(this._status)
  }

  shortlist(reason: string): void {
    if (!isValidReason(reason)) {
      throw new ValidationError('Reason must be at least 10 characters')
    }
    if (!this.canTransitionTo('SHORTLISTED')) {
      throw new InvalidTransitionError(this._status, 'SHORTLISTED')
    }
    this._status = 'SHORTLISTED'
    this._reason = reason
    this._decisionDate = new Date()
  }

  reject(reason: string): void {
    if (!isValidReason(reason)) {
      throw new ValidationError('Reason must be at least 10 characters')
    }
    if (!this.canTransitionTo('REJECTED')) {
      throw new InvalidTransitionError(this._status, 'REJECTED')
    }
    this._status = 'REJECTED'
    this._reason = reason
    this._decisionDate = new Date()
  }
}
