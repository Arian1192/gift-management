import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthPanel } from './AuthPanel'
import { supabase } from '@/lib/supabase'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn()
    }
  }
}))

describe('AuthPanel', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows validation errors without calling Supabase', async () => {
    render(<AuthPanel />)
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Enter an email address.')
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled()
  })

  it('signs in and switches to sign-up with email and password actions', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ data: { user: null, session: null }, error: null })
    vi.mocked(supabase.auth.signUp).mockResolvedValue({ data: { user: null, session: null }, error: null })
    render(<AuthPanel />)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'person@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    await waitFor(() => expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'person@example.com', password: 'secret1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Need an account? Create one' }))
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
    await waitFor(() => expect(supabase.auth.signUp).toHaveBeenCalledWith({ email: 'person@example.com', password: 'secret1' }))
  })
})
