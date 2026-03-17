import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import type { CandidateDTO, DecisionAction } from '@/domain/types/candidate'
import { isValidReason, canTransition, MIN_REASON_LENGTH } from '@/domain/validation'
import { StatusBadge } from './status-badge'

interface UpdateStatusFormProps {
  candidate: CandidateDTO
  onSubmit: (decision: DecisionAction, reason: string) => void
}

export function UpdateStatusForm({ candidate, onSubmit }: UpdateStatusFormProps) {
  const [decision, setDecision] = useState<DecisionAction>('SHORTLIST')
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState<string | null>(null)

  const isValid = isValidReason(reason)

  const handleReasonChange = (value: string) => {
    setReason(value)
    if (!isValidReason(value)) {
      setReasonError(`Reason must be at least ${MIN_REASON_LENGTH} characters`)
    } else {
      setReasonError(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidReason(reason)) {
      setReasonError(`Reason must be at least ${MIN_REASON_LENGTH} characters`)
      return
    }
    onSubmit(decision, reason)
    setReason('')
    setReasonError(null)
  }

  return (
    <div className="space-y-4">
      <Card size="sm">
        <CardContent className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="font-medium">{candidate.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <StatusBadge status={candidate.status} />
          </div>
        </CardContent>
      </Card>

      {canTransition(candidate.status) ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="decision">Decision</Label>
            <Select value={decision} onValueChange={(v) => setDecision(v as DecisionAction)}>
              <SelectTrigger id="decision" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SHORTLIST">Shortlist</SelectItem>
                <SelectItem value="REJECT">Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (min {MIN_REASON_LENGTH} characters)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => handleReasonChange(e.target.value)}
              rows={4}
              placeholder="Enter your reason..."
              aria-invalid={reasonError ? true : undefined}
              aria-describedby={reasonError ? 'reason-error' : undefined}
            />
            {reasonError && (
              <p id="reason-error" className="text-sm text-destructive">
                {reasonError}
              </p>
            )}
          </div>

          <Button type="submit" disabled={!isValid} className="w-full">
            Submit Decision
          </Button>
        </form>
      ) : (
        <Card size="sm">
          <CardContent className="text-center text-muted-foreground">
            This candidate has already been{' '}
            {candidate.status === 'SHORTLISTED' ? 'shortlisted' : 'rejected'}.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
