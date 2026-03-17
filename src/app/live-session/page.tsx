'use client'

import { useState, useEffect, Suspense } from 'react'
import { CandidateDTO, DecisionAction } from '@/domain/types/candidate'
import { getAllCandidates, createCandidate, submitDecision } from '@/lib/api/candidates'
import { CandidateBoard } from '@/components/candidate-board'
import { CreateCandidateForm } from '@/components/create-candidate-form'
import { CandidateSheet } from '@/components/candidate-sheet'
import { BusinessRules } from '@/components/business-rules'
import { Skeleton } from '@/components/ui/skeleton'

interface SheetState {
  open: boolean
  candidateId: string | null
  prefilledDecision: DecisionAction | null
}

function LiveSessionContent() {
  const [candidates, setCandidates] = useState<CandidateDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sheetState, setSheetState] = useState<SheetState>({
    open: false,
    candidateId: null,
    prefilledDecision: null,
  })

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

  const handleCardClick = (id: string) => {
    setSheetState({ open: true, candidateId: id, prefilledDecision: null })
  }

  const handleDrop = (candidateId: string, decision: DecisionAction) => {
    setSheetState({ open: true, candidateId, prefilledDecision: decision })
  }

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      setSheetState({ open: false, candidateId: null, prefilledDecision: null })
    }
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
    if (!sheetState.candidateId) return
    try {
      await submitDecision(sheetState.candidateId, decision, reason)
      setSheetState({ open: false, candidateId: null, prefilledDecision: null })
      fetchCandidates()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    }
  }

  const selectedCandidate = candidates.find((c) => c.id === sheetState.candidateId) ?? null

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 pb-36 font-sans">
      <h1 className="text-2xl font-bold mb-6">Candidate Management</h1>

      {error && (
        <div className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Create Candidate</h2>
        <CreateCandidateForm onSubmit={handleCreateCandidate} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Candidate Board</h2>
        <CandidateBoard
          candidates={candidates}
          onCardClick={handleCardClick}
          onDrop={handleDrop}
          loading={loading}
        />
      </div>

      <CandidateSheet
        open={sheetState.open}
        onOpenChange={handleSheetOpenChange}
        candidate={selectedCandidate}
        prefilledDecision={sheetState.prefilledDecision}
        onSubmit={handleSubmitDecision}
      />

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-6 py-3">
        <div className="mx-auto max-w-6xl">
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
        <div className="mx-auto max-w-6xl px-6 py-12">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-48" />
        </div>
      }
    >
      <LiveSessionContent />
    </Suspense>
  )
}
