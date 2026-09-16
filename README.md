# Gift Management

Gift Management is starting with a small Supabase-backed authentication foundation.

## Prerequisites

- Node.js 22.22.3 (`nvm use` reads `.nvmrc`)
- Supabase CLI
- Docker running locally for Supabase services

## Local setup

```sh
nvm use
cp .env.example .env
supabase start
supabase status
```

## Web auth setup

The React app lives in `web/` and uses Supabase Auth with public browser environment variables:

```sh
npm --prefix web install
cp .env.example web/.env.local
# Fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY with local Supabase values.
npm --prefix web run dev
```

Required variables:

- `VITE_SUPABASE_URL`: local or hosted Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase anon public key. Do not use a service-role key in the browser.

## Current scope

Included in this slice:

- Minimal React app in `web/`.
- Tailwind CSS and minimal shadcn/ui-compatible component setup.
- Supabase email/password sign-up, sign-in, session restoration, and sign-out.
- Safe user-facing auth errors.

Out of scope for this slice:

- Gift-management domain tables, migrations, RLS policies, and seed data.
- VITO bridge implementation.
- OAuth, magic links, password reset, custom email templates, and user profiles.
