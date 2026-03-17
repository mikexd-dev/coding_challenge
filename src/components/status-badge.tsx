import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { CandidateStatus } from '@/domain/types/candidate'

const statusConfig: Record<
  CandidateStatus,
  { variant: 'default' | 'secondary' | 'destructive'; className: string }
> = {
  NEW: { variant: 'default', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  SHORTLISTED: { variant: 'secondary', className: 'bg-green-100 text-green-700 border-green-200' },
  REJECTED: { variant: 'destructive', className: '' },
}

export function StatusBadge({ status }: { status: CandidateStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant={config.variant} className={cn(config.className)}>
      {status}
    </Badge>
  )
}
