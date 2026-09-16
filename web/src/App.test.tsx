import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { supabase } from '@/lib/supabase'

const subscription = { unsubscribe: vi.fn() }

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription } })),
      signOut: vi.fn()
    }
  }
}))

describe('App auth state', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({ data: { subscription } } as never)
  })

  it('restores an existing session and signs out safely', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { email: 'person@example.com' } } },
      error: null
    } as never)
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as never)
    render(<App />)
    expect(await screen.findByText('person@example.com')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))
    await waitFor(() => expect(supabase.auth.signOut).toHaveBeenCalled())
  })

  it('shows authentication entry points when no session exists', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: null }, error: null } as never)
    render(<App />)
    expect(await screen.findByRole('button', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Need an account? Create one' })).toBeInTheDocument()
  })
})
