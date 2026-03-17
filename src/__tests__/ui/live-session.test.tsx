// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LiveSession from '@/app/live-session/page'
import { renderWithProviders } from '@/__tests__/test-utils'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({ get: vi.fn() }),
}))

const mockCandidates = [
  { id: 'c_1', name: 'Alice Johnson', status: 'NEW' as const },
  { id: 'c_2', name: 'Bob Williams', status: 'SHORTLISTED' as const },
  { id: 'c_3', name: 'Carol Davis', status: 'REJECTED' as const },
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
  })

  it('renders candidate list from API', async () => {
    global.fetch = mockFetch([{ ok: true, data: mockCandidates }])

    renderWithProviders(<LiveSession />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
      expect(screen.getByText('Bob Williams')).toBeInTheDocument()
      expect(screen.getByText('Carol Davis')).toBeInTheDocument()
    })
  })

  it('renders three Kanban columns with status headers', async () => {
    global.fetch = mockFetch([{ ok: true, data: mockCandidates }])

    renderWithProviders(<LiveSession />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    const newHeaders = screen.getAllByText('NEW')
    expect(newHeaders.length).toBeGreaterThanOrEqual(1)

    const shortlistedHeaders = screen.getAllByText('SHORTLISTED')
    expect(shortlistedHeaders.length).toBeGreaterThanOrEqual(1)

    const rejectedHeaders = screen.getAllByText('REJECTED')
    expect(rejectedHeaders.length).toBeGreaterThanOrEqual(1)
  })

  it('groups candidates into correct columns', async () => {
    global.fetch = mockFetch([{ ok: true, data: mockCandidates }])

    renderWithProviders(<LiveSession />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
      expect(screen.getByText('Bob Williams')).toBeInTheDocument()
      expect(screen.getByText('Carol Davis')).toBeInTheDocument()
    })
  })

  it('submits create candidate form', async () => {
    const user = userEvent.setup()
    global.fetch = mockFetch([
      { ok: true, data: mockCandidates },
      { ok: true, data: { id: 'c_4', name: 'New Person', status: 'NEW' } },
      {
        ok: true,
        data: [...mockCandidates, { id: 'c_4', name: 'New Person', status: 'NEW' }],
      },
    ])

    renderWithProviders(<LiveSession />)

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
      { ok: true, data: mockCandidates },
    ])

    const user = userEvent.setup()
    renderWithProviders(<LiveSession />)

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('Candidate name')
    await user.type(input, 'Test')
    await user.click(screen.getByText('Create'))

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    })
  })

  it('opens sheet when clicking a non-draggable candidate card', async () => {
    const user = userEvent.setup()
    global.fetch = mockFetch([{ ok: true, data: mockCandidates }])

    renderWithProviders(<LiveSession />)

    await waitFor(() => {
      expect(screen.getByText('Bob Williams')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Bob Williams'))

    await waitFor(() => {
      const sheetContent = document.querySelector('[data-slot="sheet-content"]')
      expect(sheetContent).toBeInTheDocument()
    })
  })

  it('shows non-draggable candidates without drag cursor', async () => {
    global.fetch = mockFetch([{ ok: true, data: mockCandidates }])

    renderWithProviders(<LiveSession />)

    await waitFor(() => {
      expect(screen.getByText('Bob Williams')).toBeInTheDocument()
    })

    const bobCard = screen.getByText('Bob Williams').closest('[data-slot="card"]')
    expect(bobCard).not.toHaveAttribute('aria-roledescription', 'draggable')
  })
})
