import { describe, expect, it } from 'vitest'
import { safeAuthError, validateCredentials } from './authErrors'

describe('auth validation helpers', () => {
  it('rejects missing, malformed, and short credentials before Supabase auth', () => {
    expect(validateCredentials('', '123456')).toBe('Enter an email address.')
    expect(validateCredentials('person', '123456')).toBe('Enter a valid email address.')
    expect(validateCredentials('person@example.com', '12345')).toBe('Use a password with at least 6 characters.')
  })

  it('keeps user-facing errors concise and hides sensitive technical strings', () => {
    expect(safeAuthError(new Error('Invalid login credentials'))).toBe('Invalid login credentials')
    expect(safeAuthError(new Error('jwt token stack trace leaked'))).toBe('We could not complete that auth action. Check your details and try again.')
    expect(safeAuthError(new Error('x'.repeat(200)))).toHaveLength(180)
  })
})
