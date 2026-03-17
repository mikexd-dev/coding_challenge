import { useDraggable } from '@dnd-kit/core'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { CandidateDTO } from '@/domain/types/candidate'
import { canTransition } from '@/domain/validation'
import { StatusBadge } from './status-badge'

interface CandidateCardProps {
  candidate: CandidateDTO
  onClick: (id: string) => void
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  const isDraggable = canTransition(candidate.status)
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: candidate.id,
    data: { candidate },
    disabled: !isDraggable,
  })

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        'transition-colors',
        isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
        isDragging && 'opacity-40'
      )}
      onClick={() => onClick(candidate.id)}
      size="sm"
      {...(isDraggable ? { ...listeners, ...attributes } : {})}
    >
      <CardContent className="flex items-center justify-between">
        <span className="font-medium text-sm">{candidate.name}</span>
        <StatusBadge status={candidate.status} />
      </CardContent>
    </Card>
  )
}
