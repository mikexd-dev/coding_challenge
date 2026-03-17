import { useOptimistic } from 'react'
import type { CandidateDTO, CandidateStatus } from '@/domain/types/candidate'

type OptimisticAction =
  | { type: 'add'; candidate: CandidateDTO }
  | { type: 'update'; id: string; status: CandidateStatus; reason?: string; decisionDate?: string }

function candidatesReducer(state: CandidateDTO[], action: OptimisticAction): CandidateDTO[] {
  switch (action.type) {
    case 'add':
      return [...state, action.candidate]
    case 'update':
      return state.map((c) =>
        c.id === action.id
          ? {
              ...c,
              status: action.status,
              reason: action.reason ?? c.reason,
              decisionDate: action.decisionDate ?? c.decisionDate,
            }
          : c
      )
  }
}

export function useOptimisticCandidates(candidates: CandidateDTO[]) {
  return useOptimistic(candidates, candidatesReducer)
}
