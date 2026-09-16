## Why

Gift Management needs a first user authentication slice so future gift data can be associated with a signed-in person instead of anonymous local state. Starting with Supabase email and password authentication gives the project a small, testable foundation before adding product-specific gift flows.

## What Changes

- Add a first authentication capability for email + password sign-up, sign-in, sign-out, and session persistence.
- Add minimal React routes/components for authentication entry points only.
- Add shadcn/ui as the component foundation for the authentication UI.
- Add Tailwind CSS because shadcn/ui depends on it for styling.
- Configure the web app to talk to the existing local Supabase project through environment variables.
- Surface clear loading and error states for authentication actions.
- Keep authorization, profiles, roles, gift data, and password recovery out of this first slice.

### Non-goals

- No gift-management domain tables or policies.
- No VITO bridge work.
- No OAuth providers.
- No password reset or email confirmation customization.
- No user profile management beyond the Supabase Auth user session.

## Capabilities

### New Capabilities

- `user-auth`: Email and password authentication behavior for end users.

### Modified Capabilities

- None.

## Impact

- Affected areas: `web/` and environment documentation.
- Supabase impact: uses Supabase Auth only; no database schema changes are planned for this slice.
- Dependencies: likely adds React app scaffolding dependencies, Supabase JS client, Tailwind CSS, and shadcn/ui setup when implementation begins.
- Configuration: requires public Supabase URL and anon key via environment variables.
