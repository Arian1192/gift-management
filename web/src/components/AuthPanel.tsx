import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { safeAuthError, validateCredentials } from '@/lib/authErrors'
import { supabase } from '@/lib/supabase'

type AuthMode = 'sign-in' | 'sign-up'

type AuthPanelProps = {
  onAuthChange?: (message: string) => void
}

export function AuthPanel({ onAuthChange }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submitAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setNotice(null)
    const validationError = validateCredentials(email, password)
    if (validationError) {
      setError(validationError)
      return
    }
    setIsSubmitting(true)
    const result = mode === 'sign-up'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    setIsSubmitting(false)
    if (result.error) {
      setError(safeAuthError(result.error))
      return
    }
    const message = mode === 'sign-up'
      ? 'Account request sent. Check the current auth state below.'
      : 'Signed in successfully.'
    setNotice(message)
    onAuthChange?.(message)
  }

  const alternateMode = mode === 'sign-in' ? 'sign-up' : 'sign-in'

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'sign-in' ? 'Sign in' : 'Create account'}</CardTitle>
        <CardDescription>Use email and password authentication for Gift Management.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submitAuth}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          {notice && <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{notice}</p>}
          <Button className="w-full" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Working...' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</Button>
        </form>
        <Button className="mt-4 w-full bg-muted text-foreground hover:bg-muted/80" type="button" onClick={() => { setMode(alternateMode); setError(null); setNotice(null) }}>
          {mode === 'sign-in' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
        </Button>
      </CardContent>
    </Card>
  )
}
