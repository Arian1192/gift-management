## Context

See `proposal.md` for motivation. The repository currently has an empty `web/` directory, local Supabase configuration, and no product database schema. This slice should introduce the smallest usable web authentication foundation without adding gift-domain data.

## Goals / Non-Goals

**Goals:**

- Establish a React web app foundation only as far as needed for authentication.
- Use shadcn/ui and Tailwind CSS as the UI/component foundation for the auth screens.
- Use Supabase Auth email + password for sign-up, sign-in, session restore, and sign-out.
- Keep configuration in public web environment variables and document local setup.
- Keep the implementation reviewable as one first auth slice.

**Non-Goals:**

- No gift tables, row-level security policies, or user profile tables.
- No OAuth, magic links, password reset, or custom email templates.
- No VITO bridge changes.
- No production deployment configuration beyond environment variable shape.

## Decisions

### 1. Use Supabase Auth directly from the web app

Use the Supabase JavaScript client in `web/` for email/password auth and session events.

- **Rationale:** Supabase Auth is already the selected backend service and supports this first slice without custom server code.
- **Alternative considered:** Add an API/bridge auth layer now. Rejected because `bridge/` is intended for VITO integration, and an auth proxy would expand the first slice unnecessarily.

### 2. Keep auth state client-side for the first slice

The web app should expose signed-in/signed-out states based on Supabase session restoration and auth state changes.

- **Rationale:** There is no protected domain data yet, so route protection can remain minimal.
- **Alternative considered:** Build a full protected-route system now. Rejected until there are authenticated product screens to protect.

### 3. Use environment variables for Supabase public config

The web app should read the Supabase URL and anon key from environment variables documented in `.env.example`.

- **Rationale:** Public Supabase URL and anon key are expected client-side values, while secrets must stay out of the repo.
- **Alternative considered:** Hard-code local Supabase values. Rejected because it would make production configuration harder and encourage accidental secret handling.

### 4. Use shadcn/ui with Tailwind CSS for auth UI

Use shadcn/ui components for the first authentication forms and configure Tailwind CSS as the styling foundation required by shadcn/ui.

- **Rationale:** shadcn/ui provides accessible, composable React UI primitives without locking the app into a heavy component framework. Tailwind is required by the shadcn setup and gives the project a consistent styling baseline from the first screen.
- **Alternative considered:** Plain unstyled forms. Rejected because it would create throwaway UI and delay the design-system decision.
- **Alternative considered:** A heavier component library. Rejected because this project benefits from owning simple components directly.

### 5. Keep Supabase schema unchanged

This change should use Supabase Auth only and avoid database migrations.

- **Rationale:** Auth can be validated independently before adding user-owned gift data.
- **Alternative considered:** Add profiles table now. Rejected because profile requirements are not yet defined.

## Risks / Trade-offs

- **Email confirmation behavior differs by Supabase settings** → Keep user-facing copy generic: show the resulting auth state or message returned by Supabase safely.
- **Client-side auth state is not authorization** → Do not add protected data access in this slice; future data work must add RLS and server-side/security checks.
- **First React scaffold plus shadcn/Tailwind setup may exceed the 250-line preference** → Keep the component set minimal: only install/generate components needed for auth.
- **shadcn setup can add configuration files** → Treat config files as part of this slice, but avoid broad theming beyond the auth baseline.
- **Local Supabase may expose development tokens in CLI output** → Do not commit generated local secrets; keep `.env.example` placeholder-only.

## Migration Plan

1. Add the web app/auth files, Tailwind configuration, and minimal shadcn/ui setup in a future apply phase.
2. Verify locally with Supabase running and placeholder environment variables replaced in `.env`.
3. Roll back by removing the web auth scaffold, shadcn/Tailwind files, and dependency changes; no database rollback is expected because this slice adds no migrations.
