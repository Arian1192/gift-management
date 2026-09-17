import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function NotFoundPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page not found</CardTitle>
        <CardDescription>The route you opened does not exist.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Choose Home or Profile from the sidebar to continue.
      </CardContent>
    </Card>
  )
}
