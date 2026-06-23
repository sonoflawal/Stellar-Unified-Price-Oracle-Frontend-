import { describe, it, expect, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Layout } from './Layout'

afterEach(cleanup)

describe('Layout', () => {
  it('renders children', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </MemoryRouter>,
    )
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders the nav with Stellar Oracle brand', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div />
        </Layout>
      </MemoryRouter>,
    )
    expect(screen.getByText('Stellar Oracle')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div />
        </Layout>
      </MemoryRouter>,
    )
    expect(screen.getByText((content) => content.includes('Developer Portal'))).toBeInTheDocument()
  })

  it('renders Dashboard nav link', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div />
        </Layout>
      </MemoryRouter>,
    )
    const links = screen.getAllByText('Dashboard')
    expect(links.length).toBeGreaterThanOrEqual(1)
  })

  it('has a mobile menu button with aria-label', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div />
        </Layout>
      </MemoryRouter>,
    )
    const buttons = screen.getAllByLabelText('Toggle menu')
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })
})

describe('snapshots', () => {
  it('default', () => {
    const { container } = render(
      <MemoryRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>,
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
