import { CandidateRepository } from '@/domain/repositories'
import { InMemoryCandidateRepository } from './in-memory-repository'

let instance: CandidateRepository | null = null

export function getRepository(): CandidateRepository {
  if (instance) return instance

  if (process.env.DATABASE_URL) {
    // Lazy require to avoid loading Neon deps when running in-memory
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { NeonCandidateRepository } = require('./neon-repository')
    instance = new NeonCandidateRepository() as CandidateRepository
  } else {
    instance = new InMemoryCandidateRepository()
  }

  return instance
}

/** Override the repository instance (for testing) */
export function setRepository(repo: CandidateRepository): void {
  instance = repo
}

/** Reset the singleton (for testing) */
export function resetRepository(): void {
  instance = null
}
