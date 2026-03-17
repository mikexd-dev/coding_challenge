import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { CandidateDTO } from '@/domain/types/candidate'
import { StatusBadge } from './status-badge'

interface CandidateCardProps {
  candidate: CandidateDTO
  isSelected: boolean
  onSelect: (id: string) => void
}

export function CandidateCard({ candidate, isSelected, onSelect }: CandidateCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-colors',
        isSelected ? 'border-primary bg-muted ring-2 ring-primary' : 'hover:bg-muted/50'
      )}
      onClick={() => onSelect(candidate.id)}
      size="sm"
    >
      <CardContent className="flex items-center justify-between">
        <span className="font-medium">{candidate.name}</span>
        <StatusBadge status={candidate.status} />
      </CardContent>
    </Card>
  )
}
