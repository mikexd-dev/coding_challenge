import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import type { CandidateDTO, CandidateStatus, DecisionAction } from '@/domain/types/candidate'
import { canTransition } from '@/domain/validation'
import { KanbanColumn } from './kanban-column'
import { CandidateCard } from './candidate-card'
import { StatusBadge } from './status-badge'

const STATUSES: CandidateStatus[] = ['NEW', 'SHORTLISTED', 'REJECTED']

const STATUS_TO_DECISION: Record<string, DecisionAction> = {
  SHORTLISTED: 'SHORTLIST',
  REJECTED: 'REJECT',
}

interface CandidateBoardProps {
  candidates: CandidateDTO[]
  onCardClick: (id: string) => void
  onDrop: (candidateId: string, decision: DecisionAction) => void
  loading: boolean
}

function SkeletonColumn() {
  return (
    <div className="flex flex-col rounded-lg border-2 border-muted bg-muted/30 p-3 min-h-[200px]">
      <Skeleton className="h-8 w-full rounded-md mb-3" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  )
}

export function CandidateBoard({ candidates, onCardClick, onDrop, loading }: CandidateBoardProps) {
  const [activeCandidate, setActiveCandidate] = useState<CandidateDTO | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  const keyboardSensor = useSensor(KeyboardSensor)
  const sensors = useSensors(pointerSensor, keyboardSensor)

  const grouped = STATUSES.reduce(
    (acc, status) => {
      acc[status] = candidates.filter((c) => c.status === status)
      return acc
    },
    {} as Record<CandidateStatus, CandidateDTO[]>
  )

  const handleDragStart = (event: DragStartEvent) => {
    const candidate = event.active.data.current?.candidate as CandidateDTO | undefined
    if (candidate) {
      setActiveCandidate(candidate)
      setAnnouncement(
        `Picked up ${candidate.name} from ${candidate.status}. Use arrow keys to move between columns.`
      )
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCandidate(null)
    const { active, over } = event
    if (!over) {
      const candidate = active.data.current?.candidate as CandidateDTO | undefined
      setAnnouncement(candidate ? `Dropped ${candidate.name}. No change.` : '')
      return
    }

    const candidate = active.data.current?.candidate as CandidateDTO | undefined
    if (!candidate) return

    const targetStatus = over.id as CandidateStatus
    if (targetStatus === candidate.status) {
      setAnnouncement(`Dropped ${candidate.name} back in ${candidate.status}.`)
      return
    }
    if (!canTransition(candidate.status)) return

    const decision = STATUS_TO_DECISION[targetStatus]
    if (decision) {
      setAnnouncement(`Moved ${candidate.name} to ${targetStatus}.`)
      onDrop(candidate.id, decision)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4" aria-busy="true" aria-label="Loading candidate board">
        {STATUSES.map((s) => (
          <SkeletonColumn key={s} />
        ))}
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4" aria-busy="false">
        {STATUSES.map((status) => (
          <KanbanColumn key={status} status={status} count={grouped[status].length}>
            {grouped[status].map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} onClick={onCardClick} />
            ))}
          </KanbanColumn>
        ))}
      </div>

      <DragOverlay>
        {activeCandidate ? (
          <Card className="shadow-lg ring-2 ring-primary" size="sm">
            <CardContent className="flex items-center justify-between">
              <span className="font-medium text-sm">{activeCandidate.name}</span>
              <StatusBadge status={activeCandidate.status} />
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </DndContext>
  )
}
