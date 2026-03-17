import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import type { CandidateDTO } from '@/domain/types/candidate'
import { CandidateCard } from './candidate-card'

interface CandidateBoardProps {
  candidates: CandidateDTO[]
  selectedId: string | null
  onSelect: (id: string) => void
  loading: boolean
}

function SkeletonCard() {
  return (
    <Card size="sm">
      <CardContent className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </CardContent>
    </Card>
  )
}

export function CandidateBoard({ candidates, selectedId, onSelect, loading }: CandidateBoardProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No candidates yet. Create one to get started.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          isSelected={candidate.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
