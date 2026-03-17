import { Candidate } from '@/domain/models/candidate'
import { CandidateRepository } from '@/domain/repositories'

export class InMemoryCandidateRepository implements CandidateRepository {
  private store = new Map<string, Candidate>()

  constructor() {
    this.seed()
  }

  private seed(): void {
    this.store.set('c_1', Candidate.create('c_1', 'Alice Johnson', 'NEW'))
    this.store.set('c_2', Candidate.create('c_2', 'Bob Williams', 'NEW'))
  }

  async getAll(): Promise<Candidate[]> {
    return Array.from(this.store.values())
  }

  async getById(id: string): Promise<Candidate | null> {
    return this.store.get(id) ?? null
  }

  async save(candidate: Candidate): Promise<void> {
    this.store.set(candidate.id, candidate)
  }

  async nextId(): Promise<string> {
    const ids = Array.from(this.store.keys())
    const nums = ids
      .map((id) => {
        const part = id.split('_')[1]
        return part !== undefined ? parseInt(part) : NaN
      })
      .filter((n) => !isNaN(n))
    const maxNum = nums.length > 0 ? Math.max(...nums) : 0
    return `c_${maxNum + 1}`
  }

  async reset(): Promise<void> {
    this.store.clear()
    this.seed()
  }
}
