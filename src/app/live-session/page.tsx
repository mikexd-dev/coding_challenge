'use client'

import { useRef, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useQueryClient } from '@tanstack/react-query'
import type { DecisionAction } from '@/domain/types/candidate'
import { useCandidates } from '@/hooks/use-candidates'
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

function LiveSessionContent() {
  const { candidates, isLoading, error, createCandidate, submitDecision } = useCandidates()
  const { sheetState, openFromClick, openFromDrop, close } = useCandidateSheet()
  const sheetTriggerRef = useRef<HTMLElement | null>(null)

  const handleCardClick = (id: string) => {
    sheetTriggerRef.current = document.activeElement as HTMLElement
    openFromClick(id)
  }

  const handleCreateCandidate = (name: string) => {
    createCandidate.mutate(name)
  }

  const handleDrop = (candidateId: string, decision: DecisionAction) => {
    sheetTriggerRef.current = document.activeElement as HTMLElement
    openFromDrop(candidateId, decision)
  }

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      close()
      // Restore focus to the element that triggered the sheet
      requestAnimationFrame(() => {
        sheetTriggerRef.current?.focus()
        sheetTriggerRef.current = null
      })
    }
  }

  const handleSubmitDecision = (decision: DecisionAction, reason: string) => {
    if (!sheetState.candidateId) return
    close()
    submitDecision.mutate({ candidateId: sheetState.candidateId, decision, reason })
    // Restore focus after submission
    requestAnimationFrame(() => {
      sheetTriggerRef.current?.focus()
      sheetTriggerRef.current = null
    })
  }

  const selectedCandidate = candidates.find((c) => c.id === sheetState.candidateId) ?? null
  const displayError =
    error?.message || createCandidate.error?.message || submitDecision.error?.message

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 pb-36 font-sans">
      <h1 className="text-2xl font-bold mb-6">Candidate Management</h1>

      {displayError && (
        <div
          role="alert"
          className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <strong>Error:</strong> {displayError}
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
