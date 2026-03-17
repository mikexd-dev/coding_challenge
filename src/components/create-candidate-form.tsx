import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { isValidName } from '@/domain/validation'
import { useFieldValidation } from '@/hooks/use-field-validation'

interface CreateCandidateFormProps {
  onSubmit: (name: string) => void
}

export function CreateCandidateForm({ onSubmit }: CreateCandidateFormProps) {
  const {
    value: name,
    error,
    isValid,
    handleChange,
    reset,
  } = useFieldValidation(isValidName, 'Name cannot be empty or whitespace only')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    onSubmit(name)
    reset()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="candidate-name">Candidate Name</Label>
        <Input
          id="candidate-name"
          type="text"
          value={name}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Candidate name"
          required
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'name-error' : undefined}
        />
        {error && (
          <p id="name-error" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
      <Button type="submit" disabled={!isValid} className="w-full">
        Create
      </Button>
    </form>
  )
}
