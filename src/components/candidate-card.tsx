import { useDraggable } from '@dnd-kit/core'
import { GripVertical } from 'lucide-react'
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
        'transition-all duration-150',
        isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
        isDragging
          ? 'opacity-40'
          : 'hover:shadow-md hover:ring-1 hover:ring-primary/30 hover:-translate-y-0.5'
      )}
      onClick={() => onClick(candidate.id)}
      size="sm"
      {...(isDraggable
        ? { ...listeners, ...attributes, 'aria-roledescription': 'draggable candidate card' }
        : {})}
    >
      <CardContent className="flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          {isDraggable && (
            <GripVertical className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
          )}
          <span className="font-medium text-sm">{candidate.name}</span>
        </span>
        <StatusBadge status={candidate.status} />
      </CardContent>
    </Card>
  )
}
