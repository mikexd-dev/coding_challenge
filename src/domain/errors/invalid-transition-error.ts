import { DomainError } from './domain-error'

export class InvalidTransitionError extends DomainError {
  public readonly from: string
  public readonly to: string

  constructor(from: string, to: string) {
    super(`Cannot transition from ${from} to ${to}`)
    this.from = from
    this.to = to
  }
}
