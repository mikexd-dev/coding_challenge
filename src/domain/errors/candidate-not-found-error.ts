import { DomainError } from './domain-error'

export class CandidateNotFoundError extends DomainError {
  public readonly id: string

  constructor(id: string) {
    super(`Candidate not found: ${id}`)
    this.id = id
  }
}
