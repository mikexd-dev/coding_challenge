import { Candidate } from '@/domain/models/candidate'
import { getRepository } from './repository-factory'

export async function getAllCandidates(): Promise<Candidate[]> {
  return getRepository().getAll()
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  return getRepository().getById(id)
}

export async function saveCandidate(candidate: Candidate): Promise<void> {
  return getRepository().save(candidate)
}

export async function resetStore(): Promise<void> {
  return getRepository().reset()
}

export async function generateNextId(): Promise<string> {
  return getRepository().nextId()
}
