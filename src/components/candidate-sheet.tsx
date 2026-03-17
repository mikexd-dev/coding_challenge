import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import type { CandidateDTO, DecisionAction } from '@/domain/types/candidate'
import { UpdateStatusForm } from './update-status-form'

interface CandidateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: CandidateDTO | null
  prefilledDecision: DecisionAction | null
  onSubmit: (decision: DecisionAction, reason: string) => void
}

export function CandidateSheet({
  open,
  onOpenChange,
  candidate,
  prefilledDecision,
  onSubmit,
}: CandidateSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Candidate Details</SheetTitle>
          <SheetDescription>Review and update candidate status</SheetDescription>
        </SheetHeader>
        {candidate && (
          <div className="px-4 pb-4">
            <UpdateStatusForm
              candidate={candidate}
              onSubmit={onSubmit}
              defaultDecision={prefilledDecision ?? undefined}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
