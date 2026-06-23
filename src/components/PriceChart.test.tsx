import { describe, it, expect, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { PriceChart } from './PriceChart'

afterEach(cleanup)

describe('PriceChart', () => {
  it('renders loading state', () => {
    render(<PriceChart data={[]} pair="BTC/USD" loading />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading chart')
  })

  it('renders empty state', () => {
    render(<PriceChart data={[]} pair="BTC/USD" loading={false} />)
    expect(screen.getByText('No historical data available')).toBeInTheDocument()
  })

  it('renders chart with data', () => {
    const data = [
      { price: 50000, timestamp: Date.now() - 60000, confidence: 0.99, sources: ['chainlink'] },
      { price: 50100, timestamp: Date.now(), confidence: 0.99, sources: ['chainlink'] },
    ]
    render(<PriceChart data={data} pair="BTC/USD" loading={false} />)
    expect(screen.getByText('BTC/USD Price History')).toBeInTheDocument()
  })
})

describe('snapshots', () => {
  const fixedData = [
    { price: 50000, timestamp: 1700000000000, confidence: 0.99, sources: ['chainlink'] },
    { price: 50100, timestamp: 1700000060000, confidence: 0.99, sources: ['chainlink'] },
  ]

  it('loading', () => {
    const { container } = render(<PriceChart data={[]} pair="BTC/USD" loading />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('empty', () => {
    const { container } = render(<PriceChart data={[]} pair="BTC/USD" loading={false} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('with data', () => {
    const { container } = render(<PriceChart data={fixedData} pair="BTC/USD" loading={false} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
