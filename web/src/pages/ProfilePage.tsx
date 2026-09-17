import type { Session } from '@supabase/supabase-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type ProfilePageProps = {
  session: Session
}

export function ProfilePage({ session }: ProfilePageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your profile details will be available in a later slice.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Account email: {session.user.email ?? 'Not available'}.
      </CardContent>
    </Card>
  )
}
