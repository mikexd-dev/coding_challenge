import { NextRequest, NextResponse } from 'next/server'
import { getCandidateById, saveCandidate } from '@/infrastructure/persistence/storage'
import { CandidateStatus, ErrorResponse, DecisionRequest } from '@/domain/types/candidate'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: candidateId } = await params

  try {
    const body: DecisionRequest = await request.json()
    const decision = body.decision
    const _reason = body.reason

    const candidate = getCandidateById(candidateId)

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' } as ErrorResponse, { status: 404 })
    }

    let newStatus: CandidateStatus
    if (decision === 'SHORTLIST') {
      newStatus = 'SHORTLISTED'
    } else if (decision === 'REJECT') {
      newStatus = 'REJECTED'
    } else {
      return NextResponse.json({ error: 'Invalid decision' } as ErrorResponse, { status: 400 })
    }
    candidate.status = newStatus

    saveCandidate(candidate)

    const response = {
      id: candidate.id,
      name: candidate.name,
      status: candidate.status,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (_error) {
    return NextResponse.json({ error: 'Error' } as ErrorResponse, { status: 500 })
  }
}
