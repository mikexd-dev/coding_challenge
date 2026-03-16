import { describe, it, expect, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/candidates/route'
import { POST as postDecision } from '@/app/api/candidates/[id]/decision/route'
import { resetStore } from '@/infrastructure/persistence/storage'

function createRequest(body: Record<string, unknown>, url = 'http://localhost:3000') {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function createDecisionRequest(candidateId: string, body: Record<string, unknown>) {
  const request = createRequest(body)
  const params = Promise.resolve({ id: candidateId })
  return { request, context: { params } }
}

describe('Candidates API', () => {
  beforeEach(() => {
    resetStore()
  })

  describe('GET /api/candidates', () => {
    it('returns 200 with candidate list', async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(2)
      expect(data[0]).toMatchObject({ id: 'c_1', name: 'Alice Johnson', status: 'NEW' })
    })
  })

  describe('POST /api/candidates', () => {
    it('creates a candidate with 201', async () => {
      const request = createRequest({ name: 'Charlie Brown' })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toMatchObject({ name: 'Charlie Brown', status: 'NEW' })
      expect(data.id).toBeDefined()
    })

    // GAP: No name validation — empty string is accepted
    it.fails('rejects empty name with 400', async () => {
      const request = createRequest({ name: '' })
      const response = await POST(request)
      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/candidates/:id/decision', () => {
    it('shortlists a NEW candidate', async () => {
      const { request, context } = createDecisionRequest('c_1', {
        decision: 'SHORTLIST',
        reason: 'Good candidate for role',
      })
      const response = await postDecision(request, context)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('SHORTLISTED')
    })

    it('rejects a NEW candidate', async () => {
      const { request, context } = createDecisionRequest('c_1', {
        decision: 'REJECT',
        reason: 'Not enough experience',
      })
      const response = await postDecision(request, context)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('REJECTED')
    })

    it('returns 404 for missing candidate', async () => {
      const { request, context } = createDecisionRequest('nonexistent', {
        decision: 'SHORTLIST',
        reason: 'Good candidate for role',
      })
      const response = await postDecision(request, context)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Candidate not found')
    })

    it('returns 400 for invalid decision', async () => {
      const { request, context } = createDecisionRequest('c_1', {
        decision: 'INVALID',
        reason: 'Some reason here for test',
      })
      const response = await postDecision(request, context)

      expect(response.status).toBe(400)
    })

    // GAP: No transition guard — REJECTED candidates can be shortlisted
    it.fails('prevents shortlisting a REJECTED candidate (409)', async () => {
      // First reject the candidate
      const { request: rejectReq, context: rejectCtx } = createDecisionRequest('c_1', {
        decision: 'REJECT',
        reason: 'Not enough experience',
      })
      await postDecision(rejectReq, rejectCtx)

      // Then try to shortlist
      const { request, context } = createDecisionRequest('c_1', {
        decision: 'SHORTLIST',
        reason: 'Actually reconsidered this',
      })
      const response = await postDecision(request, context)
      expect(response.status).toBe(409)
    })

    // GAP: No transition guard — SHORTLISTED candidates can be rejected
    it.fails('prevents rejecting a SHORTLISTED candidate (409)', async () => {
      // First shortlist the candidate
      const { request: shortlistReq, context: shortlistCtx } = createDecisionRequest('c_1', {
        decision: 'SHORTLIST',
        reason: 'Good candidate for role',
      })
      await postDecision(shortlistReq, shortlistCtx)

      // Then try to reject
      const { request, context } = createDecisionRequest('c_1', {
        decision: 'REJECT',
        reason: 'Changed mind about this',
      })
      const response = await postDecision(request, context)
      expect(response.status).toBe(409)
    })

    // GAP: No reason validation — reason is ignored entirely
    it.fails('rejects reason shorter than 10 characters (400)', async () => {
      const { request, context } = createDecisionRequest('c_1', {
        decision: 'SHORTLIST',
        reason: 'short',
      })
      const response = await postDecision(request, context)
      expect(response.status).toBe(400)
    })
  })
})
