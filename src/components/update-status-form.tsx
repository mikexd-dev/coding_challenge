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
import { useFieldValidation } from '@/hooks/use-field-validation'
import { StatusBadge } from './status-badge'

interface UpdateStatusFormProps {
  candidate: CandidateDTO
  onSubmit: (decision: DecisionAction, reason: string) => void
  defaultDecision?: DecisionAction
}

export function UpdateStatusForm({ candidate, onSubmit, defaultDecision }: UpdateStatusFormProps) {
  const [decision, setDecision] = useState<DecisionAction>(defaultDecision ?? 'SHORTLIST')
  const {
    value: reason,
    error: reasonError,
    isValid,
    handleChange: handleReasonChange,
    reset: resetReason,
  } = useFieldValidation(isValidReason, `Reason must be at least ${MIN_REASON_LENGTH} characters`)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSubmit(decision, reason)
    resetReason()
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
            <Select
              value={decision}
              onValueChange={(v) => setDecision(v as DecisionAction)}
              required
            >
              <SelectTrigger id="decision" className="w-full" aria-required="true">
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
              required
              aria-required="true"
              minLength={MIN_REASON_LENGTH}
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
