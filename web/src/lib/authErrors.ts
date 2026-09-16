const FALLBACK_ERROR = 'We could not complete that auth action. Check your details and try again.'

export function safeAuthError(error: unknown): string {
  if (!error) return FALLBACK_ERROR
  const message = error instanceof Error ? error.message : String(error)
  if (!message || /token|jwt|secret|stack|trace|service_role/i.test(message)) return FALLBACK_ERROR
  return message.length > 180 ? `${message.slice(0, 177)}...` : message
}

export function validateCredentials(email: string, password: string): string | null {
  if (!email.trim()) return 'Enter an email address.'
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address.'
  if (password.length < 6) return 'Use a password with at least 6 characters.'
  return null
}
