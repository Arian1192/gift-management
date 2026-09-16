import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { AuthPanel } from '@/components/AuthPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { safeAuthError } from '@/lib/authErrors'
import { supabase } from '@/lib/supabase'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!isMounted) return
      if (sessionError) setError(safeAuthError(sessionError))
      setSession(data.session)
      setIsLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setError(null)
      setIsLoading(false)
    })
    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    setError(null)
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) setError(safeAuthError(signOutError))
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <section className="w-full max-w-md space-y-4">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Gift Management</p>
          <h1 className="text-3xl font-bold">Email password auth</h1>
        </div>
        {isLoading ? (
          <Card><CardContent className="p-6 text-sm text-muted-foreground">Restoring your session...</CardContent></Card>
        ) : session ? (
          <Card>
            <CardHeader>
              <CardTitle>Signed in</CardTitle>
              <CardDescription>{session.user.email ?? 'Your session is active.'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
              <Button className="w-full" type="button" onClick={signOut}>Sign out</Button>
            </CardContent>
          </Card>
        ) : (
          <AuthPanel />
        )}
      </section>
    </main>
  )
}
