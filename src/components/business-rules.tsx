import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MIN_REASON_LENGTH } from '@/domain/validation'

export function BusinessRules() {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Business Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
          <li>NEW candidates can be SHORTLISTED or REJECTED</li>
          <li>SHORTLISTED candidates cannot be REJECTED</li>
          <li>REJECTED candidates cannot be SHORTLISTED</li>
          <li>Reason must be at least {MIN_REASON_LENGTH} characters</li>
        </ul>
      </CardContent>
    </Card>
  )
}
