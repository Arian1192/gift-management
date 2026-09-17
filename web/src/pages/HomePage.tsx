import type { Session } from '@supabase/supabase-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type HomePageProps = {
  session: Session
}

export function HomePage({ session }: HomePageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Home</CardTitle>
        <CardDescription>Start managing gifts from this workspace.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Signed in as {session.user.email ?? 'an authenticated user'}.
      </CardContent>
    </Card>
  )
}
