import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ConnectionBadge } from './ConnectionBadge'

describe('ConnectionBadge', () => {
  it('renders connected status', () => {
    render(<ConnectionBadge status="connected" />)
    expect(screen.getByText('Live')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'WebSocket Live')
  })

  it('renders connecting status', () => {
    render(<ConnectionBadge status="connecting" />)
    expect(screen.getByText('Connecting')).toBeInTheDocument()
  })

  it('renders reconnecting status', () => {
    render(<ConnectionBadge status="reconnecting" />)
    expect(screen.getByText('Reconnecting')).toBeInTheDocument()
  })

  it('renders disconnected status', () => {
    render(<ConnectionBadge status="disconnected" />)
    expect(screen.getByText('Offline')).toBeInTheDocument()
  })
})

describe('snapshots', () => {
  it('connected', () => {
    const { container } = render(<ConnectionBadge status="connected" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('connecting', () => {
    const { container } = render(<ConnectionBadge status="connecting" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('reconnecting', () => {
    const { container } = render(<ConnectionBadge status="reconnecting" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('disconnected', () => {
    const { container } = render(<ConnectionBadge status="disconnected" />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
