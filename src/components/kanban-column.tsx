import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import type { CandidateStatus } from '@/domain/types/candidate'

interface KanbanColumnProps {
  status: CandidateStatus
  count: number
  children: React.ReactNode
}

const columnColors: Record<CandidateStatus, string> = {
  NEW: 'border-blue-200',
  SHORTLISTED: 'border-green-200',
  REJECTED: 'border-destructive/30',
}

const headerColors: Record<CandidateStatus, string> = {
  NEW: 'bg-blue-50 text-blue-700',
  SHORTLISTED: 'bg-green-50 text-green-700',
  REJECTED: 'bg-red-50 text-red-700',
}

export function KanbanColumn({ status, count, children }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-lg border-2 bg-muted/30 p-3 min-h-[200px] transition-colors',
        columnColors[status],
        isOver && 'border-primary bg-primary/5'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between rounded-md px-3 py-2 mb-3 text-sm font-semibold',
          headerColors[status]
        )}
      >
        <span>{status}</span>
        <span className="rounded-full bg-white/60 px-2 py-0.5 text-xs font-medium">{count}</span>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {count === 0 ? (
          <p className="text-muted-foreground text-xs text-center py-6">No candidates</p>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
