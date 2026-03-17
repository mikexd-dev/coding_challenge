import { NextRequest, NextResponse } from 'next/server'
import { getCandidateById, saveCandidate } from '@/infrastructure/persistence/storage'
import { CandidateDTO, ErrorResponse, DecisionRequest } from '@/domain/types/candidate'
import { ValidationError, InvalidTransitionError } from '@/domain/errors'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: candidateId } = await params

  try {
    const body: DecisionRequest = await request.json()
    const decision = body.decision
    const reason = body.reason

    if (!reason || typeof reason !== 'string') {
      return NextResponse.json({ error: 'Invalid reason' } as ErrorResponse, { status: 400 })
    }

    const candidate = await getCandidateById(candidateId)

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' } as ErrorResponse, { status: 404 })
    }

    if (decision === 'SHORTLIST') {
      candidate.shortlist(reason)
    } else if (decision === 'REJECT') {
      candidate.reject(reason)
    } else {
      return NextResponse.json({ error: 'Invalid decision' } as ErrorResponse, { status: 400 })
    }

    await saveCandidate(candidate)

    const response: CandidateDTO = {
      id: candidate.id,
      name: candidate.name,
      status: candidate.status,
      reason: candidate.reason,
      decisionDate: candidate.decisionDate?.toISOString() ?? null,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    if (error instanceof ValidationError || error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: error instanceof SyntaxError ? 'Invalid JSON payload' : error.message,
        } as ErrorResponse,
        { status: 400 }
      )
    }
    if (error instanceof InvalidTransitionError) {
      return NextResponse.json({ error: error.message } as ErrorResponse, { status: 409 })
    }
    return NextResponse.json({ error: 'Error' } as ErrorResponse, { status: 500 })
  }
}
