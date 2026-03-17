import { Candidate } from '@/domain/models/candidate'

export interface CandidateRepository {
  getAll(): Promise<Candidate[]>
  getById(id: string): Promise<Candidate | null>
  save(candidate: Candidate): Promise<void>
  nextId(): Promise<string>
  reset(): Promise<void>
}
