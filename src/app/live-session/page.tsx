'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CandidateDTO, DecisionAction } from '@/domain/types/candidate'
import { getAllCandidates, createCandidate, submitDecision } from '@/lib/api/candidates'
import { CandidateBoard } from '@/components/candidate-board'
import { CreateCandidateForm } from '@/components/create-candidate-form'
import { UpdateStatusForm } from '@/components/update-status-form'
import { BusinessRules } from '@/components/business-rules'
import { Skeleton } from '@/components/ui/skeleton'

function LiveSessionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get('candidateId')

  const [candidates, setCandidates] = useState<CandidateDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const data = await getAllCandidates()
      setCandidates(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCandidate = (id: string) => {
    router.push(`?candidateId=${id}`)
  }

  const handleCreateCandidate = async (name: string) => {
    setError(null)
    try {
      await createCandidate(name)
      fetchCandidates()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    }
  }

  const handleSubmitDecision = async (decision: DecisionAction, reason: string) => {
    setError(null)
    if (!selectedId) return
    try {
      await submitDecision(selectedId, decision, reason)
      router.push('/live-session')
      fetchCandidates()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    }
  }

  const selectedCandidate = candidates.find((c) => c.id === selectedId)

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 pb-36 font-sans">
      <h1 className="text-2xl font-bold mb-6">Candidate Management</h1>

      {error && (
        <div className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="text-lg font-semibold mb-4">Candidate Board</h2>
          <CandidateBoard
            candidates={candidates}
            selectedId={selectedId}
            onSelect={handleSelectCandidate}
            loading={loading}
          />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Create Candidate</h2>
            <CreateCandidateForm onSubmit={handleCreateCandidate} />
          </div>

          {selectedCandidate && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Update Status</h2>
              <UpdateStatusForm candidate={selectedCandidate} onSubmit={handleSubmitDecision} />
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-6 py-3">
        <div className="mx-auto max-w-5xl">
          <BusinessRules />
        </div>
      </div>
    </div>
  )
}

export default function LiveSession() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-6 py-12">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
            <Skeleton className="h-48" />
            <Skeleton className="h-32" />
          </div>
        </div>
      }
    >
      <LiveSessionContent />
    </Suspense>
  )
}
