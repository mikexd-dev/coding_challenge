'use client'

import { useRef, startTransition, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useQueryClient } from '@tanstack/react-query'
import type { CandidateDTO, DecisionAction } from '@/domain/types/candidate'
import { useCandidates } from '@/hooks/use-candidates'
import { useOptimisticCandidates } from '@/hooks/use-optimistic-candidates'
import { useCandidateSheet } from '@/hooks/use-candidate-sheet'
import { CandidateBoard } from '@/components/candidate-board'
import { CreateCandidateForm } from '@/components/create-candidate-form'
import { CandidateSheet } from '@/components/candidate-sheet'
import { BusinessRules } from '@/components/business-rules'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown
  resetErrorBoundary: () => void
}) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred'
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 text-center">
      <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-6">{message}</p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  )
}

const DECISION_TO_STATUS: Record<DecisionAction, CandidateDTO['status']> = {
  SHORTLIST: 'SHORTLISTED',
  REJECT: 'REJECTED',
}

function LiveSessionContent() {
  const queryClient = useQueryClient()
  const { candidates, isLoading, error, createCandidate, submitDecision } = useCandidates()
  const [optimisticCandidates, addOptimistic] = useOptimisticCandidates(candidates)
  const { sheetState, openFromClick, openFromDrop, close } = useCandidateSheet()
  const sheetTriggerRef = useRef<HTMLElement | null>(null)

  const handleCardClick = (id: string) => {
    sheetTriggerRef.current = document.activeElement as HTMLElement
    openFromClick(id)
  }

  const handleCreateCandidate = (name: string) => {
    const tempCandidate: CandidateDTO = {
      id: `temp-${Date.now()}`,
      name,
      status: 'NEW',
      reason: null,
      decisionDate: null,
    }
    startTransition(async () => {
      addOptimistic({ type: 'add', candidate: tempCandidate })
      await createCandidate.mutateAsync(name).catch(() => {})
      await queryClient.invalidateQueries({ queryKey: ['candidates'] })
    })
  }

  const handleDrop = (candidateId: string, decision: DecisionAction) => {
    sheetTriggerRef.current = document.activeElement as HTMLElement
    openFromDrop(candidateId, decision)
  }

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      close()
      requestAnimationFrame(() => {
        sheetTriggerRef.current?.focus()
        sheetTriggerRef.current = null
      })
    }
  }

  const handleSubmitDecision = (decision: DecisionAction, reason: string) => {
    const candidateId = sheetState.candidateId
    if (!candidateId) return
    close()
    startTransition(async () => {
      addOptimistic({
        type: 'update',
        id: candidateId,
        status: DECISION_TO_STATUS[decision],
        reason,
        decisionDate: new Date().toISOString(),
      })
      await submitDecision.mutateAsync({ candidateId, decision, reason }).catch(() => {})
      await queryClient.invalidateQueries({ queryKey: ['candidates'] })
    })
    requestAnimationFrame(() => {
      sheetTriggerRef.current?.focus()
      sheetTriggerRef.current = null
    })
  }

  const selectedCandidate =
    optimisticCandidates.find((c) => c.id === sheetState.candidateId) ?? null

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 pb-36 font-sans">
      <h1 className="text-2xl font-bold mb-6">Candidate Management</h1>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <strong>Error:</strong> {error.message}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Create Candidate</h2>
        <CreateCandidateForm onSubmit={handleCreateCandidate} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Candidate Board</h2>
        <CandidateBoard
          candidates={optimisticCandidates}
          onCardClick={handleCardClick}
          onDrop={handleDrop}
          loading={isLoading}
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
  const queryClient = useQueryClient()

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => queryClient.invalidateQueries()}
    >
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
    </ErrorBoundary>
  )
}
