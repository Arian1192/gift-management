## Context

The web app currently has authentication screens and a basic layout. This slice adds the first internal navigation structure using the shadcn/ui base sidebar and React Router.

## Goals / Non-Goals

**Goals:**

- Add a reusable authenticated layout with sidebar.
- Add protected routes for Home and Profile.
- Redirect unauthenticated users to login.
- Redirect to login after sign-out.
- Handle loading and 404 states.

**Non-Goals:**

- Admin section or role-based access.
- Profile editing forms beyond a placeholder screen.
- Complex responsive behavior beyond what shadcn sidebar provides.
- Breadcrumbs, search, notifications.

## Decisions

### 1. Use shadcn/ui base sidebar component

Use the shadcn/ui `Sidebar` primitive as the foundation for the navigation shell.

- **Rationale:** The project already uses shadcn/ui and Tailwind, so the base sidebar fits the existing stack.
- **Alternative considered:** Build a custom sidebar. Rejected because it would duplicate effort and diverge from the chosen component system.

### 2. Use React Router for routing

Use React Router for route definitions, redirects, and 404 handling.

- **Rationale:** It is the standard routing solution for React SPAs and integrates cleanly with auth guards.
- **Alternative considered:** Use Vite-based file routing. Rejected to keep control over route guards and redirects.

### 3. Auth guard wraps protected layout

Create an auth-aware layout component that shows a loader while session state is unknown, redirects to login if unauthenticated, and renders the sidebar + outlet for authenticated users.

- **Rationale:** Centralizes route protection logic in one place.
- **Alternative considered:** Guard every route individually. Rejected because it duplicates logic.

### 4. Sidebar items are config-driven

Define sidebar navigation items in a small config array so future sections are easy to add.

- **Rationale:** Keeps the layout declarative and makes the admin section easier to add later.
- **Alternative considered:** Hard-code items in the component. Rejected because it complicates future additions.

## Risks / Trade-offs

- **Session restoration may flash login screen** → Use a loading state until session is resolved.
- **Direct URL access to `/profile` without session** → Auth guard must redirect before rendering.
- **Sign-out redirect may conflict with existing auth state listener** → Update the listener to navigate to `/login` after sign-out.
- **Sidebar responsive behavior** → shadcn base sidebar handles mobile; add only minimal project-specific styling.

## Migration Plan

1. Add React Router and shadcn sidebar dependencies if missing.
2. Create route definitions with protected layout and public login route.
3. Create authenticated layout with sidebar and config-driven navigation.
4. Update sign-out handler to redirect to `/login`.
5. Add Home and Profile placeholder pages.
6. Add 404 fallback.
7. Verify with tests and manual checks.
