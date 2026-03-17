import { useState, useCallback } from 'react'

export function useFieldValidation(validator: (value: unknown) => boolean, errorMessage: string) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isValid = validator(value)

  const handleChange = useCallback(
    (v: string) => {
      setValue(v)
      setError(validator(v) ? null : errorMessage)
    },
    [validator, errorMessage]
  )

  const reset = useCallback(() => {
    setValue('')
    setError(null)
  }, [])

  return { value, error, isValid, handleChange, reset }
}
