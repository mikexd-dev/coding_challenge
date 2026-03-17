import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllCandidates,
  createCandidate as createCandidateApi,
  submitDecision as submitDecisionApi,
} from '@/lib/api/candidates'
import type { CandidateDTO, DecisionAction } from '@/domain/types/candidate'

const CANDIDATES_KEY = ['candidates'] as const

const DECISION_TO_STATUS: Record<DecisionAction, CandidateDTO['status']> = {
  SHORTLIST: 'SHORTLISTED',
  REJECT: 'REJECTED',
}

export function useCandidates() {
  const queryClient = useQueryClient()

  const {
    data: candidates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: CANDIDATES_KEY,
    queryFn: getAllCandidates,
  })

  const createCandidate = useMutation({
    mutationFn: (name: string) => createCandidateApi(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANDIDATES_KEY })
    },
  })

  const submitDecision = useMutation({
    mutationFn: ({
      candidateId,
      decision,
      reason,
    }: {
      candidateId: string
      decision: DecisionAction
      reason: string
    }) => submitDecisionApi(candidateId, decision, reason),

    onMutate: async ({ candidateId, decision }) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: CANDIDATES_KEY })

      // Snapshot current cache
      const previousCandidates = queryClient.getQueryData<CandidateDTO[]>(CANDIDATES_KEY)

      // Optimistically update cache
      queryClient.setQueryData<CandidateDTO[]>(CANDIDATES_KEY, (old) =>
        old?.map((c) => (c.id === candidateId ? { ...c, status: DECISION_TO_STATUS[decision] } : c))
      )

      return { previousCandidates }
    },

    onError: (_err, _vars, context) => {
      // Rollback to snapshot
      if (context?.previousCandidates) {
        queryClient.setQueryData(CANDIDATES_KEY, context.previousCandidates)
      }
    },

    onSettled: () => {
      // Re-sync with server
      queryClient.invalidateQueries({ queryKey: CANDIDATES_KEY })
    },
  })

  return {
    candidates,
    isLoading,
    error: error as Error | null,
    createCandidate,
    submitDecision,
  }
}
