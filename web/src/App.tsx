import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { AppSidebar } from '@/components/AppSidebar'
import { AuthPanel } from '@/components/AuthPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { safeAuthError } from '@/lib/authErrors'
import { supabase } from '@/lib/supabase'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasSignedOut, setHasSignedOut] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!isMounted) return
      if (sessionError) setError(safeAuthError(sessionError))
      setSession(data.session)
      setIsLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession)
      setHasSignedOut(event === 'SIGNED_OUT')
      setError(null)
      setIsLoading(false)
      if (event === 'SIGNED_OUT') navigate('/login', { replace: true })
    })
    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [navigate])

  async function signOut() {
    setError(null)
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      setError(safeAuthError(signOutError))
      return
    }
    setHasSignedOut(true)
    setSession(null)
    navigate('/login', { replace: true })
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginRoute session={session} isLoading={isLoading} hasSignedOut={hasSignedOut} />} />
      <Route element={<ProtectedLayout session={session} isLoading={isLoading} error={error} onSignOut={signOut} />}>
        <Route index element={session ? <HomePage session={session} /> : null} />
        <Route path="profile" element={session ? <ProfilePage session={session} /> : null} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

type LoginRouteProps = {
  session: Session | null
  isLoading: boolean
  hasSignedOut: boolean
}

function LoginRoute({ session, isLoading, hasSignedOut }: LoginRouteProps) {
  if (isLoading) return <SessionLoading />
  if (session && !hasSignedOut) return <Navigate to="/" replace />

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <section className="w-full max-w-md space-y-4">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Gift Management</p>
          <h1 className="text-3xl font-bold">Email password auth</h1>
        </div>
        <AuthPanel />
      </section>
    </main>
  )
}

type ProtectedLayoutProps = {
  session: Session | null
  isLoading: boolean
  error: string | null
  onSignOut: () => void
}

function ProtectedLayout({ session, isLoading, error, onSignOut }: ProtectedLayoutProps) {
  if (isLoading) return <SessionLoading />
  if (!session) return <Navigate to="/login" replace />

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex items-center justify-between border-b bg-background px-6 py-4">
          <div>
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="font-medium">{session.user.email ?? 'Authenticated user'}</p>
          </div>
          <Button type="button" onClick={onSignOut}>Sign out</Button>
        </header>
        <section className="flex-1 p-6">
          {error && <p role="alert" className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <Outlet />
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}

function SessionLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-sm text-muted-foreground">Restoring your session...</CardContent>
      </Card>
    </main>
  )
}
