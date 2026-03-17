import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getAllCandidates,
  createCandidate as createCandidateApi,
  submitDecision as submitDecisionApi,
} from '@/lib/api/candidates'
import type { DecisionAction } from '@/domain/types/candidate'

const CANDIDATES_KEY = ['candidates'] as const

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
      toast.success('Candidate created successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message)
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

    onSuccess: () => {
      toast.success('Decision submitted successfully')
    },

    onError: (err: Error) => {
      toast.error(err.message)
    },

    onSettled: () => {
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
