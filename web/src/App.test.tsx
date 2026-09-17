import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { supabase } from '@/lib/supabase'

const subscription = { unsubscribe: vi.fn() }
const activeSession = { user: { email: 'person@example.com' } }

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription } })),
      signOut: vi.fn()
    }
  }
}))

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>
  )
}

describe('App navigation and auth routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({ data: { subscription } } as never)
  })

  it('shows session restoration loading before rendering protected content', async () => {
    let resolveSession: (value: unknown) => void = () => undefined
    vi.mocked(supabase.auth.getSession).mockReturnValue(new Promise((resolve) => { resolveSession = resolve }) as never)
    renderApp('/profile')
    expect(screen.getByText('Restoring your session...')).toBeInTheDocument()
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
    resolveSession({ data: { session: activeSession }, error: null })
    expect(await screen.findByRole('heading', { name: 'Profile' })).toBeInTheDocument()
  })

  it('redirects unauthenticated visitors from protected routes to login', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: null }, error: null } as never)
    renderApp('/profile')
    expect(await screen.findByRole('button', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Need an account? Create one' })).toBeInTheDocument()
  })

  it('renders authenticated sidebar navigation with active route state', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: activeSession }, error: null } as never)
    renderApp('/profile')
    expect(await screen.findByRole('heading', { name: 'Profile' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('aria-current', 'page')
  })

  it('shows an authenticated 404 fallback for unknown routes', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: activeSession }, error: null } as never)
    renderApp('/unknown-route')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByText('Choose Home or Profile from the sidebar to continue.')).toBeInTheDocument()
  })

  it('redirects to login after sign-out succeeds', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: activeSession }, error: null } as never)
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as never)
    const user = userEvent.setup()
    renderApp('/')
    expect(await screen.findByText('person@example.com')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /person@example\.com/i }))
    await user.click(await screen.findByRole('menuitem', { name: 'Log out' }))
    await waitFor(() => expect(supabase.auth.signOut).toHaveBeenCalled())
    expect(await screen.findByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })
})
