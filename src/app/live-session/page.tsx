'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CandidateDTO, CandidateStatus, DecisionAction } from '@/domain/types/candidate'
import { getAllCandidates, createCandidate, submitDecision } from '@/ui/api/candidates'
import { isValidName, isValidReason, canTransition, MIN_REASON_LENGTH } from '@/domain/validation'

function LiveSessionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get('candidateId')

  const [candidates, setCandidates] = useState<CandidateDTO[]>([])
  const [newName, setNewName] = useState('')
  const [decision, updateDecision] = useState<DecisionAction>('SHORTLIST')
  const [rsn, setRsn] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const [reasonError, setReasonError] = useState<string | null>(null)

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      const data = await getAllCandidates()
      setCandidates(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    }
  }

  const handleSelectCandidate = (id: string) => {
    router.push(`?candidateId=${id}`)
  }

  const handleNameChange = (value: string) => {
    setNewName(value)
    if (!isValidName(value)) {
      setNameError('Name cannot be empty or whitespace only')
    } else {
      setNameError(null)
    }
  }

  const handleReasonChange = (value: string) => {
    setRsn(value)
    if (!isValidReason(value)) {
      setReasonError(`Reason must be at least ${MIN_REASON_LENGTH} characters`)
    } else {
      setReasonError(null)
    }
  }

  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isValidName(newName)) {
      setNameError('Name cannot be empty or whitespace only')
      return
    }

    try {
      await createCandidate(newName)
      setNewName('')
      setNameError(null)
      fetchCandidates()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    }
  }

  const handleSubmitDecision = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedId) return

    if (!isValidReason(rsn)) {
      setReasonError(`Reason must be at least ${MIN_REASON_LENGTH} characters`)
      return
    }

    try {
      await submitDecision(selectedId, decision, rsn)
      setRsn('')
      setReasonError(null)
      router.push('/live-session')
      fetchCandidates()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    }
  }

  const selectedCandidate = candidates.find((c) => c.id === selectedId)

  const getStatusColor = (status: CandidateStatus) => {
    if (status === 'NEW') {
      return { bg: '#e3f2fd', color: '#1976d2' }
    }
    if (status === 'SHORTLISTED') {
      return { bg: '#e8f5e9', color: '#388e3c' }
    }
    if (status === 'REJECTED') {
      return { bg: '#ffebee', color: '#d32f2f' }
    }
    return { bg: '#e3f2fd', color: '#1976d2' }
  }

  const isNameValid = isValidName(newName)
  const isReasonValid = isValidReason(rsn)

  return (
    <div
      style={{ maxWidth: '1200px', margin: '50px auto', padding: '20px', fontFamily: 'system-ui' }}
    >
      <h1>Candidate Management</h1>

      {error && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#ffebee',
            color: '#d32f2f',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #ffcdd2',
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div>
          <h2>Candidate Board</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px',
            }}
          >
            {candidates.map((candidate) => {
              const colors = getStatusColor(candidate.status)
              const isSelected = candidate.id === selectedId
              return (
                <div
                  key={candidate.id}
                  onClick={() => handleSelectCandidate(candidate.id)}
                  style={{
                    padding: '15px',
                    border: isSelected ? '2px solid #1976d2' : '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#f5f5f5' : 'white',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{candidate.name}</div>
                  <div
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: colors.bg,
                      color: colors.color,
                      fontSize: '12px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    {candidate.status}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h2>Create Candidate</h2>
          <form onSubmit={handleCreateCandidate} style={{ marginBottom: '30px' }}>
            <input
              type="text"
              value={newName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Candidate name"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '4px',
                border: nameError ? '1px solid #d32f2f' : '1px solid #ccc',
                marginBottom: nameError ? '4px' : '10px',
              }}
            />
            {nameError && (
              <div style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '10px' }}>
                {nameError}
              </div>
            )}
            <button
              type="submit"
              disabled={!isNameValid}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                fontWeight: '500',
                backgroundColor: isNameValid ? '#1976d2' : '#90caf9',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isNameValid ? 'pointer' : 'not-allowed',
              }}
            >
              Create
            </button>
          </form>

          {selectedCandidate && (
            <>
              <h2>Update Status</h2>
              <div
                style={{
                  padding: '15px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  marginBottom: '15px',
                }}
              >
                <div>
                  <strong>Name:</strong> {selectedCandidate.name}
                </div>
                <div>
                  <strong>Status:</strong> {selectedCandidate.status}
                </div>
              </div>

              {canTransition(selectedCandidate.status) ? (
                <form onSubmit={handleSubmitDecision}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Decision
                    </label>
                    <select
                      value={decision}
                      onChange={(e) => updateDecision(e.target.value as DecisionAction)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                      }}
                    >
                      <option value="SHORTLIST">Shortlist</option>
                      <option value="REJECT">Reject</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Reason (min {MIN_REASON_LENGTH} characters)
                    </label>
                    <textarea
                      value={rsn}
                      onChange={(e) => handleReasonChange(e.target.value)}
                      rows={4}
                      placeholder="Enter your reason..."
                      style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: reasonError ? '1px solid #d32f2f' : '1px solid #ccc',
                        fontFamily: 'system-ui',
                        marginBottom: reasonError ? '4px' : '0',
                      }}
                    />
                    {reasonError && (
                      <div style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '4px' }}>
                        {reasonError}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!isReasonValid}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '16px',
                      fontWeight: '500',
                      backgroundColor: isReasonValid ? '#1976d2' : '#90caf9',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isReasonValid ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Submit Decision
                  </button>
                </form>
              ) : (
                <div
                  style={{
                    padding: '15px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    color: '#666',
                    textAlign: 'center',
                  }}
                >
                  This candidate has already been{' '}
                  {selectedCandidate.status === 'SHORTLISTED' ? 'shortlisted' : 'rejected'}.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        <h3>Business Rules:</h3>
        <ul>
          <li>
            {'NEW'} candidates can be {'SHORTLISTED'} or {'REJECTED'}
          </li>
          <li>
            {'SHORTLISTED'} candidates cannot be {'REJECTED'}
          </li>
          <li>
            {'REJECTED'} candidates cannot be {'SHORTLISTED'}
          </li>
          <li>Reason must be at least {MIN_REASON_LENGTH} characters</li>
        </ul>
      </div>
    </div>
  )
}

export default function LiveSession() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LiveSessionContent />
    </Suspense>
  )
}
