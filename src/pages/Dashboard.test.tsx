import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Dashboard } from './Dashboard'

afterEach(cleanup)

vi.mock('../hooks/usePrices', () => ({
  usePrices: vi.fn(() => ({
    prices: [],
    loading: true,
    error: null,
    refetch: vi.fn(),
  })),
}))

vi.mock('../hooks/useWebSocket', () => ({
  useWebSocket: vi.fn(() => ({
    livePrices: new Map(),
    status: 'disconnected',
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
  })),
}))

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the title', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )
    expect(screen.getByText('Price Oracle Dashboard')).toBeInTheDocument()
  })

  it('shows loading skeletons when loading and no prices', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })

  it('shows error alert when there is an error', async () => {
    const usePrices = await import('../hooks/usePrices')
    vi.mocked(usePrices.usePrices).mockReturnValue({
      prices: [],
      loading: false,
      error: 'Something broke',
      refetch: vi.fn(),
    })
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )
    expect(screen.getByText('Something broke')).toBeInTheDocument()
  })

  it('shows empty state when no prices loaded', async () => {
    const usePrices = await import('../hooks/usePrices')
    vi.mocked(usePrices.usePrices).mockReturnValue({
      prices: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )
    const emptyTexts = screen.getAllByText('No price feeds available')
    expect(emptyTexts).toHaveLength(1)
  })

  it('renders price cards when data exists', async () => {
    const usePrices = await import('../hooks/usePrices')
    vi.mocked(usePrices.usePrices).mockReturnValue({
      prices: [
        { assetPair: 'BTC/USD', price: 50000, timestamp: Date.now(), confidence: 0.99, sources: ['chainlink'] },
        { assetPair: 'ETH/USD', price: 3000, timestamp: Date.now(), confidence: 0.95, sources: ['redstone'] },
      ],
      loading: false,
      error: null,
      refetch: vi.fn(),
    })
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )
    expect(screen.getAllByText('BTC/USD').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('ETH/USD').length).toBeGreaterThanOrEqual(1)
  })
})
