## Why

The web app currently has authentication but no internal navigation structure. Adding a sidebar with protected routes gives users a clear way to move between authenticated sections and establishes the routing foundation for future admin features.

## What Changes

- Add a responsive sidebar using the shadcn/ui base sidebar component.
- Add protected routes for authenticated sections: Home (`/`) and Profile (`/profile`).
- Redirect unauthenticated visitors from any protected route to the login screen.
- Redirect to the login screen after sign-out.
- Add a 404 fallback for unknown routes inside the authenticated area.
- Handle loading state during session restoration so the app does not flash protected content before knowing whether the user is signed in.
- Keep the admin section out of this slice.

### Non-goals

- No admin section or admin-only routes.
- No role-based access control.
- No deep profile editing forms.
- No mobile-specific navigation beyond the responsive behavior built into the shadcn sidebar.
- No breadcrumbs, search, or notifications.

## Capabilities

### New Capabilities

- `app-navigation`: Sidebar navigation and protected route behavior for authenticated users.

### Modified Capabilities

- None. Sign-out redirect behavior is treated as an integration concern of the new `app-navigation` capability.

## Impact

- Affected areas: `web/src/` routes, layout components, and auth state integration.
- Dependencies: may add shadcn sidebar component and React Router if not already present.
- Supabase impact: uses existing auth session; no schema changes.
