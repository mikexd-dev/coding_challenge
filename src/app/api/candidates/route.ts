import { NextRequest, NextResponse } from 'next/server'
import {
  getAllCandidates,
  saveCandidate,
  generateNextId,
} from '@/infrastructure/persistence/storage'
import { Candidate } from '@/domain/models/candidate'
import { CandidateDTO, CreateCandidateRequest, ErrorResponse } from '@/domain/types/candidate'
import { ValidationError } from '@/domain/errors'

export async function GET() {
  try {
    const candidates = getAllCandidates()

    const response: CandidateDTO[] = candidates.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
    }))

    return NextResponse.json(response)
  } catch (_error) {
    return NextResponse.json({ error: 'Error' } as ErrorResponse, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCandidateRequest = await request.json()
    const name = body.name

    const id = generateNextId()
    const candidate = Candidate.create(id, name)
    saveCandidate(candidate)

    const response = {
      id: candidate.id,
      name: candidate.name,
      status: candidate.status,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    if (error instanceof ValidationError || error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: error instanceof SyntaxError ? 'Invalid JSON payload' : error.message,
        } as ErrorResponse,
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Error' } as ErrorResponse, { status: 500 })
  }
}
