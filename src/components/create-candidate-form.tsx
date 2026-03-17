import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { isValidName } from '@/domain/validation'

interface CreateCandidateFormProps {
  onSubmit: (name: string) => void
}

export function CreateCandidateForm({ onSubmit }: CreateCandidateFormProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isValid = isValidName(name)

  const handleNameChange = (value: string) => {
    setName(value)
    if (!isValidName(value)) {
      setError('Name cannot be empty or whitespace only')
    } else {
      setError(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidName(name)) {
      setError('Name cannot be empty or whitespace only')
      return
    }
    onSubmit(name)
    setName('')
    setError(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="candidate-name">Candidate Name</Label>
        <Input
          id="candidate-name"
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Candidate name"
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
