import { CandidateStatus } from '@/domain/types/candidate'
import { ValidationError } from '@/domain/errors'
import { InvalidTransitionError } from '@/domain/errors'

export class Candidate {
  public readonly id: string
  public readonly name: string
  private _status: CandidateStatus

  constructor(id: string, name: string, status: CandidateStatus) {
    this.id = id
    this.name = name
    this._status = status
  }

  get status(): CandidateStatus {
    return this._status
  }

  static create(id: string, name: string, status: CandidateStatus = 'NEW'): Candidate {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Name cannot be empty')
    }
    return new Candidate(id, name, status)
  }

  shortlist(reason: string): void {
    if (reason.length < 10) {
      throw new ValidationError('Reason must be at least 10 characters')
    }
    if (this._status !== 'NEW') {
      throw new InvalidTransitionError(this._status, 'SHORTLISTED')
    }
    this._status = 'SHORTLISTED'
  }

  reject(reason: string): void {
    if (reason.length < 10) {
      throw new ValidationError('Reason must be at least 10 characters')
    }
    if (this._status !== 'NEW') {
      throw new InvalidTransitionError(this._status, 'REJECTED')
    }
    this._status = 'REJECTED'
  }
}
