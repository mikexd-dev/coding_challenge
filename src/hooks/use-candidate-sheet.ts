import { useState, useCallback } from 'react'
import type { DecisionAction } from '@/domain/types/candidate'

export interface SheetState {
  open: boolean
  candidateId: string | null
  prefilledDecision: DecisionAction | null
}

const CLOSED: SheetState = { open: false, candidateId: null, prefilledDecision: null }

export function useCandidateSheet() {
  const [sheetState, setSheetState] = useState<SheetState>(CLOSED)

  const openFromClick = useCallback((id: string) => {
    setSheetState({ open: true, candidateId: id, prefilledDecision: null })
  }, [])

  const openFromDrop = useCallback((id: string, decision: DecisionAction) => {
    setSheetState({ open: true, candidateId: id, prefilledDecision: decision })
  }, [])

  const close = useCallback(() => {
    setSheetState(CLOSED)
  }, [])

  return { sheetState, openFromClick, openFromDrop, close }
}
