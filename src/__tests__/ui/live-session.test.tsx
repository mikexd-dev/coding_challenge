// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LiveSession from '@/app/live-session/page'

// Mock next/navigation
const mockPush = vi.fn()
const mockGet = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: mockGet }),
}))

const mockCandidates = [
  { id: 'c_1', name: 'Alice Johnson', status: 'NEW' as const },
  { id: 'c_2', name: 'Bob Williams', status: 'SHORTLISTED' as const },
]

function mockFetch(responses: Array<{ ok: boolean; data: unknown }>) {
  let callIndex = 0
  return vi.fn(() => {
    const response = responses[callIndex] ?? responses[responses.length - 1]
    callIndex++
    return Promise.resolve({
      ok: response?.ok ?? true,
      json: () => Promise.resolve(response?.data),
    })
  }) as unknown as typeof global.fetch
}

describe('LiveSession Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGet.mockReturnValue(null)
  })

  it('renders candidate list from API', async () => {
    global.fetch = mockFetch([{ ok: true, data: mockCandidates }])

    render(<LiveSession />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
      expect(screen.getByText('Bob Williams')).toBeInTheDocument()
    })
  })

  it('renders candidate statuses', async () => {
    global.fetch = mockFetch([{ ok: true, data: mockCandidates }])

    render(<LiveSession />)

    await waitFor(() => {
      expect(screen.getByText('NEW')).toBeInTheDocument()
      expect(screen.getByText('SHORTLISTED')).toBeInTheDocument()
    })
  })

  it('submits create candidate form', async () => {
    const user = userEvent.setup()
    global.fetch = mockFetch([
      { ok: true, data: mockCandidates },
      { ok: true, data: { id: 'c_3', name: 'New Person', status: 'NEW' } },
      { ok: true, data: [...mockCandidates, { id: 'c_3', name: 'New Person', status: 'NEW' }] },
    ])

    render(<LiveSession />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('Candidate name')
    await user.type(input, 'New Person')
    await user.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3)
    })
  })

  it('displays error message on API failure', async () => {
    global.fetch = mockFetch([
      { ok: true, data: mockCandidates },
      { ok: false, data: { error: 'Something went wrong' } },
    ])

    const user = userEvent.setup()
    render(<LiveSession />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('Candidate name')
    await user.type(input, 'Test')
    await user.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
    })
  })
})
